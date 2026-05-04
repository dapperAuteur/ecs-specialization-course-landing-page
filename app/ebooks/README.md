# Ebook PDFs (non-public)

Drop ebook PDFs here as `<slug>.pdf`. The signed-JWT route at
[`app/ebook/[slug]/route.ts`](../ebook/[slug]/route.ts) reads from this
directory at runtime; nothing else does.

## Current slugs

| Slug | Filename | Status |
|---|---|---|
| `ecs-specialization` | `ecs-specialization.pdf` | **pending** — see witus user-task `22-deliver-ecs-ebook-pdf.md` |

When the PDF is missing, the route returns 503 with a friendly message
("Ebook delivery is temporarily unavailable…") instead of 404, so users on
24-hour download links don't get told their token is invalid when the real
issue is config.

## Why not `public/`?

`public/` is unconditionally crawlable. Putting ebook PDFs there would let
anyone with the URL — or anyone scraping a sitemap — download the file
without going through the form. The JWT route + `app/ebooks/` location is
the only access path: token verifies → server reads file from this directory
→ streams with `Cache-Control: private, no-store` + `X-Robots-Tag: noindex,
nofollow`.
