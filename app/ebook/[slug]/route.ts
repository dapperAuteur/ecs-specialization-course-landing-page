import { type NextRequest } from 'next/server';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { verifyDownloadToken } from '@/lib/ebook';

/**
 * Signed-JWT ebook download.
 *
 * Reads PDF from app/ebooks/<slug>.pdf — non-public. Distinct status codes:
 *   401 — token missing/invalid/expired/slug-mismatch
 *   503 — config gap: PDF not yet on disk (per witus user-task #22)
 *   500 — anything else
 *
 * Headers ensure the PDF doesn't get cached publicly or indexed:
 *   Cache-Control: private, no-store
 *   X-Robots-Tag:  noindex, nofollow
 */

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const token = req.nextUrl.searchParams.get('t');

  const result = verifyDownloadToken(token, slug);
  if (!result.ok) {
    const message =
      result.reason === 'expired'
        ? 'This download link has expired. Request a fresh one from your email.'
        : 'This download link is invalid. Request a fresh one from your email.';
    return new Response(message, { status: 401, headers: { 'Content-Type': 'text/plain' } });
  }

  // Resolve the PDF path. app/ebooks/<slug>.pdf — non-public so only this
  // route can read it.
  const pdfPath = resolve(process.cwd(), 'app', 'ebooks', `${slug}.pdf`);

  let exists = false;
  try {
    const s = await stat(pdfPath);
    exists = s.isFile();
  } catch {
    exists = false;
  }

  if (!exists) {
    // Distinguish from 401: this is a config gap (PDF not yet delivered),
    // not a token problem. See witus/plans/user-tasks/22-deliver-ecs-
    // ebook-pdf.md.
    return new Response(
      'Ebook delivery is temporarily unavailable while we finalise materials. We have your email; you will receive an update shortly.',
      { status: 503, headers: { 'Content-Type': 'text/plain', 'Retry-After': '3600' } },
    );
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(pdfPath);
  } catch {
    return new Response('Server error while serving the ebook. Please try again.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length.toString(),
      'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
