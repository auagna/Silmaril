-- ============================================================================
-- Silmaril — Supabase schema
-- ----------------------------------------------------------------------------
-- Run order:
--   1. this file (schema.sql)
--   2. policies.sql
--
-- Notes:
--   * uses pgcrypto for gen_random_uuid()
--   * Assumes Supabase auth.users exists (Supabase provides it).
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ----------------------------------------------------------------------------
-- 1. Enums
-- ----------------------------------------------------------------------------

do $$ begin
  create type thread_type as enum (
    'person','work','movement','place','event',
    'organization','company','media','book','film','music'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type thread_status as enum (
    'local','community','verified','official','merged','archived'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type visibility as enum ('private','followers','public');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('member','partner','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type relation_kind as enum (
    'influenced_by','created','member_of','located_in',
    'contemporary_of','related_to','derived_from','belongs_to'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type perspective_stance as enum (
    'intro','critique','context','legacy','personal','comparison'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type source_kind as enum ('article','book','video','audio','image','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type target_kind as enum ('thread','perspective','record');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reaction_kind as enum ('like');
exception when duplicate_object then null; end $$;

do $$ begin
  create type activity_kind as enum (
    'view','like','bookmark','record','connect','collect','perspective'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. users
-- ----------------------------------------------------------------------------

create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  role         user_role not null default 'member',
  created_at   timestamptz not null default now()
);

-- Auto-create a public.users row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, handle, display_name)
  values (
    new.id,
    'u_' || substring(replace(new.id::text, '-', '') from 1 for 8),
    coalesce(new.raw_user_meta_data->>'name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3. utility — touch updated_at
-- ----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. threads
-- ----------------------------------------------------------------------------

create table if not exists public.threads (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  aliases      text[] not null default '{}',
  type         thread_type not null,
  summary      text,
  body         text,
  cover_url    text,
  status       thread_status not null default 'local',
  merged_into  uuid references public.threads(id) on delete set null,
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint threads_merged_target_required
    check ((status = 'merged') = (merged_into is not null)),
  constraint threads_no_self_merge
    check (merged_into is null or merged_into <> id)
);

create index if not exists threads_status_type_idx
  on public.threads (status, type);

create index if not exists threads_created_at_idx
  on public.threads (created_at desc);

create index if not exists threads_aliases_gin
  on public.threads using gin (aliases);

create index if not exists threads_title_trgm
  on public.threads using gin (title gin_trgm_ops);

drop trigger if exists threads_touch on public.threads;
create trigger threads_touch
  before update on public.threads
  for each row execute procedure public.touch_updated_at();

-- Prevent merge chains: if X is merged into Y and Y is merged into Z, flatten to Z.
create or replace function public.enforce_merge_chain()
returns trigger language plpgsql as $$
declare
  target_status thread_status;
  target_redirect uuid;
begin
  if new.merged_into is null then
    return new;
  end if;

  select status, merged_into into target_status, target_redirect
  from public.threads where id = new.merged_into;

  -- flatten: if target is itself merged, redirect to its final.
  while target_status = 'merged' and target_redirect is not null loop
    new.merged_into := target_redirect;
    select status, merged_into into target_status, target_redirect
    from public.threads where id = new.merged_into;
  end loop;

  return new;
end;
$$;

drop trigger if exists threads_enforce_merge on public.threads;
create trigger threads_enforce_merge
  before insert or update of merged_into, status on public.threads
  for each row execute procedure public.enforce_merge_chain();

-- Slug uniqueness helper.
create or replace function public.slug_unique_or_suffix(input text)
returns text language plpgsql as $$
declare
  base text := input;
  candidate text := input;
  i int := 2;
begin
  while exists (select 1 from public.threads where slug = candidate) loop
    candidate := base || '-' || i;
    i := i + 1;
  end loop;
  return candidate;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5. connections (thread × thread)
-- ----------------------------------------------------------------------------

create table if not exists public.connections (
  id           uuid primary key default gen_random_uuid(),
  from_thread  uuid not null references public.threads(id) on delete cascade,
  to_thread    uuid not null references public.threads(id) on delete cascade,
  relation     relation_kind not null,
  note         text,
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),

  constraint connections_no_self check (from_thread <> to_thread),
  constraint connections_unique  unique (from_thread, to_thread, relation)
);

create index if not exists connections_from_idx on public.connections (from_thread);
create index if not exists connections_to_idx   on public.connections (to_thread);
create index if not exists connections_rel_idx  on public.connections (relation);

-- ----------------------------------------------------------------------------
-- 6. perspectives
-- ----------------------------------------------------------------------------

create table if not exists public.perspectives (
  id           uuid primary key default gen_random_uuid(),
  thread_id    uuid not null references public.threads(id) on delete cascade,
  title        text not null,
  body         text not null,
  stance       perspective_stance not null default 'intro',
  visibility   visibility not null default 'public',
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists perspectives_thread_idx
  on public.perspectives (thread_id, created_at desc);

drop trigger if exists perspectives_touch on public.perspectives;
create trigger perspectives_touch
  before update on public.perspectives
  for each row execute procedure public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 7. records
-- ----------------------------------------------------------------------------

create table if not exists public.records (
  id           uuid primary key default gen_random_uuid(),
  thread_id    uuid references public.threads(id) on delete set null, -- nullable
  body         text not null,
  media_url    text,
  visibility   visibility not null default 'private',
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists records_author_idx
  on public.records (created_by, created_at desc);

create index if not exists records_thread_idx
  on public.records (thread_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 8. collections
-- ----------------------------------------------------------------------------

create table if not exists public.collections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  title        text not null,
  description  text,
  cover_url    text,
  visibility   visibility not null default 'public',
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint collections_slug_per_user unique (created_by, slug)
);

drop trigger if exists collections_touch on public.collections;
create trigger collections_touch
  before update on public.collections
  for each row execute procedure public.touch_updated_at();

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  thread_id     uuid not null references public.threads(id)     on delete cascade,
  position      integer not null default 0,
  note          text,
  added_at      timestamptz not null default now(),

  primary key (collection_id, thread_id)
);

create index if not exists collection_items_position_idx
  on public.collection_items (collection_id, position);

-- ----------------------------------------------------------------------------
-- 9. bookmarks
-- ----------------------------------------------------------------------------

create table if not exists public.bookmarks (
  user_id    uuid not null references public.users(id)   on delete cascade,
  thread_id  uuid not null references public.threads(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, thread_id)
);

create index if not exists bookmarks_user_idx   on public.bookmarks (user_id);
create index if not exists bookmarks_thread_idx on public.bookmarks (thread_id);

-- ----------------------------------------------------------------------------
-- 10. reactions (polymorphic, light)
-- ----------------------------------------------------------------------------

create table if not exists public.reactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  target_kind  target_kind not null,
  target_id    uuid not null,
  kind         reaction_kind not null default 'like',
  created_at   timestamptz not null default now(),

  constraint reactions_unique unique (user_id, target_kind, target_id, kind)
);

create index if not exists reactions_target_idx
  on public.reactions (target_kind, target_id);

-- ----------------------------------------------------------------------------
-- 11. sources
-- ----------------------------------------------------------------------------

create table if not exists public.sources (
  id               uuid primary key default gen_random_uuid(),
  url              text not null,
  title            text,
  description      text,
  kind             source_kind not null default 'article',
  attached_to_kind target_kind not null,
  attached_to_id   uuid not null,
  created_by       uuid not null references public.users(id) on delete cascade,
  created_at       timestamptz not null default now()
);

create index if not exists sources_attached_idx
  on public.sources (attached_to_kind, attached_to_id);

-- ----------------------------------------------------------------------------
-- 12. user_thread_activity (denormalized signal log)
-- ----------------------------------------------------------------------------

create table if not exists public.user_thread_activity (
  user_id   uuid not null references public.users(id)   on delete cascade,
  thread_id uuid not null references public.threads(id) on delete cascade,
  kind      activity_kind not null,
  weight    numeric not null default 1.0,
  last_at   timestamptz not null default now(),

  primary key (user_id, thread_id, kind)
);

create index if not exists user_thread_activity_user_idx
  on public.user_thread_activity (user_id, kind, last_at desc);

-- ----------------------------------------------------------------------------
-- 13. convenience views (read-only aggregates for ranking)
-- ----------------------------------------------------------------------------

create or replace view public.thread_signal as
select
  t.id as thread_id,
  (select count(*) from public.bookmarks b where b.thread_id = t.id)               as bookmarks_count,
  (select count(*) from public.connections c where c.from_thread = t.id or c.to_thread = t.id) as connections_count,
  (select count(*) from public.collection_items ci where ci.thread_id = t.id)      as collection_inclusions,
  (select count(*) from public.records r where r.thread_id = t.id)                 as records_count,
  (select count(*) from public.perspectives p where p.thread_id = t.id)            as perspectives_count,
  (select count(*) from public.reactions x
     where x.target_kind = 'thread' and x.target_id = t.id and x.kind = 'like')    as likes_count
from public.threads t;
