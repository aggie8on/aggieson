# Aggieson

Personal portfolio and life notebook for Aggieson. Built with Next.js App Router, React, Tailwind CSS, and Supabase.

## Local development

```bash
pnpm install
pnpm dev
```

## Validation and production build

```bash
pnpm run typecheck
pnpm run build
```

The typecheck script and production build both validate TypeScript. TypeScript build errors are not ignored. ESLint is not configured in this repository yet.

## Environment

The Supabase client uses the public project URL and publishable key. To override the defaults locally, create `.env.local` using `.env.example`. Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Site areas

- `/` — homepage, selected work, writing, and life notes
- `/projects` — project archive with in-place project details
- `/blog` — writing archive and individual articles
- `/life` — public life notebook
- `/studio/login` — private content editor sign-in
- `/studio/pages` — private page layout editor

The public site reads published content from Supabase. Studio writes are protected by Supabase Row Level Security policies. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the content model and storage configuration.
