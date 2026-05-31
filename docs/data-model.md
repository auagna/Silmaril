# Data Model — Silmaril

## 1. 도메인 다이어그램 (논리)

```
                      ┌────────────┐
                      │   users    │
                      └─────┬──────┘
                            │ 1
              ┌─────────────┼──────────────┬─────────────┬──────────────┐
              │ N           │ N            │ N           │ N            │ N
        ┌─────▼────┐  ┌─────▼──────┐  ┌────▼────┐  ┌─────▼─────┐  ┌─────▼──────┐
        │ threads  │  │perspectives│  │ records │  │collections│  │ bookmarks  │
        └─────┬────┘  └─────┬──────┘  └────┬────┘  └─────┬─────┘  └─────┬──────┘
              │             │              │              │              │
              │ N─N         │ targets      │ targets      │ N─N          │ targets
              ▼             ▼              ▼              ▼              ▼
        ┌─────────────┐     │             │       ┌───────────────┐    threads
        │connections  │     │             │       │collection_items│
        │(thread×thread)    │             │       └───────┬───────┘
        └─────────────┘     │             │               │
                            │             │               │ N
                       threads ◄──────────┘               ▼
                                                      threads

                    ┌──────────┐                ┌──────────────────────┐
                    │ sources  │ (URL/refs)     │user_thread_activity  │
                    └────┬─────┘                │ (감지된 행동 로그)   │
                         │                      └──────────────────────┘
                         ▼
                    threads or perspectives or records
```

## 2. 엔터티

### 2.1 `users`
- `id` (uuid, PK = auth.uid)
- `handle` (unique)
- `display_name`
- `avatar_url`
- `bio`
- `role`: `member` | `partner` | `admin`
- `created_at`

> Auth는 Supabase Auth 사용. `users.id` = `auth.users.id`. 트리거로 가입 시 행 생성.

### 2.2 `threads`
- `id` (uuid, PK)
- `slug` (unique, kebab) — URL용
- `title` — 정식 명칭
- `aliases` (text[]) — 별칭/표기 변형 (검색에 활용)
- `type`: `person` | `work` | `movement` | `place` | `event` | `organization` | `company` | `media` | `book` | `film` | `music`
- `summary` (text) — 1~2 문장 요약
- `body` (markdown) — 본문 (선택)
- `cover_url`
- `status`: `local` | `community` | `verified` | `official` | `merged` | `archived`
- `merged_into` (uuid, FK → threads.id, nullable) — `status='merged'` 일 때만 유효
- `created_by` (uuid → users.id)
- `created_at`, `updated_at`

### 2.3 `connections`
- `id` (uuid, PK)
- `from_thread` (uuid → threads.id)
- `to_thread` (uuid → threads.id)
- `relation`: `influenced_by` | `created` | `member_of` | `located_in` | `contemporary_of` | `related_to` | `derived_from` | `belongs_to`
- `note` (text, nullable)
- `created_by`
- `created_at`
- **unique** (from_thread, to_thread, relation)

> 방향이 있는 그래프. UI에서는 양방향처럼 보여 줄 수 있지만 모델은 방향 있음.

### 2.4 `perspectives`
- `id` (uuid, PK)
- `thread_id` (uuid → threads.id)
- `title`
- `body` (markdown)
- `stance`: `intro` | `critique` | `context` | `legacy` | `personal` | `comparison`
- `visibility`: `private` | `public`
- `created_by`
- `created_at`, `updated_at`

### 2.5 `records`
- `id` (uuid, PK)
- `thread_id` (uuid → threads.id, **nullable** — 실마리에 묶이지 않은 자유 기록도 가능)
- `body` (markdown / plain — UI는 짧은 글 위주)
- `media_url` (nullable, 이미지/스크린샷)
- `visibility`: `private` | `followers` | `public`
- `created_by`
- `created_at`

### 2.6 `collections`
- `id` (uuid, PK)
- `slug` (unique per user)
- `title`
- `description`
- `cover_url`
- `visibility`: `private` | `public`
- `created_by`
- `created_at`, `updated_at`

### 2.7 `collection_items`
- `collection_id` (FK)
- `thread_id` (FK)
- `position` (int) — 정렬용
- `note` (text, nullable)
- `added_at`
- PK = (collection_id, thread_id)

### 2.8 `bookmarks`
- `user_id` (FK)
- `thread_id` (FK)
- `created_at`
- PK = (user_id, thread_id)

### 2.9 `reactions`
- `id` (uuid)
- `user_id`
- `target_kind`: `thread` | `perspective` | `record`
- `target_id` (uuid)
- `kind`: `like`
- `created_at`
- **unique** (user_id, target_kind, target_id, kind)

> 정렬 기준으로 쓰지 말 것. (DECISIONS#D-006)

### 2.10 `sources`
- `id` (uuid)
- `url`
- `title` (nullable)
- `description` (nullable)
- `kind`: `article` | `book` | `video` | `audio` | `image` | `other`
- `attached_to_kind`: `thread` | `perspective` | `record`
- `attached_to_id`
- `created_by`
- `created_at`

### 2.11 `user_thread_activity`
사용자가 어떤 실마리와 어떤 식으로 접점이 있었는가의 비정규화 로그.
지도(Map) 페이지 / 추천에서 활용.

- `user_id`
- `thread_id`
- `kind`: `view` | `like` | `bookmark` | `record` | `connect` | `collect` | `perspective`
- `weight` (numeric) — 추천용 가중치
- `last_at` (timestamp)
- PK = (user_id, thread_id, kind)

## 3. 정렬 / 추천에서 쓰는 시그널

```
score(thread) =
    + bookmarks_count        × 3.0
    + connections_count      × 4.0   -- (incoming + outgoing)
    + collection_inclusions  × 4.0
    + records_count          × 5.0
    + perspectives_count     × 5.0
    + reactions_like_count   × 0.5   -- 가벼움
    - days_since_active      × 0.1
```

수치는 초기값. M5에서 튜닝.

## 4. 무결성 규칙

1. `threads.merged_into` 는 `status='merged'` 일 때만 NOT NULL.
2. `merged_into` 가 가리키는 thread는 다시 `merged` 일 수 없다 (체인 금지) — 트리거에서 검증.
3. `connections.from_thread != to_thread` — 자기 자신 연결 금지.
4. `collection_items.position` 은 컬렉션 내에서 유일.
5. `local` 상태의 Thread는 작성자 본인만 SELECT 가능 (RLS).
6. `community` 이상은 모두 SELECT 가능, 단 `merged`/`archived` 는 검색에서 숨김.

## 5. 인덱스 (성능)

- `threads.slug` unique idx
- `threads (status, type)` — Explore 타입 탭
- `threads (created_at desc)` — 최신
- `connections (from_thread)` / `(to_thread)` — 그래프 쿼리
- `perspectives (thread_id, created_at desc)`
- `records (created_by, created_at desc)` / `(thread_id, created_at desc)`
- `bookmarks (user_id)` / `(thread_id)`
- GIN on `threads.aliases` — 별칭 검색
- GIN/trigram on `threads.title` — 부분 매칭 검색
