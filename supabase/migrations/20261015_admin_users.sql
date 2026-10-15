-- Read-only site administration. No service_role key or public email allowlist.
-- Membership is assigned separately, to a verified auth.users UUID.
create schema if not exists site_private;
revoke all on schema site_private from public, anon, authenticated;

create table site_private.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table site_private.site_admins enable row level security;
revoke all on site_private.site_admins from public, anon, authenticated;

create function public.is_site_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from site_private.site_admins a where a.user_id = auth.uid()
  );
$$;
revoke all on function public.is_site_admin() from public, anon, authenticated;
grant execute on function public.is_site_admin() to authenticated;

create function public.list_site_users(p_search text default '', p_page integer default 1)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  term text := pg_catalog.btrim(coalesce(p_search, ''));
  current_page integer := coalesce(p_page, 1);
  total bigint;
  matched bigint;
  recent bigint;
  rows jsonb;
begin
  -- Never trust email, user_metadata, URL parameters or a caller-supplied ID.
  if not public.is_site_admin() then
    raise exception 'ADMIN_REQUIRED' using errcode = '42501';
  end if;
  if pg_catalog.length(term) > 200 or current_page not between 1 and 100000 then
    raise exception 'INVALID_FILTER' using errcode = '22023';
  end if;

  select count(*), count(*) filter (where u.created_at >= now() - interval '7 days')
    into total, recent from auth.users u;
  select count(*) into matched from auth.users u
    where pg_catalog.strpos(pg_catalog.lower(coalesce(u.email, '')), pg_catalog.lower(term)) > 0;

  select coalesce(pg_catalog.jsonb_agg(pg_catalog.to_jsonb(r) order by r.created_at desc, r.id), '[]'::jsonb)
    into rows from (
      select u.id, u.email, u.created_at, u.last_sign_in_at,
        array(select distinct i.provider from auth.identities i
          where i.user_id = u.id order by i.provider) as providers
      from auth.users u
      where pg_catalog.strpos(pg_catalog.lower(coalesce(u.email, '')), pg_catalog.lower(term)) > 0
      order by u.created_at desc, u.id
      limit 25 offset ((current_page - 1) * 25)
    ) r;

  return pg_catalog.jsonb_build_object(
    'users', rows, 'total', total, 'matched', matched,
    'recent', recent, 'page', current_page, 'pageSize', 25
  );
end;
$$;
revoke all on function public.list_site_users(text, integer) from public, anon, authenticated;
grant execute on function public.list_site_users(text, integer) to authenticated;

comment on function public.list_site_users(text, integer) is
  'Read-only minimal auth directory. Requires immutable UUID membership in site_private.site_admins.';
