create table if not exists public.site_pages (
  slug text primary key,
  title text not null,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_pages enable row level security;

drop policy if exists "Published page layouts are readable" on public.site_pages;
create policy "Published page layouts are readable"
on public.site_pages for select to anon, authenticated
using (true);

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

grant select on public.site_pages to anon, authenticated;
grant insert, update, delete on public.site_pages to authenticated;

insert into public.site_pages (slug, title, sections)
values
('home', 'Homepage', '[
 {"id":"intro","type":"intro","title":"Aggieson","eyebrow":"","text":"Human designer. Currently at Toothless working on identities and systems — crafting interfaces and building design tooling.","body":"I enjoy making useful things and care a lot about making them feel simple and considered.","image":"","visible":true,"layout":"stack"},
 {"id":"projects","type":"projects","title":"Selected projects","eyebrow":"","text":"","body":"","image":"","visible":true,"layout":"stack"},
 {"id":"writing","type":"writing","title":"Recent writing","eyebrow":"","text":"","body":"","image":"","visible":true,"layout":"stack"},
 {"id":"life","type":"life","title":"Life, lately","eyebrow":"","text":"","body":"","image":"","visible":true,"layout":"stack"}
]'::jsonb),
('life', 'Life, lately.', '[
 {"id":"life-intro","type":"intro","title":"Life, lately.","eyebrow":"Outside the portfolio","text":"A growing collection of things I enjoy, keep close, cook, listen to, use, and want to remember.","body":"","image":"","visible":true,"layout":"stack"},
 {"id":"life-list","type":"life","title":"Everything","eyebrow":"","text":"","body":"","image":"","visible":true,"layout":"stack"}
]'::jsonb),
('projects', 'Projects', '[
 {"id":"projects-intro","type":"intro","title":"Projects","eyebrow":"Selected work","text":"A collection of things I have helped make, explored, and learned from.","body":"","image":"","visible":true,"layout":"stack"},
 {"id":"projects-list","type":"projects","title":"Projects","eyebrow":"","text":"","body":"","image":"","visible":true,"layout":"stack"}
]'::jsonb)
on conflict (slug) do nothing;
