-- ============================================================================
-- Silmaril — RESET (구 스키마 정리). schema.sql 적용 전에 1회 실행.
-- ⚠️ public 스키마의 Silmaril 테이블/타입/함수를 모두 삭제한다. (실데이터 없을 때만!)
--    auth/storage 등 Supabase 내부 스키마는 건드리지 않는다.
-- 순서: reset.sql → schema.sql → seed.sql
-- ============================================================================

-- 트리거 (auth.users)
drop trigger if exists on_auth_user_created on auth.users;

-- 함수 (신/구)
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.touch_updated_at() cascade;
drop function if exists public.enforce_merge_chain() cascade;
drop function if exists public.slug_unique_or_suffix(text) cascade;
drop function if exists public.is_admin() cascade;

-- 테이블 (신 + 구 웹스키마 포함)
drop table if exists
  public.thread_connection_translations,
  public.thread_translations,
  public.viewpoints,
  public.source_claims,
  public.source_documents,
  public.review_candidates,
  public.collection_items,
  public.collections,
  public.bookmarks,
  public.records,
  public.sources,
  public.user_thread_activity,
  public.thread_connections,
  public.connections,     -- 구
  public.perspectives,    -- 구
  public.reactions,       -- 구
  public.threads,
  public.users
  cascade;

-- 타입/enum (신 + 구)
drop type if exists
  viewpoint_author,
  locale_type,
  visibility_type,
  visibility,             -- 구
  thread_status,
  thread_type,
  user_role,
  relation_kind,          -- 구
  perspective_stance,     -- 구
  source_kind,            -- 구
  target_kind,            -- 구
  reaction_kind,          -- 구
  activity_kind           -- 구
  cascade;
