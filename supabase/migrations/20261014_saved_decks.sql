-- Integrazione del salvataggio. Non usa chiavi service_role.
alter table public.decks add column if not exists snapshot jsonb;
alter table public.decks add column if not exists settings jsonb;

create or replace function public.save_deck(p jsonb)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  saved_id uuid;
  card jsonb;
  cents integer;
begin
  if owner_id is null then raise exception 'AUTH_REQUIRED'; end if;
  if pg_catalog.octet_length(p::text) > 300000
    or p->>'origin' not in ('build','upgrade')
    or pg_catalog.length(pg_catalog.btrim(p->>'title')) not between 1 and 120
    or pg_catalog.length(pg_catalog.btrim(p->>'commander')) not between 1 and 200
    or pg_catalog.jsonb_typeof(p->'cards') is distinct from 'array'
    or pg_catalog.jsonb_typeof(p->'result') is distinct from 'object'
    or pg_catalog.jsonb_typeof(p->'input') is distinct from 'object'
  then raise exception 'INVALID_PAYLOAD'; end if;
  if p->>'origin' is null or p->>'title' is null or p->>'commander' is null then
    raise exception 'INVALID_PAYLOAD';
  end if;
  if pg_catalog.jsonb_array_length(p->'cards') not between 1 and 250 then
    raise exception 'INVALID_CARDS';
  end if;
  if (select count(*) from public.decks where user_id = owner_id) >= 500 then
    raise exception 'DECK_LIMIT';
  end if;
  cents := (p->>'budget_cents')::integer;
  if cents < 0 then raise exception 'INVALID_BUDGET'; end if;
  insert into public.profiles(user_id) values(owner_id) on conflict(user_id) do nothing;
  insert into public.decks(user_id,title,commander,origin,budget_cents,snapshot,settings)
    values(owner_id,p->>'title',p->>'commander',p->>'origin',cents,p->'result',p->'input')
    returning id into saved_id;
  for card in select value from pg_catalog.jsonb_array_elements(p->'cards')
  loop
    if pg_catalog.length(card->>'name') not between 1 and 200
      or card->>'name' is null or card->>'oracle_id' is null
      or (card->>'oracle_id') !~ '^[0-9a-fA-F-]{36}$'
      or (card->>'quantity') is null
      or (card->>'quantity')::integer not between 1 and 100
      or ((card->>'price_cents')::integer < 0)
    then raise exception 'INVALID_CARD'; end if;
    insert into public.deck_cards(deck_id,oracle_id,name,quantity,is_commander,price_cents)
      values(saved_id,card->>'oracle_id',card->>'name',(card->>'quantity')::integer,
        coalesce((card->>'is_commander')::boolean,false),(card->>'price_cents')::integer);
  end loop;
  if p->>'origin' = 'upgrade' then
    insert into public.upgrade_runs(user_id,deck_id,commander,input_deck,result_json)
      values(owner_id,saved_id,p->>'commander',p->'input',p->'result');
  end if;
  return saved_id;
end;
$$;

revoke all on function public.save_deck(jsonb) from public, anon;
grant execute on function public.save_deck(jsonb) to authenticated;

-- Esplicita verifica sia delle righe precedenti sia di quelle nuove.
alter policy profiles_update_own on public.profiles
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy decks_update_own on public.decks
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy deck_cards_update_own on public.deck_cards
  using (exists(select 1 from public.decks d where d.id = deck_id and d.user_id = (select auth.uid())))
  with check (exists(select 1 from public.decks d where d.id = deck_id and d.user_id = (select auth.uid())));
