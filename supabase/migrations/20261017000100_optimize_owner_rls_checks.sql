-- Optimize owner checks and collapse overlapping SELECT policies.
drop policy if exists "Public can read published portfolio items" on public.portfolio_items;
drop policy if exists "Portfolio owner can read all items" on public.portfolio_items;
create policy "Public can read published items or owner can read all"
on public.portfolio_items for select to anon, authenticated
using (published = true or ((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can insert items" on public.portfolio_items;
create policy "Portfolio owner can insert items" on public.portfolio_items for insert to authenticated
with check (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can update items" on public.portfolio_items;
create policy "Portfolio owner can update items" on public.portfolio_items for update to authenticated
using (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com')
with check (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can delete items" on public.portfolio_items;
create policy "Portfolio owner can delete items" on public.portfolio_items for delete to authenticated
using (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can upload media" on storage.objects;
create policy "Portfolio owner can upload media" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-media' and (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com'));
drop policy if exists "Portfolio owner can update media" on storage.objects;
create policy "Portfolio owner can update media" on storage.objects for update to authenticated
using (bucket_id = 'portfolio-media' and (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com'))
with check (bucket_id = 'portfolio-media' and (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com'));
drop policy if exists "Portfolio owner can delete media" on storage.objects;
create policy "Portfolio owner can delete media" on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-media' and (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com'));
