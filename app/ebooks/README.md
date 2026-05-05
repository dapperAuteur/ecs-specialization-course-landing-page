# Ebook PDFs

Drop ebook PDFs here as `<slug>.pdf`. The route at
[`app/ebook/[slug]/route.ts`](../ebook/[slug]/route.ts) reads from this
directory and streams the file.

## Current slugs

| Slug | Filename | Status |
|---|---|---|
| `ecs-specialization` | `ecs-specialization.pdf` | **pending** (see witus user-task `22-deliver-ecs-ebook-pdf.md`) |

When the PDF is missing the route returns 404.

## Why not `public/`?

`public/` is a static asset directory served directly by Next, which would
let the PDF be reached without going through the age-gate proxy. Putting
the PDFs under `app/ebooks/` and reading them through a route handler
ensures every download goes through `proxy.ts` first and is gated on the
21+ attestation cookie.

The download itself is **public for any 21+-attested visitor**: no token, no
form submission, no email. Email collection happens on the lead form for
people who want enrollment notifications — that's a separate flow.
