-- Portfolio CMS: flexible items for writing, recipes, music, desk setup, wishlist, bookmarks, gems, and life log.
create extension if not exists pgcrypto;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  item_type text not null default 'note',
  category text not null default 'Writing',
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb,
  cover_image_url text,
  external_url text,
  published boolean not null default false,
  featured boolean not null default false,
  is_owned boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_items_item_type_check check (item_type in ('writing','recipe','music','desk','wishlist','bookmark','gem','life-log','note','custom'))
);

create index if not exists portfolio_items_public_listing_idx on public.portfolio_items (published, sort_order, published_at desc);
create index if not exists portfolio_items_category_idx on public.portfolio_items (category);
create index if not exists portfolio_items_type_idx on public.portfolio_items (item_type);

create or replace function public.set_portfolio_item_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  if new.published = true and old.published = false and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists set_portfolio_item_updated_at on public.portfolio_items;
create trigger set_portfolio_item_updated_at before update on public.portfolio_items
for each row execute function public.set_portfolio_item_updated_at();

alter table public.portfolio_items enable row level security;
drop policy if exists "Public can read published portfolio items" on public.portfolio_items;
create policy "Public can read published portfolio items" on public.portfolio_items
for select to anon, authenticated using (published = true);
drop policy if exists "Portfolio owner can read all items" on public.portfolio_items;
create policy "Portfolio owner can read all items" on public.portfolio_items
for select to authenticated using ((select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can insert items" on public.portfolio_items;
create policy "Portfolio owner can insert items" on public.portfolio_items
for insert to authenticated with check ((select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can update items" on public.portfolio_items;
create policy "Portfolio owner can update items" on public.portfolio_items
for update to authenticated using ((select auth.jwt() ->> 'email') = 'aggie8on@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can delete items" on public.portfolio_items;
create policy "Portfolio owner can delete items" on public.portfolio_items
for delete to authenticated using ((select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');

grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-media');
drop policy if exists "Portfolio owner can upload media" on storage.objects;
create policy "Portfolio owner can upload media" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-media' and (select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can update media" on storage.objects;
create policy "Portfolio owner can update media" on storage.objects for update to authenticated
using (bucket_id = 'portfolio-media' and (select auth.jwt() ->> 'email') = 'aggie8on@gmail.com')
with check (bucket_id = 'portfolio-media' and (select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
drop policy if exists "Portfolio owner can delete media" on storage.objects;
create policy "Portfolio owner can delete media" on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-media' and (select auth.jwt() ->> 'email') = 'aggie8on@gmail.com');
