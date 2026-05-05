import { type NextRequest } from 'next/server';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Public ebook download. Reads PDF from app/ebooks/<slug>.pdf and streams
 * it. The age-gate proxy enforces the 21+ cookie before this handler runs;
 * email is NOT required (decoupled from the lead form per BAM lock 2026-05-04).
 *
 * Status codes:
 *   200 — PDF found, streamed
 *   404 — slug doesn't match any PDF on disk
 *   500 — unreadable file
 *
 * Headers:
 *   Cache-Control: public, max-age=3600 (the ebook isn't sensitive)
 *   Content-Disposition: attachment so browsers download instead of inline
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
