# ECS Specialization

Endocannabinoid System specialization course lead capture.

## About

Deployed at [ecs-specialization.betterbud.club](https://ecs-specialization.betterbud.club). This site's one job is lead capture for a class about the **endogenous** cannabinoid system — the mammalian signaling network of receptors, ligands, and enzymes that regulates homeostasis. The curriculum is human-biology science education. It is **not** about the cannabis plant and it is not a drug-use course.

Operated by B4C LLC / AwesomeWebStore.com. Built by [Brand Anthony McDonald](https://brandanthonymcdonald.com).

## Ecosystem Positioning

Sits alongside [CentenarianOS](https://centenarianos.com) (the longevity OS that will eventually host the enrolled course) and [brandanthonymcdonald.com](https://brandanthonymcdonald.com) (BAM's practitioner-scholar portfolio). Because the class touches a regulated adult-education topic, **every lead form on this site is behind a 21+ age-verification gate** — see [plans/user-tasks/15](plans/user-tasks/) once the ecosystem guardrails are adopted here.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth v4 (credentials, admin only) |
| Bot check | Google reCAPTCHA v3 |
| Logging | pino |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and fill in every variable listed there before the first run.

## Project Structure

```
ecs-specialization-course-landing-page/
├── app/
│   ├── layout.tsx              # Root layout + fonts + Vercel Analytics
│   ├── page.tsx                # Public landing page (Hero → LeadForm)
│   ├── providers.tsx           # NextAuth SessionProvider
│   ├── globals.css
│   ├── admin/{login,dashboard,logs}/page.tsx  # Admin surface
│   ├── api/
│   │   ├── leads/route.ts      # Public POST — creates Lead after reCAPTCHA
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   └── admin/{leads,logs}/ # Admin-only read endpoints
│   └── ebook/                  # Static ebook preview asset
├── components/
│   ├── Hero, Stats, ProblemStatement, CourseFeatures,
│   ├── CourseCurriculum, SpecializationTracks,
│   ├── ScientificEvidence, LeadForm, Footer
│   └── admin/{LeadsTable,LogsTable}
├── lib/
│   ├── authOptions.ts          # NextAuth config
│   ├── db/{dbConnect,mongodb}.ts
│   ├── data/{leads,logs}.ts    # Admin-surface queries
│   └── utils/utils.ts
├── models/{Lead,User,AuthLog}.ts
├── logging/                    # pino loggers (client/edge/admin/auth)
└── scripts/create-admin.js     # Seeds an admin User (gitignored)
```

## Deployment

Deployed on Vercel. Pushes to `main` trigger automatic production deploys.

```bash
# Manual deploy
npx vercel --prod
```

## License

Proprietary B4C LLC / AwesomeWebStore.com
