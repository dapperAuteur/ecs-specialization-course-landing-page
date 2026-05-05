import { type NextRequest } from 'next/server';
import { after } from 'next/server';
import { cookies, headers } from 'next/headers';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { COOKIE_NAME, verifyCookieValue } from '@/lib/age-gate';
import { safeWrite } from '@/lib/db-safe';
import { getDb } from '@/lib/db';
import { downloadLog } from '@/db/schema';

/**
 * Public ebook download. Reads PDF from app/ebooks/<slug>.pdf and streams
 * it. The age-gate proxy enforces the 21+ cookie before this handler runs;
 * email is NOT required (decoupled from the lead form per BAM lock 2026-05-04).
 *
 * Status codes:
 *   200: PDF found, streamed
 *   404: slug doesn't match any PDF on disk
 *   500: unreadable file
 *
 * Headers:
 *   Cache-Control: public, max-age=3600 (the ebook isn't sensitive)
 *   Content-Disposition: attachment so browsers download instead of inline
 *
 * Tracking: every successful download is logged to download_log via after()
 * so the PDF response goes back without waiting on the DB write. session_id
 * comes from the age-gate cookie and correlates with lead.consent_log.session_id
 * for funnel queries.
 */

interface RouteContext {
  params: Promise<{ slug: string }>;
}

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*$/;

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  // Defense against path traversal: slug must be lowercase alnum + hyphen.
  if (!SAFE_SLUG.test(slug)) {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }

  const pdfPath = resolve(process.cwd(), 'app', 'ebooks', `${slug}.pdf`);

  let exists = false;
  try {
    const s = await stat(pdfPath);
    exists = s.isFile();
  } catch {
    exists = false;
  }

  if (!exists) {
    return new Response('Ebook not yet available. Check back shortly.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(pdfPath);
  } catch {
    return new Response('Server error while serving the ebook.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Capture context for the log row before the response goes back.
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieResult = verifyCookieValue(cookieStore.get(COOKIE_NAME)?.value);
  const sessionId = cookieResult.ok ? cookieResult.sessionId ?? null : null;
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    null;
  const userAgent = headerStore.get('user-agent') ?? null;

  // Log the download in the background so the PDF streams without waiting
  // on the DB. Failures are logged but never surfaced to the user.
  after(async () => {
    const db = getDb();
    const result = await safeWrite('download_log.insert', () =>
      db.insert(downloadLog).values({
        slug,
        sessionId,
        ip,
        userAgent,
      }),
    );
    if (!result.ok) {
      console.error(`[ebook] download_log insert failed (${result.code})`);
    }
  });

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length.toString(),
      'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
