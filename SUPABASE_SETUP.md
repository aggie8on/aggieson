# Portfolio CMS setup

The `aggieson-portfolio` Supabase project powers the public Life and Writing sections and the private Studio editor.

## Environment variables

The application includes public defaults for this project. For easier future project switching, these can be set in Vercel for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL`: the project API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the project's publishable key.

These values are intended for browser use. Never put a Supabase service-role or secret key in client code or a `NEXT_PUBLIC_*` variable.

## Database and security

The migrations in `supabase/migrations` create `portfolio_items`, `site_pages`, Row Level Security policies, and the public `portfolio-media` bucket. The content schema, page builder, media upload limits, and optimized page-layout RLS checks have been applied to the `aggieson-portfolio` project.

- Anonymous visitors can read published portfolio items and public page layouts.
- Writes, edits, deletes, and media uploads are restricted by RLS to the configured owner email, `aggie8on@gmail.com`.
- The public media bucket is for assets intentionally published on the site. Anyone with an asset URL can view those files.
- The `portfolio-media` bucket accepts image, audio, and video MIME types up to 50 MB. The editor limits cover images to 10 MB and audio/video/GIF media to 50 MB.

## First owner sign-in

1. Open the [Supabase Auth users page](https://supabase.com/dashboard/project/akgzftoebezfnmvnlokq/auth/users) for `aggieson-portfolio`.
2. Create or invite the owner user for `aggie8on@gmail.com` from the Supabase dashboard, and verify the email address.
3. Set a strong password for that owner account.
4. Sign in at `/studio/login`.

Public self-registration is intentionally disabled. Do not re-enable it for the fixed owner email: if visitors could register that address while email confirmation was disabled, they could claim the identity checked by the Studio's RLS policies.

## Content model

The Studio editor supports writing, recipes, music, desk setup, wishlist, bookmarks, hidden gems, life log, notes, and custom categories.

- Published entries with type `writing` appear in the `/blog` archive and on the homepage's recent-writing list.
- Other published entries appear on `/life`.
- Draft entries remain private to the configured owner.
- Editing a published entry preserves its original publish date.
- Entries can include an external URL, cover image, and optional audio, video, or GIF media.
- The visual page builder at `/studio/pages` edits section order, visibility, text, images, and layout for the homepage, Projects page, Writing archive, and Life page. Layouts are stored in `public.site_pages`; only the configured owner can change them.

## Remaining security setting

Supabase's security advisor currently reports that **Leaked Password Protection is disabled**. Enable it in the project's Auth/Password settings before launch so compromised passwords can be blocked.

## Verification checklist

- Check the Vercel production build after changes.
- Test `/life`, `/blog`, and individual entries while signed out.
- Sign in to `/studio/login`, then test create/edit/publish/delete.
- Verify an unrelated account cannot write to `portfolio_items` or upload to `portfolio-media`.
