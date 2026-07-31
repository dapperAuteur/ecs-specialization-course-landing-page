import type { ErrorEvent } from '@sentry/nextjs';

/**
 * Sentry `beforeSend` scrubber for the ECS Specialization landing page.
 *
 * Why this file exists
 * --------------------
 * A crash report is a copy of our request context sent to a third party. On this site that
 * context can contain, in order of how badly it would hurt:
 *
 *   1. A lead's EMAIL. `submitLead` redirects to `/thanks?email=<encoded>` (app/actions.ts),
 *      so the email rides in the URL and therefore in `event.request.url` AND in the separate
 *      `event.request.query_string` field. It is also a form field and a Zod error value.
 *   2. The 21+ attestation COOKIE (`ecs_age_attested`, lib/age-gate.ts): a signed bearer value
 *      that satisfies a hard compliance gate.
 *   3. The reCAPTCHA token (`recaptchaToken`) and the inbox HMAC signature header
 *      (`X-Witus-Signature`, lib/inbox.ts).
 *   4. The Neon connection string. A driver error can echo `postgres://user:pass@host/db`,
 *      which is full database credentials.
 *
 * The bias is REDACT WHEN UNSURE for anything credential-shaped, but NOT so wide that the
 * report stops being useful: we keep the host, the path, the status codes, the reCAPTCHA
 * SCORE, and the ebook slug, because those are what you actually triage with. Over-redaction
 * is a real cost, so every rule below is deliberately narrow and the unit test asserts both
 * directions (see tests/sentry-scrub.test.ts).
 *
 * This never returns null: we still want the crash signal, just without the credentials.
 *
 * Portability constraints (learned the hard way in sibling repos)
 * --------------------------------------------------------------
 * - NO REGEX LOOKBEHIND. A lookbehind group is a SyntaxError on iOS Safari below 16.4, and because
 *   this module is imported by instrumentation-client.ts it ships in a browser chunk. A
 *   SyntaxError there breaks the chunk for those users EVEN WHEN NO DSN IS SET. Every rule
 *   below captures its leading boundary and re-emits it instead. Lookahead is fine (ES3).
 * - NO `\b` AROUND LABELS. `_` is a word character, so `\btoken\b` does not match the `token`
 *   in `access_token`. Boundaries here are explicit `[^A-Za-z0-9]` classes, and key names are
 *   split on `_`/`-`/`.` before comparison.
 * - Pure and dependency-free (the `@sentry/nextjs` import is type-only and erases at compile
 *   time) so it is directly unit-testable without booting the SDK.
 */

/**
 * The replacement marker. The square brackets are load-bearing in two places, so do not swap
 * them for a bare word:
 *
 *   1. `EMAIL_RE` needs a local-part character immediately before the `@`. After a userinfo
 *      redaction the string reads `postgres://[redacted]@host`, and `]` is not a local-part
 *      character, so the email rule cannot then eat the HOST we deliberately kept for triage.
 *   2. `[` and `]` are excluded from every "secret value" character class below, so running the
 *      scrubber over already-scrubbed text is a no-op instead of producing `[[redacted]]`.
 */
export const REDACTED = '[redacted]';

/**
 * Name segments that mark a value as a CREDENTIAL. Compared as whole segments after the name
 * is split on camelCase and on any non-alphanumeric run, which is the fix for two separate
 * sibling-repo bugs:
 *
 *   - substring matching made `state` secret (it is not) and made `design` match `sig`;
 *   - `\b` matching missed `access_token` entirely because `_` is a word character.
 *
 * Deliberately ABSENT:
 *   `recaptcha`  so `recaptchaScore` survives (the score is triage data, not a secret; the
 *                token is caught by the `token` segment anyway).
 *   `session`    `sessionId` (lib/age-gate.ts) is an opaque correlation id that grants
 *                nothing on its own, and it is how a download is tied to a lead. A real
 *                `sessionToken` still trips the `token` segment.
 *   `code`       this app uses `code` for result discriminators and Postgres SQLSTATEs
 *                (lib/db-safe.ts) where it is the most useful field in the report. It IS
 *                treated as secret in a QUERY STRING, where `?code=` means a grant.
 *   `name`       `contexts.runtime.name`, `browser.name` and transaction names are all
 *                keyed `name`; redacting it would gut the report for little gain.
 */
const SECRET_SEGMENTS = new Set([
  'token',
  'tokens',
  'secret',
  'secrets',
  'password',
  'passwords',
  'passwd',
  'pwd',
  'passcode',
  'apikey',
  'key',
  'keys',
  'auth',
  'authorization',
  'bearer',
  'credential',
  'credentials',
  'signature',
  'sig',
  'hmac',
  'otp',
  'pin',
  'jwt',
  'dsn',
  'cookie',
  'cookies',
]);

/** Name segments that mark a value as PII rather than a credential. Same segment matching, so
 *  `ipAddress` and `ip_address` both trip `ip` while `zip` (one segment) does not. */
const PII_SEGMENTS = new Set(['email', 'emails', 'phone', 'phones', 'tel', 'telephone', 'ip']);

/** Segments that are secret ONLY as a query-parameter name. `?code=` is a grant to redeem;
 *  an object key named `code` is a status code. Same word, opposite meaning, so the decision
 *  is made from context rather than from the name alone. */
const QUERY_ONLY_SECRET_SEGMENTS = new Set(['code', 'nonce', 'ticket']);

/**
 * Segments that are PII only inside a FORM BODY (`event.request.data`).
 *
 * Path context again: in `request.data` a key called `name` is the lead's name, because the only
 * form on this site posts `{ email, name, phone, interest, ... }` (app/actions.ts). Everywhere
 * else `name` is a label: `contexts.runtime.name`, `contexts.os.name`, a transaction name. So the
 * segment is only treated as PII where we know what it means, and `birthdate` is included because
 * lib/age-gate.ts deliberately never stores one, which makes its appearance a compliance smell.
 */
const FORM_PII_SEGMENTS = new Set([
  'name',
  'firstname',
  'lastname',
  'fullname',
  'surname',
  'birthdate',
  'birthday',
  'dob',
]);

/**
 * Path prefixes whose segments are PUBLIC BY DESIGN and must survive intact.
 *
 * `/ebook/<slug>` is a product slug (app/ebook/[slug]/route.ts enforces `^[a-z0-9][a-z0-9-]*$`),
 * not a credential: that download is gated by the age-gate cookie, never by a URL token. A long
 * slug and a long token are the same SHAPE, so shape alone cannot tell them apart. Path context
 * decides, and it wins over shape.
 */
const PUBLIC_PATH_PREFIXES = ['/ebook/'];

/** JWT shape. `eyJ` is base64 of `{"`, which makes this high precision. Signed ebook links and
 *  any Better Auth style token look like this. */
const JWT_RE = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{4,}/g;

/** 32+ hex characters: an HMAC-SHA256 digest (lib/inbox.ts `signRequest`, lib/age-gate.ts
 *  `sign`) or a hex secret. Boundaries are captured classes, never `\b`. */
const LONG_HEX_RE = /(^|[^A-Za-z0-9])([A-Fa-f0-9]{32,})(?![A-Za-z0-9])/g;

/** 64+ characters of pure token alphabet with no separator: a reCAPTCHA v3 token, a base64url
 *  cookie payload, an opaque bearer blob. Prose does not contain 64-character words, and a real
 *  identifier that long is not something we want in a third-party crash report. */
const OPAQUE_BLOB_RE = /(^|[^A-Za-z0-9_-])([A-Za-z0-9_-]{64,})(?![A-Za-z0-9_-])/g;

/** Credentials in any URL's userinfo, which is how a Neon connection string leaks:
 *  `postgres://user:pass@ep-x.aws.neon.tech/db`. The class stops at `/` so a path is never
 *  swallowed, and this runs BEFORE the email rule so the host stays readable for triage. */
const URL_USERINFO_RE = /([A-Za-z][A-Za-z0-9+.-]*:\/\/)[^/\s@]+@/g;

/** Absolute http(s) URLs inside free text, handed to `scrubUrl` for per-parameter treatment. */
const HTTP_URL_RE = /https?:\/\/[^\s<>"'`)\]}]+/g;

/** `token=abc`, `"apiKey":"abc"`, `Secret: abc`. The separator is REQUIRED: without it,
 *  "password reset failed" would be mangled in every report. An optional quote either side of
 *  the separator is what makes the JSON-ish form match. */
const ASSIGNED_SECRET_RE =
  /(^|[^A-Za-z0-9])((?:api[_-]?keys?|secret[_-]?keys?|access[_-]?tokens?|refresh[_-]?tokens?|id[_-]?tokens?|auth[_-]?tokens?|passwords?|passwd|pwd|passcodes?|secrets?|tokens?|signatures?|sig|hmac|otps?|jwt|dsn|authorization|set[_-]?cookie|cookie)["']?\s*[:=]\s*["']?)([^\s"'`,;)[\]}&]{3,})/gi;

/** `PIN is 1234`, `one-time code is 998812`. `is` is allowed only for labels that are always a
 *  secret, so "token is expired" keeps the word "expired" and stays triageable. */
const LABELLED_SECRET_RE =
  /(^|[^A-Za-z0-9])((?:passwords?|passcodes?|pins?|one[-_\s]?time[-_\s]?code|access[-_\s]?code|verification[-_\s]?code|security[-_\s]?code)\s+is\s+)([^\s"'`,;)[\]}&]{3,})/gi;

/** `Authorization: Bearer <token>`. A space is a legitimate separator here, unlike above. */
const BEARER_RE = /(^|[^A-Za-z0-9])(bearer|basic)(\s+)([A-Za-z0-9._~+/=-]{8,})/gi;

/** Email addresses, which on this site is the single most likely thing to be in a report. */
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** How deep to walk a nested `extra` / breadcrumb payload before giving up. */
const MAX_DEPTH = 8;

/**
 * Split a key or parameter name into lowercase segments.
 *
 * `access_token` -> ['access','token']   `recaptchaToken` -> ['recaptcha','token']
 * `X-Witus-Signature` -> ['x','witus','signature']       `state` -> ['state']
 *
 * The camelCase split uses capture groups rather than lookbehind, per the portability note at
 * the top of this file.
 */
export function nameSegments(name: string): string[] {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** True when any whole segment of the name marks the value as a credential or as PII. */
export function isSensitiveName(name: string): boolean {
  return nameSegments(name).some((s) => SECRET_SEGMENTS.has(s) || PII_SEGMENTS.has(s));
}

/** Query-parameter names add the context-only segments (`code`, `nonce`, `ticket`). */
function isSensitiveParamName(name: string): boolean {
  const segments = nameSegments(name);
  return segments.some(
    (s) => SECRET_SEGMENTS.has(s) || PII_SEGMENTS.has(s) || QUERY_ONLY_SECRET_SEGMENTS.has(s),
  );
}

/** Form-body key names add the person-identifying segments. */
export function isSensitiveFormFieldName(name: string): boolean {
  const segments = nameSegments(name);
  return segments.some(
    (s) => SECRET_SEGMENTS.has(s) || PII_SEGMENTS.has(s) || FORM_PII_SEGMENTS.has(s),
  );
}

/** Shape-only pass: no name context, no URL parsing. Used on values whose name already came
 *  back clean, so a secret hiding inside an innocuous parameter is still caught. */
function scrubShapes(text: string): string {
  return text
    .replace(URL_USERINFO_RE, (_m, scheme: string) => `${scheme}${REDACTED}@`)
    .replace(JWT_RE, REDACTED)
    .replace(LONG_HEX_RE, (_m, boundary: string) => `${boundary}${REDACTED}`)
    .replace(OPAQUE_BLOB_RE, (_m, boundary: string) => `${boundary}${REDACTED}`)
    .replace(EMAIL_RE, REDACTED);
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch {
    return value;
  }
}

/**
 * Scrub a raw `a=1&b=2` query string by PARAMETER NAME first, then by shape.
 *
 * This exists as its own exported function because `event.request.query_string` is a SEPARATE
 * field from `event.request.url`: scrubbing only the URL leaves the email sitting in the event
 * in plain text. That was a real miss in an earlier sibling repo.
 *
 * A value that needed no change keeps its original percent-encoding; only a value we actually
 * touched is rewritten, so the string stays faithful to what the browser sent.
 */
export function scrubQueryString(qs: string): string {
  return qs
    .split('&')
    .map((pair) => {
      if (!pair) return pair;
      const eq = pair.indexOf('=');
      if (eq === -1) return pair;
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      if (isSensitiveParamName(safeDecode(name))) return `${name}=${REDACTED}`;
      const decoded = safeDecode(value);
      const scrubbed = scrubShapes(decoded);
      return `${name}=${scrubbed === decoded ? value : scrubbed}`;
    })
    .join('&');
}

/** `query_string` is typed as a string, an object, or an array of pairs. All three shapes turn
 *  up in practice depending on which integration built the event, so all three are handled. */
type QueryStringLike = string | { [key: string]: string } | Array<[string, string]>;

function scrubQueryStringLike(qs: QueryStringLike): QueryStringLike {
  if (typeof qs === 'string') return scrubQueryString(qs);
  if (Array.isArray(qs)) {
    return qs.map(([name, value]) =>
      isSensitiveParamName(name)
        ? ([name, REDACTED] as [string, string])
        : ([name, scrubShapes(value)] as [string, string]),
    );
  }
  const out: { [key: string]: string } = {};
  for (const [name, value] of Object.entries(qs)) {
    out[name] = isSensitiveParamName(name) ? REDACTED : scrubShapes(value);
  }
  return out;
}

function isTokenShapedSegment(segment: string): boolean {
  return (
    /^eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{4,}$/.test(segment) ||
    /^[A-Fa-f0-9]{32,}$/.test(segment) ||
    /^[A-Za-z0-9_-]{64,}$/.test(segment)
  );
}

/**
 * Scrub one URL: strip userinfo, redact secret-named parameters, redact token-shaped path
 * segments unless the path is public by design. Origin and path shape are preserved because
 * "which route blew up" is the whole point of the report.
 *
 * Relative URLs are supported (a Next.js event can carry `/thanks?email=...`) by parsing
 * against a throwaway base and re-emitting without it.
 */
export function scrubUrl(raw: string): string {
  const isAbsolute = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(raw);
  let url: URL;
  try {
    url = new URL(raw, isAbsolute ? undefined : 'http://scrub.invalid');
  } catch {
    // Unparseable: we cannot reason about it, so fall back to the shape-only pass.
    return scrubShapes(raw);
  }

  url.username = '';
  url.password = '';

  const isPublicPath = PUBLIC_PATH_PREFIXES.some((p) => url.pathname.startsWith(p));
  const path = isPublicPath
    ? url.pathname
    : url.pathname
        .split('/')
        .map((segment) => (isTokenShapedSegment(segment) ? REDACTED : segment))
        .join('/');

  const search = url.search ? `?${scrubQueryString(url.search.slice(1))}` : '';
  const hash = url.hash ? `#${scrubShapes(url.hash.slice(1))}` : '';
  // `protocol` + `host` rather than `origin`, because `origin` is the string "null" for a
  // non-special scheme and this can be handed a `postgres://` URL.
  const prefix = isAbsolute ? `${url.protocol}//${url.host}` : '';
  return `${prefix}${path}${search}${hash}`;
}

/**
 * Full text pass for a message, an exception value, or any string found while walking the
 * event. Order matters: userinfo before email so a connection string keeps its host, URLs
 * before the generic shape rules so parameters are judged by NAME, and the broad shape rules
 * last so anything left over is still caught.
 */
export function scrubText(text: string): string {
  return text
    .replace(URL_USERINFO_RE, (_m, scheme: string) => `${scheme}${REDACTED}@`)
    .replace(HTTP_URL_RE, (match: string) => scrubUrl(match))
    .replace(ASSIGNED_SECRET_RE, (_m, boundary: string, head: string) => `${boundary}${head}${REDACTED}`)
    .replace(LABELLED_SECRET_RE, (_m, boundary: string, head: string) => `${boundary}${head}${REDACTED}`)
    .replace(BEARER_RE, (_m, boundary: string, scheme: string, gap: string) => `${boundary}${scheme}${gap}${REDACTED}`)
    .replace(JWT_RE, REDACTED)
    .replace(LONG_HEX_RE, (_m, boundary: string) => `${boundary}${REDACTED}`)
    .replace(OPAQUE_BLOB_RE, (_m, boundary: string) => `${boundary}${REDACTED}`)
    .replace(EMAIL_RE, REDACTED);
}

/**
 * KEY-AWARE deep walk. A shape-only pass cannot know that `{ apiKey: 'abcd' }` is a secret,
 * because `abcd` looks like nothing. So the key decides first (whole-segment match), and only
 * when the key comes back clean does the value get the text pass.
 *
 * Mutates in place, which is what Sentry expects from `beforeSend`.
 */
function scrubDeep(
  value: unknown,
  depth: number,
  isSensitive: (key: string) => boolean = isSensitiveName,
): unknown {
  if (typeof value === 'string') return scrubText(value);
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return value;
  if (depth >= MAX_DEPTH) return value;

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      value[i] = scrubDeep(value[i], depth + 1, isSensitive);
    }
    return value;
  }

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    record[key] = isSensitive(key) ? REDACTED : scrubDeep(record[key], depth + 1, isSensitive);
  }
  return record;
}

/**
 * `beforeSend` hook. Wired into all three runtimes (sentry.server.config.ts,
 * sentry.edge.config.ts, instrumentation-client.ts).
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.message) event.message = scrubText(event.message);
  if (event.transaction) event.transaction = scrubText(event.transaction);

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = scrubText(exception.value);
  }

  // Account identity and network origin: never shipped. `sendDefaultPii: false` should already
  // prevent most of this; deleting it here is the second line of defense.
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
    scrubDeep(event.user, 1);
  }

  if (event.request) {
    const request = event.request;
    if (typeof request.url === 'string') request.url = scrubUrl(request.url);

    // SEPARATE FIELD from `url`. Scrubbing the URL alone leaves `?email=` here in the clear.
    if (request.query_string !== undefined) {
      request.query_string = scrubQueryStringLike(request.query_string as QueryStringLike);
    }

    // The whole cookie jar goes: the age-gate attestation cookie is a bearer value.
    delete request.cookies;

    // Sentry's convention puts SERVER_NAME / REMOTE_ADDR here. Nothing in it aids triage and
    // a future integration could widen it, so drop it wholesale.
    delete request.env;

    if (request.headers) {
      const headers = request.headers;
      for (const name of Object.keys(headers)) {
        // Catches `cookie`, `set-cookie`, `authorization`, and `x-witus-signature`.
        if (isSensitiveName(name)) delete headers[name];
        else headers[name] = scrubText(headers[name]);
      }
    }

    // Form bodies land here: `email`, `name`, `phone`, `recaptchaToken`. This is the one place
    // `name` means a person rather than a label, so it gets the wider form-field rule.
    if (request.data !== undefined) {
      request.data = scrubDeep(request.data, 1, isSensitiveFormFieldName);
    }
  }

  if (event.extra) scrubDeep(event.extra, 1);

  if (event.tags) {
    for (const key of Object.keys(event.tags)) {
      const value = event.tags[key];
      if (isSensitiveName(key)) event.tags[key] = REDACTED;
      else if (typeof value === 'string') event.tags[key] = scrubText(value);
    }
  }

  if (event.contexts) {
    for (const name of Object.keys(event.contexts)) {
      // `contexts.trace` is Sentry's own plumbing: `trace_id` and `span_id` are 32 and 16 hex
      // characters, so the LONG_HEX rule would eat the trace id and silently break event
      // grouping and trace linking. It carries no user data, so exempt it.
      if (name === 'trace') continue;
      scrubDeep(event.contexts[name], 1);
    }
  }

  for (const breadcrumb of event.breadcrumbs ?? []) {
    if (breadcrumb.message) breadcrumb.message = scrubText(breadcrumb.message);
    if (breadcrumb.data) breadcrumb.data = scrubDeep(breadcrumb.data, 1) as typeof breadcrumb.data;
  }

  return event;
}
