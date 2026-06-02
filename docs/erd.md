# Supabase ERD (MVP)

> 정본 방향: [silmaril-v2-direction.md](./silmaril-v2-direction.md) · 스키마 파일: [`supabase/schema.sql`](../supabase/schema.sql).
> 범위: MVP. RLS / AI Wiki / perspectives / taste_profiles / reports / curator_badges / NOU HAUS = 추후.

## 관계 개요

```
auth.users ──1:1── users ──1:N── threads ──1:N── thread_connections (thread × thread)
                     │              │
                     │              ├──N── bookmarks (user × thread, 저장)
                     │              ├──N── collection_items ──N:1── collections
                     │              ├──N── records (thread_id nullable, 선택)
                     │              ├──N── sources
                     │              └──N── user_thread_activity (탐험/미발견 계산)
```

## Enums

| enum | 값 |
|------|----|
| `user_role` | user · partner · admin |
| `thread_type` | person · work · movement · place · **concept** · organization |
| `thread_status` | local · community · verified · official · merged · archived |
| `visibility_type` | private · public · followers |

> `thread_connections.relation_type` 은 **text** (예: influenced_by, created, member_of, located_in, contemporary_of, related_to, derived_from, belongs_to). MVP에선 enum 아님.

## 테이블

### users (auth.users 1:1)
`id`(=auth.uid) · `handle`(unique) · `display_name` · `avatar_url` · `bio` · `role`(user_role, def user) · `created_at` · `updated_at`
- 가입 시 트리거 `handle_new_user` 가 행 생성 (username→handle, name→display_name).

### threads
`id` · `title` · `slug`(unique) · `type`(thread_type) · `summary` · `description` · `cover_image_url` · `status`(thread_status, def local) · `created_by`→users · `trust_score`(numeric) · `completion_score`(numeric) · `merged_into_thread_id`→threads · `created_at` · `updated_at`
- self-merge 방지 check. `updated_at` 자동 갱신.

### thread_connections (방향 있는 연결) — 핵심 자산
`id` · `from_thread_id`→threads · `to_thread_id`→threads · `relation_type`(text) · **`connection_tier`(smallint 1|2)** · `description` · `created_by`→users · `status`(thread_status, def community) · `trust_score` · `created_at`
- self 금지 check. tier in (1,2) check. unique(from, to, relation_type).
- relation_type: influenced_by/influenced/created/created_by/belongs_to/part_of/located_in/contemporary_of/related_to/shares_theme.
- tier 1=사실, 2=해석 ([canonical-knowledge-model.md](./canonical-knowledge-model.md)).

### bookmarks (저장 — save-first)
`id`(PK) · `user_id`→users · `thread_id`→threads · `created_at` · **unique(user_id, thread_id)**.

### records (기록 — 선택)
`id` · `created_by`→users · `thread_id`→threads(nullable, 자유 기록) · `content` · `media_url` · `visibility`(visibility_type, def private) · `created_at` · `updated_at`.

### collections / collection_items
- collections: `id` · `created_by`→users · `title` · `slug` · `description` · `cover_image_url` · `visibility` · `created_at` · `updated_at` · unique(created_by, slug).
- collection_items: `collection_id`→collections · `thread_id`→threads · `position` · `note` · `added_at` · PK(collection_id, thread_id).

### user_thread_activity (탐험/Atlas/미발견 계산용)
`id`(PK) · `user_id`→users · `thread_id`→threads · `viewed`(bool) · `saved`(bool) · `recorded`(bool) · `added_to_collection`(bool) · `last_viewed_at` · **unique(user_id, thread_id)**.

### sources
`id` · `thread_id`→threads · `url` · `title` · `description` · `created_by`→users · `created_at`.

## Indexes
`threads.type` · `threads.status` · `threads.slug` · `thread_connections.from_thread_id` · `thread_connections.to_thread_id` · `bookmarks.user_id` · `user_thread_activity.user_id` (+ records(created_by,created_at), collection_items(collection_id,position)).

## 미발견(Undiscovered) — 테이블 아님, 파생

> 사용자 UI 용어: **미발견 / 미확인 실마리 / 새로운 흔적**. (`???`/`Fog`/`Locked` 금지.)

```
미발견(user) = { 저장 thread 들의 thread_connections 이웃 }
              − { bookmarks ∪ user_thread_activity.viewed }
```
- Atlas/탐험률은 `user_thread_activity` + `thread_connections` + `bookmarks` 집계로 파생 (별도 거대 테이블 없음).

## 추후 테이블 (MVP 미구현)
`perspectives` · `taste_profiles` · `curator_badges` · `reports` · `nouhaus_classes` · (AI Wiki 시드용 `origin` 컬럼 / aliases).

## 정합성 메모 (코드와 차이 → EXP4에서 정렬)
- `src/types/database.ts` 는 이전(웹) 명칭(`body`/`cover_url`/`origin`/`connections`, role `member`)이라 **새 스키마와 불일치.** EXP4 wiring 시 정렬 필요:
  `body→description`, `cover_url→cover_image_url`, connection 필드 `from_thread_id/to_thread_id/relation_type`, role `user`, MVP 6 타입.
- 기존 `supabase/policies.sql` 는 옛 스키마용 → RLS 작성 단계에서 새로 작성.
