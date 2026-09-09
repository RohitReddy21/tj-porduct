-- ===========================================================================
-- AFSv5 blog schema
--
-- Run this once in your Supabase project:
--   Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- Then create the image bucket:
--   Dashboard -> Storage -> New bucket
--     Name:   post-images
--     Public: ON        (visitors must be able to load article images)
--
-- Then create your admin login:
--   Dashboard -> Authentication -> Users -> Add user
--     Enter your email + a password, and tick "Auto Confirm User".
--     That is the account you sign in with at /admin.
--
-- THEN RUN 02-lock-down-admin.sql. It is not optional.
--   The policies below grant write access to ANY authenticated user, and
--   Supabase enables public email sign-up by default — so on its own this
--   file lets a stranger sign up and edit your blog. 02-lock-down-admin.sql
--   narrows write access to an explicit email allowlist.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  body          text,
  cover_image   text,
  images        jsonb       not null default '[]'::jsonb,
  tags          text[]      not null default '{}',
  linkedin_url  text,
  reading_time  text,
  published     boolean     not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published, published_at desc);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
--   * anyone (including logged-out visitors) may read PUBLISHED posts
--   * only a signed-in user may create/edit/delete, or read drafts
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
  on public.posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "authenticated reads every post" on public.posts;
create policy "authenticated reads every post"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "authenticated writes posts" on public.posts;
create policy "authenticated writes posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated updates posts" on public.posts;
create policy "authenticated updates posts"
  on public.posts for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated deletes posts" on public.posts;
create policy "authenticated deletes posts"
  on public.posts for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage policies for the `post-images` bucket.
-- Create the bucket in the dashboard FIRST (Storage -> New bucket, Public ON),
-- then run this block.
-- ---------------------------------------------------------------------------
drop policy if exists "public reads post images" on storage.objects;
create policy "public reads post images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'post-images');

drop policy if exists "authenticated uploads post images" on storage.objects;
create policy "authenticated uploads post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "authenticated deletes post images" on storage.objects;
create policy "authenticated deletes post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');
