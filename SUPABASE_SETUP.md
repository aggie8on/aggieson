# Portfolio CMS setup

The aggieson-portfolio Supabase project powers /life and /studio.

## Environment variables
The application includes safe public defaults for this project, so the site can connect even before environment variables are configured. For easier future project switching, you can optionally set these in Vercel for Production, Preview, and Development:
- NEXT_PUBLIC_SUPABASE_URL: the project API URL shown in Supabase project settings.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: the project's publishable key.

These are public client configuration values. Never add a Supabase service-role or secret key to client code.

## Database and security
The migrations in supabase/migrations create portfolio_items, site_pages, row-level security policies, and the public portfolio-media image bucket. The portfolio content and page-builder schema have been applied to the aggieson-portfolio Supabase project. Anonymous visitors can read published portfolio items and page layouts. Writes and media uploads are restricted by RLS to the owner email aggie8on@gmail.com.

## First owner sign-in
1. Open /studio/login.
2. Choose First time here? Create the owner account.
3. Choose a strong password (8+ characters).
4. If Supabase email confirmation is enabled, confirm the link from your inbox and return to sign in.
5. If confirmation is disabled, sign in immediately.

The signup form only allows the configured owner email, and database RLS independently checks the same email before allowing edits.

## Content model
The Studio content editor supports writing, recipes, music, desk setup, wishlist, bookmarks, hidden gems, life log, notes, and custom types/categories. Save drafts, publish, attach an external URL, upload a cover image, or mark a wishlist item as owned. Published items appear on /life. The visual page builder at /studio/pages edits section order, visibility, text, images, and layout for the homepage, Projects page, Writing archive, and Life page. Layouts are stored in public.site_pages; only the configured owner can change them.

## Verification checklist
- Check the Vercel deployment/build after merging.
- Test /life while signed out.
- Create the owner account at /studio/login, then test create/edit/publish/delete.
- Verify an unrelated account cannot write to portfolio_items or upload to portfolio-media.
