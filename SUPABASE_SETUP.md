# Portfolio CMS setup

The `aggieson-portfolio` Supabase project powers the public Life and Writing sections and the private Studio editor.

## Environment variables

The application includes public defaults for this project. For easier future project switching, these can be set in Vercel for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL`: the project API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the project's publishable key.

These values are intended for browser use. Never put a Supabase service-role or secret key in client code or a `NEXT_PUBLIC_*` variable.

## Database and security

The migrations in `supabase/migrations` create `portfolio_items`, `site_pages`, Row Level Security policies, and the public `portfolio-media` bucket. The content schema, site text, media upload limits, and optimized page-layout RLS checks have been applied to the `aggieson-portfolio` project.

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

The Studio (`/studio`) has five tabs, each with its own form:

- **Writing** (`item_type = writing`): title, date, summary, post body, optional audio, video or GIF. Shown on `/blog` and the homepage's recent writing.
- **Projects** (`project`): name, year, category, description, cover image, ordered gallery, and a "show on the homepage" switch. Shown on `/projects`, and on the homepage when featured.
- **Bookmarks** (`bookmark`, `recipe`, `gem`, `desk`): shown on `/life` as round linked tiles, with the name revealed on hover. Links use the site's icon unless you upload a tile image. A link to an X post is saved as a preview card instead of a tile. Gadgets (`desk`) can be marked as owned.
- **Life log** (`music`, `photo`, `note`): shown on `/life` below the bookmarks. Music takes a Spotify link and shows Spotify's player. Photos show as a grid with the caption on hover. Notes show a pin icon, and pinned notes sit first.
- **Site text**: the heading, role and intro text for the homepage, Writing, Projects and Life pages, stored in `public.site_pages`.

Older `wishlist`, `life-log` and `custom` entries still display, as Gadgets and Notes.

X posts and Spotify titles are looked up when you paste the link in Studio, through the owner-only route `/api/link-preview`, and the details are stored with the entry. The public site never calls X, so a deleted post keeps its saved card.

Rules:

- The database is the source of truth. The built-in content in `lib/blog-data.ts` and `lib/projects.ts` is only a fallback if Supabase cannot be reached, so deleting something in Studio removes it from the site.
- Draft entries remain private to the configured owner.
- Writing and projects never appear on `/life`.
- Existing content was imported into the database once. Studio does not re-import on load.

## Remaining security setting

Supabase's security advisor currently reports that **Leaked Password Protection is disabled**. Enable it in the project's Auth/Password settings before launch so compromised passwords can be blocked.

## Verification checklist

- Check the Vercel production build after changes.
- Test `/life`, `/blog`, and individual entries while signed out.
- Sign in to `/studio/login`, then test create/edit/publish/delete.
- Verify an unrelated account cannot write to `portfolio_items` or upload to `portfolio-media`.
