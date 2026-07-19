# Mission: Tour — App

Next.js 16 application for Mission: Tour. See the [root README](../README.md) for project context, terminology, and design principles.

## Dev Commands

Run from the repo root or from this directory — both work.

```bash
pnpm dev              # start dev server at http://localhost:3051
pnpm build            # production build
pnpm lint             # lint
pnpm test             # run tests against test DB (:5543)
pnpm test:coverage    # with coverage
pnpm db:migrate       # run Prisma migrations (main DB :5542)
pnpm db:migrate:test  # run migrations on test DB (:5543)
pnpm db:seed          # seed demo content
pnpm db:studio        # open Prisma Studio
```

## Structure

```
app/
├── app/              # App Router — routes, layouts, server components, server actions
├── lib/              # Business logic by domain (lib/mission/, lib/task/, etc.)
├── prisma/           # Schema and migrations
├── public/           # Static assets and PWA manifest
└── prisma.config.ts  # Prisma CLI config (connection URL for migrate/studio)
```

## Notes

- Next.js 16 has breaking changes from 15 — read `node_modules/next/dist/docs/` before assuming conventions from prior versions.
- Prisma v7: no `url` in `datasource` block; connection goes in `prisma.config.ts` and a driver adapter (`@prisma/adapter-pg`) in `lib/db.ts`.
