-- Run AFTER migration and owner assignment. No lasting writes.
-- The executing connection must be the database administrator.
begin;

do $$
declare owner_id uuid;
begin
  if (select count(*) from site_private.site_admins) <> 1 then
    raise exception 'Expected exactly one owner';
  end if;
  select user_id into owner_id from site_private.site_admins;
  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', owner_id, 'role', 'authenticated')::text, true);
end $$;
set local role authenticated;
do $$
declare result jsonb;
begin
  if not public.is_site_admin() then raise exception 'Owner rejected'; end if;
  result := public.list_site_users('', 1);
  if jsonb_array_length(result->'users') > 25 then raise exception 'Page cap failed'; end if;
  if (result->>'total')::bigint < 1 then raise exception 'Directory unexpectedly empty'; end if;
  if exists (select 1 from jsonb_array_elements(result->'users') u,
    lateral jsonb_object_keys(u) k where k not in ('id','email','created_at','last_sign_in_at','providers')) then
    raise exception 'Unexpected user fields';
  end if;
  begin
    perform public.list_site_users('', 0);
    raise exception 'Invalid page accepted';
  exception when sqlstate '22023' then null; end;
  begin
    perform public.list_site_users(repeat('x', 201), 1);
    raise exception 'Oversized search accepted';
  exception when sqlstate '22023' then null; end;
  if (public.list_site_users('no-such-account-qa@example.invalid', 1)->>'matched')::bigint <> 0 then
    raise exception 'Search failed';
  end if;
end $$;
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","user_metadata":{"admin":true,"role":"admin"}}', true);
set local role authenticated;
do $$
begin
  if public.is_site_admin() then raise exception 'Metadata privilege escalation'; end if;
  begin
    perform public.list_site_users('', 1);
    raise exception 'Non-admin could list users';
  exception when insufficient_privilege then null; end;
  begin
    perform user_id from site_private.site_admins;
    raise exception 'Non-admin could read membership';
  exception when insufficient_privilege then null; end;
  begin
    insert into site_private.site_admins(user_id) values(auth.uid());
    raise exception 'Non-admin could promote themselves';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role anon;
do $$
begin
  begin
    perform public.list_site_users('', 1);
    raise exception 'Anon could list users';
  exception when insufficient_privilege then null; end;
  begin
    perform public.is_site_admin();
    raise exception 'Anon could call role check';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
