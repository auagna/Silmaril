# Supabase ERD (MVP)

> 정본 방향: [silmaril-v2-direction.md](./silmaril-v2-direction.md). 상세 컬럼/RLS 해설: [supabase-schema.md](./supabase-schema.md).
> ⚠️ 기존 `supabase/schema.sql` 과의 차이 → §마이그레이션 노트.

## MVP 테이블 (9)

```
users ──1:N── threads ──1:N── thread_connections (thread × thread)
  │              │
  │              ├──N── bookmarks (user × thread)          [저장]
  │              ├──N── collection_items ──N:1── collections
  │              ├──N── records (thread_id nullable)        [기록·선택]
  │              ├──N── sources (attached_to)
  │              └──N── user_thread_activity (행동 로그)
```

| 테이블 | 핵심 컬럼 | 역할 |
|--------|-----------|------|
| `users` | id(=auth.uid), handle, display_name, avatar_url | 프로필 |
| `threads` | id, slug, title, aliases[], **type**, summary, body, cover_url, status, **origin**(ai/user/curator), created_by | 실마리 |
| `thread_connections` | id, from_thread, to_thread, relation, note, origin, created_by | 연결(방향) |
| `bookmarks` | (user_id, thread_id) PK, created_at | **저장** (1급) |
| `records` | id, thread_id(null 허용), body, media_url, visibility, created_by | 기록(선택) |
| `collections` | id, slug, title, description, cover_url, visibility, created_by | 컬렉션 |
| `collection_items` | (collection_id, thread_id) PK, position, note | 컬렉션 항목 |
| `user_thread_activity` | (user_id, thread_id, kind) PK, weight, last_at | 행동 로그 (Atlas/추천/미발견 계산) |
| `sources` | id, url, title, kind, attached_to_kind, attached_to_id | 출처 |

### type enum (MVP)
`person · work · movement · place · concept · organization` (확장: event/company/book/film/music/media)

### relation enum
`influenced_by · created · member_of · located_in · contemporary_of · related_to · derived_from · belongs_to`

### origin enum (신규, D-013/AI-seed)
`ai · user · curator` — AI Wiki 가 시드한 데이터 구분.

## 미발견(Undiscovered) — 테이블 아님, 파생

> 사용자 UI 용어: **미발견 / 미확인 실마리 / 새로운 흔적**. (`???`/`Fog`/`Locked` 금지.)

```
미발견(user) = { 저장한 thread 들의 connection 이웃 }  −  { 이미 bookmark 했거나 view 한 thread }
```
- `getUndiscoveredThreads(user)` 가 위 차집합을 반환.
- 탭하면 그 실마리가 드러나고(미발견 → 발견), 그 이웃이 다시 미발견으로 확장 → 호기심 루프.

## Atlas / Explore — 파생 뷰

- Atlas 는 별도 거대 테이블 아님. 소스 = `bookmarks` + `thread_connections` + `user_thread_activity`.
- 진행률(예: "일본 건축 32%")은 `user_thread_activity` 집계. (Culture Map 차원은 thread 의 place/movement 연결로 산출.)

## 추후 테이블 (MVP 미구현)

`perspectives` · `taste_profiles` · `curator_badges` · `reports` · `nouhaus_classes`

> **perspectives 는 Should-Have로 미뤄짐** (D-013). 관점은 v0.2+.

## 마이그레이션 노트 (기존 schema.sql → MVP ERD)

기존 `supabase/schema.sql` 은 웹 MVP용으로 이미 적용됨. RN MVP wiring 단계에서 조정:

1. `connections` → **`thread_connections`** 로 이름 변경 (또는 신규 생성).
2. `perspectives` → **미구현(future)**. 테이블은 남겨둬도 무방하나 MVP 코드에선 미사용.
3. `reactions`(좋아요) → **MVP에서 제외** (save-first, 좋아요 없음). 테이블 보존 가능, 미사용.
4. `threads`/`thread_connections` 에 **`origin`** 컬럼 추가.
5. `threads.type` enum 에 `concept` 포함 확인 (이미 있음).

> 라이브 DB는 wiring 단계에서 마이그레이션 SQL 로 안전하게 변경. 이 문서가 목표 상태(SSOT).
