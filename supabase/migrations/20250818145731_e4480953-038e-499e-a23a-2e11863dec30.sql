-- Create a SECURITY DEFINER function to check admin role without RLS recursion
create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user_id and role = 'admin'::user_role
  );
$$;

-- Replace the recursive policy with one using the function
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
using (public.is_admin(auth.uid()));

-- Allow admins to update all profiles as well (for role changes)
create policy if not exists "Admins can update all profiles"
on public.profiles
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));