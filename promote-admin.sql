-- Run in Supabase Dashboard > SQL Editor.
-- This promotes the existing Authentication user to an application admin.

insert into public.profiles (id, role)
select id, 'admin'::public.user_role
from auth.users
where lower(email) = lower('admin@example.com')
on conflict (id) do update
set role = 'admin'::public.user_role,
    updated_at = now();

-- Expected result: one row with role = admin.
select
  auth.users.email,
  public.profiles.role
from auth.users
join public.profiles on public.profiles.id = auth.users.id
where lower(auth.users.email) = lower('admin@example.com');
