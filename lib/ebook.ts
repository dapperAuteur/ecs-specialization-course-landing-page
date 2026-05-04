/**
 * Ebook delivery — signed-JWT URL minting.
 *
 * STUB (Phase 5): returns a placeholder URL so the server action and
 * /thanks page can be wired end-to-end. Phase 8 replaces this with
 * real HMAC-SHA256 JWT signing keyed off EBOOK_JWT_SECRET, and adds
 * the route at app/ebook/[slug]/route.ts that verifies + serves the
 * PDF from app/ebooks/<slug>.pdf.
 */

export interface MintedUrl {
  url: string;
  expiresAt: string;
}

export function mintDownloadUrl(args: { slug: string; leadId: string; ttlHours?: number }): MintedUrl {
  // PHASE 8 TODO: real JWT mint
  const expiresAt = new Date(Date.now() + (args.ttlHours ?? 24) * 3600 * 1000).toISOString();
  return {
    url: `/ebook/${args.slug}?t=stub-${args.leadId}`,
    expiresAt,
  };
}
