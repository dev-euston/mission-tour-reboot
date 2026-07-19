# Mission: Tour — App

Next.js 16 application for Mission: Tour. See the [root README](../README.md) for project context, terminology, and design principles.

## Dev Commands

```bash
pnpm dev          # start dev server at http://localhost:3000
pnpm build        # production build
pnpm lint         # lint
pnpm test         # run tests (Vitest)
pnpm db:migrate   # run Prisma migrations
pnpm db:seed      # seed demo content
```

## Structure

```
app/
├── app/          # App Router — routes, layouts, server components, server actions
├── lib/          # Business logic by domain (lib/mission/, lib/task/, etc.)
├── prisma/       # Schema and migrations
└── public/       # Static assets and PWA manifest
```

## Notes

- Next.js 16 has breaking changes from 15 — read `node_modules/next/dist/docs/` before assuming conventions from prior versions.
- Run all commands from this directory (`app/`), not the repo root.
