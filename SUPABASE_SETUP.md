# Portfolio CMS setup

The aggieson-portfolio Supabase project powers /life and /studio.

## Environment variables
The application includes safe public defaults for this project, so the site can connect even before environment variables are configured. For easier future project switching, you can optionally set these in Vercel for Production, Preview, and Development:
- NEXT_PUBLIC_SUPABASE_URL: the project API URL shown in Supabase project settings.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: the project's publishable key.

These are public client configuration values. Never add a Supabase service-role or secret key to client code.

## Database and security
The migration in supabase/migrations creates portfolio_items, row-level security policies, and the public portfolio-media image bucket. It has already been applied to Supabase. Anonymous visitors can read published content only. Writes and media uploads are restricted by RLS to the owner email aggie8on@gmail.com.

## First owner sign-in
1. Open /studio/login.
2. Choose First time here? Create the owner account.
3. Choose a strong password (8+ characters).
4. If Supabase email confirmation is enabled, confirm the link from your inbox and return to sign in.
5. If confirmation is disabled, sign in immediately.

The signup form only allows the configured owner email, and database RLS independently checks the same email before allowing edits.

## Content model
The editor supports writing, recipes, music, desk setup, wishlist, bookmarks, hidden gems, life log, notes, and custom types/categories. Save drafts, publish, attach an external URL, upload a cover image, or mark a wishlist item as owned. Published items appear on /life.

## Verification checklist
- Check the Vercel deployment/build after merging.
- Test /life while signed out.
- Create the owner account at /studio/login, then test create/edit/publish/delete.
- Verify an unrelated account cannot write to portfolio_items or upload to portfolio-media.
