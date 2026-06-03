-- ============================================================================
-- Silmaril MVP — Supabase schema  (Expo iPhone-first)
-- ----------------------------------------------------------------------------
-- 정본 방향: docs/silmaril-v2-direction.md · ERD: docs/erd.md
-- 범위: MVP. RLS 정책 / AI Wiki / perspectives / taste_profiles / reports /
--       curator_badges / NOU HAUS 는 제외(추후).
-- 저장-first UX. 기록은 선택. concept 타입 포함. 미발견 실마리 계산 지원
--   (user_thread_activity + thread_connections + bookmarks 로 파생).
--
-- 적용:
--   Supabase SQL Editor 에서 실행.
--   ⚠️ 기존(웹 MVP) 스키마가 적용된 DB라면 컬럼이 다르므로, 아래 "RESET(옵션)"
--      블록을 먼저 실행해 깨끗이 한 뒤 적용하세요. (현재 실데이터 없음 → reset 권장)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- RESET (옵션) — 기존 스키마가 있을 때만 주석 해제 후 1회 실행
-- ---------------------------------------------------------------------------
-- drop table if exists collection_items, collections, bookmarks, records,
--   sources, user_thread_activity, thread_connections, threads, users cascade;
-- drop type if exists visibility_type, thread_status, thread_type, user_role cascade;

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('user', 'partner', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type thread_type as enum ('person', 'work', 'movement', 'place', 'concept', 'organization');
exception when duplicate_object then null; end $$;

do $$ begin
  create type thread_status as enum ('local', 'community', 'verified', 'official', 'merged', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type visibility_type as enum ('private', 'public', 'followers');
exception when duplicate_object then null; end $$;

-- i18n (Step 28). locale 은 우선 ko/en만. 추후 alter type 로 확장.
do $$ begin
  create type locale_type as enum ('ko', 'en');
exception when duplicate_object then null; end $$;

do $$ begin
  create type viewpoint_author as enum ('user', 'curator', 'system');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- utility: updated_at 자동 갱신
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. users  (auth.users 와 1:1)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        text unique not null,
  display_name  text,
  avatar_url    text,
  bio              text,
  role             user_role not null default 'user',
  preferred_locale locale_type not null default 'ko',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 기존 DB 대비 idempotent 추가.
alter table public.users add column if not exists preferred_locale locale_type not null default 'ko';

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- 가입 시 public.users 자동 생성. username -> handle, name -> display_name.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, handle, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'username', ''),
      'u_' || substring(replace(new.id::text, '-', '') from 1 for 8)
    ),
    nullif(new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. threads
-- ---------------------------------------------------------------------------
create table if not exists public.threads (
  id                      uuid primary key default gen_random_uuid(),
  title                   text not null,
  slug                    text not null unique,
  type                    thread_type not null,
  summary                 text,
  description             text,
  cover_image_url         text,
  status                  thread_status not null default 'local',
  created_by              uuid references public.users(id) on delete set null,
  trust_score             numeric not null default 0,
  completion_score        numeric not null default 0,
  merged_into_thread_id   uuid references public.threads(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint threads_no_self_merge check (merged_into_thread_id is null or merged_into_thread_id <> id)
);

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at before update on public.threads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. thread_connections  (thread × thread, 방향)
-- ---------------------------------------------------------------------------
-- relation_type (text): influenced_by, influenced, created, created_by, belongs_to,
--   part_of, located_in, contemporary_of, related_to, shares_theme
-- connection_tier: 1 = 사실 기반, 2 = 해석 기반 (docs/canonical-knowledge-model.md)
create table if not exists public.thread_connections (
  id               uuid primary key default gen_random_uuid(),
  from_thread_id   uuid not null references public.threads(id) on delete cascade,
  to_thread_id     uuid not null references public.threads(id) on delete cascade,
  relation_type    text not null,
  connection_tier  smallint not null default 1,
  description      text,
  created_by       uuid references public.users(id) on delete set null,
  status           thread_status not null default 'community',
  trust_score      numeric not null default 0,
  created_at       timestamptz not null default now(),

  constraint thread_connections_no_self check (from_thread_id <> to_thread_id),
  constraint thread_connections_tier    check (connection_tier in (1, 2)),
  constraint thread_connections_unique  unique (from_thread_id, to_thread_id, relation_type)
);

-- ---------------------------------------------------------------------------
-- 5. bookmarks  (저장 — save-first 핵심)
-- ---------------------------------------------------------------------------
create table if not exists public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id)   on delete cascade,
  thread_id   uuid not null references public.threads(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, thread_id)
);

-- ---------------------------------------------------------------------------
-- 6. records  (기록 — 선택. thread_id nullable = 자유 기록 가능)
-- ---------------------------------------------------------------------------
create table if not exists public.records (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid not null references public.users(id)   on delete cascade,
  thread_id   uuid references public.threads(id)          on delete set null,
  content     text not null,
  media_url   text,
  visibility  visibility_type not null default 'private',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists records_set_updated_at on public.records;
create trigger records_set_updated_at before update on public.records
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. collections + collection_items
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id              uuid primary key default gen_random_uuid(),
  created_by      uuid not null references public.users(id) on delete cascade,
  title           text not null,
  slug            text not null,
  description     text,
  cover_image_url text,
  visibility      visibility_type not null default 'public',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (created_by, slug)
);

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

create table if not exists public.collection_items (
  collection_id  uuid not null references public.collections(id) on delete cascade,
  thread_id      uuid not null references public.threads(id)     on delete cascade,
  position       integer not null default 0,
  note           text,
  added_at       timestamptz not null default now(),
  primary key (collection_id, thread_id)
);

-- ---------------------------------------------------------------------------
-- 8. user_thread_activity  (탐험/Atlas/미발견 계산용)
-- ---------------------------------------------------------------------------
create table if not exists public.user_thread_activity (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users(id)   on delete cascade,
  thread_id            uuid not null references public.threads(id) on delete cascade,
  viewed               boolean not null default false,
  saved                boolean not null default false,
  recorded             boolean not null default false,
  added_to_collection  boolean not null default false,
  last_viewed_at       timestamptz,
  unique (user_id, thread_id)
);

-- ---------------------------------------------------------------------------
-- 9. sources  (외부 출처 — MVP는 thread 에 첨부)
-- ---------------------------------------------------------------------------
create table if not exists public.sources (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid references public.threads(id) on delete cascade,
  url         text not null,
  title       text,
  description text,
  created_by  uuid references public.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9b. i18n (Step 28) — Thread + i18n 레이어. (RLS 별도/추후)
-- ---------------------------------------------------------------------------
-- 표시 텍스트(title/summary/description)는 thread 가 아니라 여기 locale 별로.
create table if not exists public.thread_translations (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  locale      locale_type not null,
  title       text not null,
  summary     text,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (thread_id, locale)
);

drop trigger if exists thread_translations_set_updated_at on public.thread_translations;
create trigger thread_translations_set_updated_at before update on public.thread_translations
  for each row execute function public.set_updated_at();

-- 관점 (사용자/큐레이터/시스템). locale 보유.
create table if not exists public.viewpoints (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  user_id     uuid references public.users(id) on delete set null,
  locale      locale_type not null,
  author_type viewpoint_author not null default 'user',
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists viewpoints_set_updated_at on public.viewpoints;
create trigger viewpoints_set_updated_at before update on public.viewpoints
  for each row execute function public.set_updated_at();

-- (선택) 연결 설명의 다국어. MVP에선 미사용 가능.
create table if not exists public.thread_connection_translations (
  id            uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.thread_connections(id) on delete cascade,
  locale        locale_type not null,
  description   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (connection_id, locale)
);

-- ---------------------------------------------------------------------------
-- 10. Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_threads_type            on public.threads (type);
create index if not exists idx_threads_status          on public.threads (status);
create index if not exists idx_threads_slug            on public.threads (slug);
create index if not exists idx_connections_from        on public.thread_connections (from_thread_id);
create index if not exists idx_connections_to          on public.thread_connections (to_thread_id);
create index if not exists idx_bookmarks_user          on public.bookmarks (user_id);
create index if not exists idx_activity_user           on public.user_thread_activity (user_id);

-- 보조 인덱스 (조회 패턴)
create index if not exists idx_records_user            on public.records (created_by, created_at desc);
create index if not exists idx_collection_items_coll   on public.collection_items (collection_id, position);
create index if not exists idx_thread_translations_t   on public.thread_translations (thread_id);
create index if not exists idx_viewpoints_thread       on public.viewpoints (thread_id);

-- ============================================================================
-- 미발견(Undiscovered) 계산 메모 — 테이블 아님, 파생
--   미발견(user) = { 저장 thread 들의 thread_connections 이웃 }
--                  − { bookmarks ∪ user_thread_activity.viewed }
--   UI 노출 용어: "미발견 / 미확인 실마리 / 새로운 흔적"  (Fog/Locked/??? 금지)
-- ============================================================================
