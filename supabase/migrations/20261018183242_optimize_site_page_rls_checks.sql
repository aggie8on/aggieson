-- Evaluate the JWT once per statement instead of once per row.
drop policy if exists "Portfolio owner can insert page layouts" on public.site_pages;
create policy "Portfolio owner can insert page layouts"
on public.site_pages for insert to authenticated
with check (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');

drop policy if exists "Portfolio owner can update page layouts" on public.site_pages;
create policy "Portfolio owner can update page layouts"
on public.site_pages for update to authenticated
using (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com')
with check (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');

drop policy if exists "Portfolio owner can delete page layouts" on public.site_pages;
create policy "Portfolio owner can delete page layouts"
on public.site_pages for delete to authenticated
using (((select auth.jwt()) ->> 'email') = 'aggie8on@gmail.com');
