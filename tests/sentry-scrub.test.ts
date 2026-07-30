import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { ErrorEvent } from '@sentry/nextjs';
import {
  isSensitiveFormFieldName,
  isSensitiveName,
  nameSegments,
  scrubEvent,
  scrubQueryString,
  scrubText,
  scrubUrl,
} from '@/lib/sentry-scrub';

/**
 * Tests for the Sentry `beforeSend` scrubber.
 *
 * Two rules shape this file:
 *
 * 1. EVERY credential-shaped fixture is ASSEMBLED AT RUNTIME from fragments, never written as a
 *    single string literal. Realistic-looking secrets in committed source get pushes rejected by
 *    GitHub secret scanning, and a blocked push is a blocked branch.
 * 2. Every redaction assertion is paired with a COUNTER-ASSERTION that something useful survived.
 *    A scrubber that redacts everything passes the first kind of test and makes the crash report
 *    worthless, so over-redaction is treated as a failure here too.
 *
 * The primary assertions run against `JSON.stringify(scrubbedEvent)`, which is what actually goes
 * over the wire. Checking individual fields lets a secret hide in a nested container that nobody
 * remembered to walk.
 */

const join = (...parts: string[]) => parts.join('');

// --- Runtime-assembled fixtures -------------------------------------------------------------

/** A lead email. This is the single most likely piece of PII in a report from this site. */
const leadEmail = join('lead', '.', 'person', '+tag', '@', 'example', '.com');

/** 64 hex characters, the shape of `signRequest()` in lib/inbox.ts and `sign()` in age-gate. */
const hmacDigest = 'a1b2c3d4'.repeat(8);

/** A JWT. `eyJ` is base64 of `{"`, which is what makes the shape rule high precision. */
const jwt = [join('ey', 'JhbGciOiJIUzI1NiJ9'), join('ey', 'JzdWIiOiJhYmMifQ'), join('c2ln', 'bmF0dXJl')].join('.');

/** A reCAPTCHA v3 token: a long opaque base64url blob with no internal separator. */
const recaptchaToken = join('03A', 'GdBq2') + 'Xy_9-Zk'.repeat(12);

/** A Neon connection string. A driver error can echo this verbatim, credentials included. */
const dbHost = 'ep-cool-name-a1b2c3.us-east-2.aws.neon.tech';
const dbUrl = join('postgres', '://', 'neondb', '_owner', ':', 'npg', '_', 'Zq7', 'x'.repeat(24), '@', dbHost, '/ecs-leads?sslmode=require');

/** The 21+ attestation cookie: base64url payload, dot, hex signature (lib/age-gate.ts). */
const ageCookie = join('eyJhdHRlc3RlZF9hdCI6IjIwMjYtMDctMjkifQ', '.', hmacDigest);

/** A short, shapeless secret. Nothing about the VALUE says "credential", so only a key-aware
 *  pass can catch it. That is the whole point of these two. */
const shapelessSecret = join('sho', 'rt-opaque-value');
const shapelessToken = join('ano', 'ther-shapeless-value');

/** A plain-prose password. */
const prosePassword = join('hunt', 'er2');

/** Two distinct 32-hex values: one goes in `contexts.trace` (must survive), one in `extra`
 *  (must be redacted). Using the same value for both would make the test unable to tell. */
const traceId = 'ab12cd34'.repeat(4);
const hexInExtra = 'fe98dc76'.repeat(4);

const SITE = 'https://ecs-specialization.betterbud.club';

// --- Event builder --------------------------------------------------------------------------

function buildEvent(): ErrorEvent {
  return {
    // `ErrorEvent` narrows `Event` with an explicit undefined `type`.
    type: undefined,
    message: `submitLead failed for ${leadEmail}: password: ${prosePassword}, bearer ${jwt}`,
    transaction: '/thanks',
    exception: {
      values: [
        {
          type: 'Error',
          value: `connect ECONNREFUSED ${dbUrl} while inserting lead`,
        },
      ],
    },
    user: {
      id: 'lead_42',
      email: leadEmail,
      ip_address: '203.0.113.7',
      username: leadEmail,
    },
    request: {
      url: `${SITE}/thanks?email=${encodeURIComponent(leadEmail)}&interest=neuroscience&next=/thanks&state=xyz123`,
      method: 'GET',
      query_string: `email=${encodeURIComponent(leadEmail)}&interest=neuroscience&code=grant_abc123`,
      cookies: { ecs_age_attested: ageCookie },
      env: { REMOTE_ADDR: '203.0.113.7' },
      headers: {
        cookie: `ecs_age_attested=${ageCookie}`,
        authorization: `Bearer ${jwt}`,
        'X-Witus-Signature': hmacDigest,
        'user-agent': 'Mozilla/5.0 (iPhone)',
        referer: `${SITE}/thanks?email=${encodeURIComponent(leadEmail)}`,
      },
      data: {
        email: leadEmail,
        name: 'Casey Rivera',
        phone: '+1 555 0100',
        interest: 'neuroscience',
        recaptchaToken,
        recaptchaScore: '0.90',
      },
    },
    extra: {
      apiKey: shapelessSecret,
      access_token: shapelessToken,
      ageCookie,
      code: '23505',
      state: 'submitted',
      digest: hexInExtra,
      ebookUrl: `${SITE}/ebook/ecs-primer`,
      note: 'token is expired',
      nested: { deeper: { secretKey: shapelessSecret, slug: 'ecs-primer' } },
    },
    tags: {
      'user.email': leadEmail,
      route: '/ebook/[slug]',
      'route.type': 'route',
    },
    contexts: {
      trace: { trace_id: traceId, span_id: 'a1b2c3d4a1b2c3d4' },
      runtime: { name: 'node', version: 'v22.0.0' },
      response: { status_code: 500 },
    },
    breadcrumbs: [
      {
        category: 'fetch',
        message: `POST ${SITE}/thanks?email=${encodeURIComponent(leadEmail)}`,
        data: { url: `${SITE}/api/ingest?signature=${hmacDigest}`, status_code: 500 },
      },
    ],
  };
}

const scrubbedJson = () => JSON.stringify(scrubEvent(buildEvent()));

// --- Redaction ------------------------------------------------------------------------------

describe('scrubEvent: nothing sensitive survives serialization', () => {
  const json = scrubbedJson();

  it('removes the lead email everywhere it appears', () => {
    expect(json).not.toContain(leadEmail);
    // Also the percent-encoded form, which is how it rides in a URL.
    expect(json).not.toContain(encodeURIComponent(leadEmail));
    expect(json).not.toContain('lead.person');
  });

  it('removes the 21+ attestation cookie, the HMAC digest, and the JWT', () => {
    expect(json).not.toContain(ageCookie);
    expect(json).not.toContain(hmacDigest);
    expect(json).not.toContain(jwt);
  });

  it('removes the reCAPTCHA token', () => {
    expect(json).not.toContain(recaptchaToken);
  });

  it('removes database credentials but keeps the host', () => {
    expect(json).not.toContain('npg_');
    expect(json).not.toContain('neondb_owner');
    // Counter-assertion: the host is how you tell a pooler outage from a bad password.
    expect(json).toContain(dbHost);
  });

  it('removes a prose password', () => {
    expect(json).not.toContain(prosePassword);
  });

  it('drops the whole cookie jar, the request env, and secret-named headers', () => {
    const event = scrubEvent(buildEvent());
    expect(event.request?.cookies).toBeUndefined();
    expect(event.request?.env).toBeUndefined();
    expect(event.request?.headers?.cookie).toBeUndefined();
    expect(event.request?.headers?.authorization).toBeUndefined();
    expect(event.request?.headers?.['X-Witus-Signature']).toBeUndefined();
  });

  it('strips account identity from event.user but keeps the opaque id', () => {
    const event = scrubEvent(buildEvent());
    expect(event.user?.email).toBeUndefined();
    expect(event.user?.ip_address).toBeUndefined();
    expect(event.user?.username).toBeUndefined();
    expect(event.user?.id).toBe('lead_42');
  });

  it('never returns null, because we still want the crash signal', () => {
    expect(scrubEvent(buildEvent())).not.toBeNull();
  });
});

// --- Counter-assertions: the report has to stay useful ---------------------------------------

describe('scrubEvent: triage context survives', () => {
  const json = scrubbedJson();

  it('keeps the origin, the route, and the path shape', () => {
    expect(json).toContain('ecs-specialization.betterbud.club');
    expect(json).toContain('/thanks');
    expect(json).toContain('/ebook/[slug]');
  });

  it('keeps non-secret query parameters', () => {
    expect(json).toContain('interest=neuroscience');
    expect(json).toContain('next=/thanks');
    // `state` is NOT a secret. Substring matching used to make it one in a sibling repo.
    expect(json).toContain('state=xyz123');
  });

  it('keeps the reCAPTCHA score even though the token next to it is redacted', () => {
    expect(json).toContain('0.90');
  });

  it('keeps error codes and status codes', () => {
    // `code` is a Postgres SQLSTATE here (lib/db-safe.ts), the most useful field in the report.
    expect(json).toContain('23505');
    expect(json).toContain('500');
    expect(json).toContain('submitted');
  });

  it('keeps runtime context', () => {
    expect(json).toContain('node');
    expect(json).toContain('v22.0.0');
  });

  it('keeps a public ebook slug, in the path and as a value', () => {
    // Path context beats shape: /ebook/<slug> is a product slug, not a credential.
    expect(json).toContain('/ebook/ecs-primer');
    expect(json).toContain('ecs-primer');
  });

  it('does not mangle prose that merely mentions a token', () => {
    expect(json).toContain('token is expired');
  });

  it('exempts contexts.trace, which is Sentry plumbing rather than user data', () => {
    // 32 hex characters, the same shape as a secret. Redacting it would break event grouping.
    expect(json).toContain(traceId);
    // Proof the exemption is narrow: the same shape in `extra` IS redacted.
    expect(json).not.toContain(hexInExtra);
  });
});

// --- Lesson-specific regressions ------------------------------------------------------------

describe('query_string is a separate field from url', () => {
  it('scrubs query_string even when the url carries no query at all', () => {
    const event = scrubEvent({
      type: undefined,
      request: {
        url: `${SITE}/thanks`,
        query_string: `email=${encodeURIComponent(leadEmail)}&interest=fitness`,
      },
    });
    const json = JSON.stringify(event);
    expect(json).not.toContain(leadEmail);
    expect(json).not.toContain(encodeURIComponent(leadEmail));
    expect(json).toContain('interest=fitness');
  });

  it('handles the object shape', () => {
    const event = scrubEvent({
      request: { query_string: { email: leadEmail, interest: 'fitness' } },
    } as unknown as ErrorEvent);
    const json = JSON.stringify(event);
    expect(json).not.toContain(leadEmail);
    expect(json).toContain('fitness');
  });

  it('handles the array-of-pairs shape', () => {
    const event = scrubEvent({
      request: { query_string: [['email', leadEmail], ['interest', 'fitness']] },
    } as unknown as ErrorEvent);
    const json = JSON.stringify(event);
    expect(json).not.toContain(leadEmail);
    expect(json).toContain('fitness');
  });
});

describe('name matching is per segment, and underscores are separators', () => {
  it('splits on underscores, hyphens, dots, and camelCase', () => {
    expect(nameSegments('access_token')).toEqual(['access', 'token']);
    expect(nameSegments('recaptchaToken')).toEqual(['recaptcha', 'token']);
    expect(nameSegments('X-Witus-Signature')).toEqual(['x', 'witus', 'signature']);
    expect(nameSegments('user.email')).toEqual(['user', 'email']);
  });

  it('treats a secret segment as secret however it is delimited', () => {
    expect(isSensitiveName('access_token')).toBe(true);
    expect(isSensitiveName('accessToken')).toBe(true);
    expect(isSensitiveName('ACCESS-TOKEN')).toBe(true);
    expect(isSensitiveName('ip_address')).toBe(true);
  });

  it('does not fire on names that merely contain a secret word as a substring', () => {
    expect(isSensitiveName('state')).toBe(false);
    expect(isSensitiveName('design')).toBe(false);
    expect(isSensitiveName('zip')).toBe(false);
    expect(isSensitiveName('recaptchaScore')).toBe(false);
    expect(isSensitiveName('sessionId')).toBe(false);
    expect(isSensitiveName('code')).toBe(false);
    expect(isSensitiveName('interest')).toBe(false);
  });

  it('redacts a shapeless value purely on its key, in a nested container', () => {
    const event = scrubEvent({
      type: undefined,
      extra: { apiKey: shapelessSecret, nested: { deeper: { secret_key: shapelessSecret } } },
    });
    expect(JSON.stringify(event)).not.toContain(shapelessSecret);
  });

  it('treats `code` as a secret in a query string but not as an object key', () => {
    expect(scrubQueryString('code=grant_abc123')).toContain('[redacted]');
    const event = scrubEvent({ type: undefined, extra: { code: '23505' } });
    expect(JSON.stringify(event)).toContain('23505');
  });

  it('treats `name` as a person in a form body and as a label everywhere else', () => {
    expect(isSensitiveFormFieldName('name')).toBe(true);
    expect(isSensitiveName('name')).toBe(false);

    const event = scrubEvent(buildEvent());
    // The lead's name is gone from the submitted form body...
    expect(JSON.stringify(event.request?.data)).not.toContain('Casey Rivera');
    // ...while `contexts.runtime.name` and the route tag, which are labels, survive.
    expect(event.contexts?.runtime?.name).toBe('node');
    expect(event.tags?.route).toBe('/ebook/[slug]');
  });
});

describe('browser portability', () => {
  it('uses no regex lookbehind anywhere in the module', () => {
    // A lookbehind group is a SyntaxError on iOS Safari below 16.4. This module ships in a
    // browser chunk via instrumentation-client.ts, so a SyntaxError breaks that chunk for those
    // users EVEN WITH NO DSN SET. This assertion is the guard against a well-meaning rewrite.
    // The check covers comments too, deliberately: keeping the syntax out of the file entirely
    // is what lets the guard stay this simple.
    const source = readFileSync(new URL('../lib/sentry-scrub.ts', import.meta.url), 'utf8');
    expect(source).not.toContain('(?<=');
    expect(source).not.toContain('(?<!');
    expect(source).not.toMatch(/\(\?</);
  });
});

describe('scrubText and scrubUrl', () => {
  it('is idempotent, so a second pass cannot produce nested markers', () => {
    const text = `email ${leadEmail} token=${jwt} bearer ${recaptchaToken} db ${dbUrl} sig: ${hmacDigest}`;
    const once = scrubText(text);
    expect(scrubText(once)).toBe(once);
    expect(once).not.toContain('[[');
  });

  it('redacts a token-shaped path segment but not a public ebook slug', () => {
    expect(scrubUrl(`${SITE}/reset/${hmacDigest}`)).not.toContain(hmacDigest);
    expect(scrubUrl(`${SITE}/ebook/ecs-primer`)).toBe(`${SITE}/ebook/ecs-primer`);
  });

  it('keeps a relative URL relative', () => {
    const out = scrubUrl(`/thanks?email=${encodeURIComponent(leadEmail)}&interest=fitness`);
    expect(out.startsWith('/thanks')).toBe(true);
    expect(out).not.toContain('scrub.invalid');
    expect(out).not.toContain(encodeURIComponent(leadEmail));
    expect(out).toContain('interest=fitness');
  });

  it('strips userinfo from any scheme, not just http', () => {
    const out = scrubText(dbUrl);
    expect(out).not.toContain('npg_');
    expect(out).toContain('postgres://[redacted]@');
    expect(out).toContain(dbHost);
  });

  it('leaves ordinary prose completely alone', () => {
    const prose = 'Lead insert failed: unique_violation on email, retrying in 5s';
    expect(scrubText(prose)).toBe(prose);
  });
});
