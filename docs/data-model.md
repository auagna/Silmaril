# Data Model — Silmaril

> ⚠️ **v2 (D-013) 추가 개념은 §12 참고.** 정본 = [silmaril-v2-direction.md](./silmaril-v2-direction.md).

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

## 12. v2 추가 개념 (D-013) — Atlas / Fog / AI-seed

> 스키마 확정은 W2 와이어프레임 + Atlas 설계 후. 여기서는 데이터 의도만.

### 12.1 AI-seed (threads/connections 출처 구분)
- `threads.origin`: `ai` | `user` | `curator` (신규 enum 후보). AI Wiki 가 시드한 실마리/연결을 구분.
- 기존 `created_by` 는 유지하되, AI 시드는 시스템 유저 또는 `origin='ai'` 로 표시.
- 흐름: **AI Wiki → threads(origin=ai, status≈community) → connections(origin=ai) → 유저가 보정/추가.**
- 빈 그래프로 시작하지 않는다 (D-013). 유저 `local` 생성은 여전히 허용(D-002).

### 12.2 Atlas / Exploration progress
- Atlas 는 **뷰**다(별도 거대 테이블 아님). 소스 = `bookmarks` + `connections` + `user_thread_activity`.
- `user_exploration` (집계, 신규 후보): `user_id`, `region/culture/movement` 차원별 `discovered_count`, `total_estimate`, `progress`(%) — Globe/Cultural Map 용.
- Atlas 모드: Graph(연결) / Cultural Map(지역·사조 차원) / Globe(future).

### 12.3 Fog (미지 영역)
- Fog 는 저장된 실마리의 **이웃 중 아직 본/저장 안 한** 노드를 `???`로 노출 (추천 아님, 미스터리).
- 데이터: `connections` 에서 발견된 이웃 − (`bookmarks` ∪ `user_thread_activity.view`) 차집합.
- "Unlock path": Fog 노드를 열면 그 이웃이 다시 Fog 로 확장 → 호기심 루프.

### 12.4 Taste Identity (future)
- `user_taste` (future): Architect/Discoverer/Curator/Critic/Evangelist 점수 — 탐험 *행동* 집계로 산출 (MBTI 아님).

### 12.5 NOU HAUS 확장 포인트 (MVP 미구현)
- 미래 통합만 고려: thread → "skill/course" 매핑 테이블 자리만 비워둠. MVP 스키마에 넣지 않는다.
