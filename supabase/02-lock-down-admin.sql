-- ===========================================================================
-- LOCK DOWN ADMIN ACCESS  —  run this after schema.sql
--
-- WHY THIS EXISTS
--   schema.sql grants write access to any `authenticated` user. That is only
--   safe if nobody else can obtain an account. Supabase projects ship with
--   public email sign-up ENABLED, so without this file a stranger could sign
--   up through the API and then create, edit or delete your articles.
--
--   This replaces "any logged-in user" with "an email on an explicit
--   allowlist", so write access is impossible to obtain by signing up.
--
-- HOW TO USE
--   1. Change the email on the INSERT below to the address you will log in
--      with, then run this whole file in the SQL Editor.
--   2. ALSO turn public sign-ups off — belt and braces:
--        Authentication -> Sign In / Providers -> Email
--        -> turn OFF "Allow new users to sign up"  -> Save
--
--   To add another author later:
--      insert into public.admin_emails (email) values ('someone@example.com');
--   To revoke someone:
--      delete from public.admin_emails where email = 'someone@example.com';
-- ===========================================================================

create table if not exists public.admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

-- Nobody reads this table from the browser; only the policies below use it.
drop policy if exists "admins read the allowlist" on public.admin_emails;
create policy "admins read the allowlist"
  on public.admin_emails for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- ---------------------------------------------------------------------------
-- >>> CHANGE THIS EMAIL to the one you will sign in to /admin with <<<
-- ---------------------------------------------------------------------------
insert into public.admin_emails (email)
values ('rohitreddy956@gmail.com')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- One helper both the table and storage policies use.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- Replace the permissive policies from schema.sql.
-- Public read of PUBLISHED posts is unchanged — visitors still see the blog.
-- ---------------------------------------------------------------------------
drop policy if exists "authenticated reads every post" on public.posts;
create policy "admins read every post"
  on public.posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated writes posts" on public.posts;
create policy "admins write posts"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated updates posts" on public.posts;
create policy "admins update posts"
  on public.posts for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "authenticated deletes posts" on public.posts;
create policy "admins delete posts"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Same for image uploads. Public read stays so article images load.
-- ---------------------------------------------------------------------------
drop policy if exists "authenticated uploads post images" on storage.objects;
create policy "admins upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "authenticated deletes post images" on storage.objects;
create policy "admins delete post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());
