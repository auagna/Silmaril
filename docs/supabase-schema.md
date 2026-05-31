# Supabase Schema — Silmaril

> 이 문서는 `supabase/schema.sql` 과 `supabase/policies.sql` 의 의도/해설을 담는다. SQL 자체는 그쪽 파일을 보면 된다.

## 1. 적용 순서

```
1. supabase/schema.sql     -- enum, 테이블, 인덱스, 트리거, 함수
2. supabase/policies.sql   -- RLS 활성화 + 정책
3. (선택) 시드 스크립트     -- M2에서 추가
```

Supabase 대시보드 → SQL Editor → 새 쿼리에서 위 순서로 실행.

## 2. Enum 정의

```sql
thread_type     :  person | work | movement | place | event
                 | organization | company | media | book | film | music
thread_status   :  local | community | verified | official | merged | archived
visibility      :  private | followers | public
user_role       :  member | partner | admin
relation_kind   :  influenced_by | created | member_of | located_in
                 | contemporary_of | related_to | derived_from | belongs_to
perspective_stance : intro | critique | context | legacy | personal | comparison
source_kind     :  article | book | video | audio | image | other
target_kind     :  thread | perspective | record
reaction_kind   :  like
activity_kind   :  view | like | bookmark | record | connect | collect | perspective
```

## 3. 테이블 요약

| 테이블 | 한 줄 |
|--------|------|
| `users` | auth.users 와 1:1, 공개 프로필 정보 |
| `threads` | 실마리 본체 |
| `connections` | 실마리 간 방향성 있는 관계 |
| `perspectives` | 실마리에 대한 큐레이션된 해석 |
| `records` | 개인 기록 (피드) |
| `collections` | 사용자 큐레이션 묶음 |
| `collection_items` | 컬렉션 ↔ 실마리 매핑 |
| `bookmarks` | 사용자가 저장한 실마리 |
| `reactions` | 좋아요 (target_kind로 다형) |
| `sources` | 외부 URL/참고 |
| `user_thread_activity` | 사용자-실마리 활동 로그 (집계용) |

## 4. RLS 핵심 정책 — 5 줄 요약

1. **자기 데이터는 자기가 본다 / 쓴다.**
2. **Thread 는 `community` 이상이면 누구나 SELECT, `local` 은 작성자만.**
3. **Perspective / Record 는 `visibility` 컬럼이 진실.** `public` 이면 누구나, `private` 은 본인만.
4. **`merged_into` 는 트리거에서 체인을 막는다.** (A→B→C 금지: A→C 로 평탄화.)
5. **`role='admin'` 은 모든 정책을 우회한다** (서비스 운영용).

## 5. 트리거 / 함수

### 5.1 `handle_new_user()`
- `auth.users` 삽입 시 `public.users` 에 기본 행 생성.
- `handle` 은 `u_<id 앞 8자>` 로 자동 채움, 사용자가 후속 편집 가능.

### 5.2 `enforce_merge_chain()`
- `BEFORE UPDATE OF status, merged_into ON threads`.
- `status='merged'` 인데 `merged_into IS NULL` → 거부.
- `merged_into` 가 또 `merged` 인 thread → 그 thread 의 `merged_into` 로 평탄화.

### 5.3 `touch_updated_at()`
- 공용. `updated_at = now()` 로 갱신.

### 5.4 `slug_unique_or_suffix(input text) returns text`
- `threads.slug` 중복 시 `-2`, `-3` 붙여 반환.
- Create flow 의 서버 액션에서 사용.

## 6. 인덱스

```
threads (status, type)
threads (created_at DESC)
threads USING GIN (aliases)
threads USING GIN (to_tsvector('simple', title))

connections (from_thread)
connections (to_thread)
connections (relation)

perspectives (thread_id, created_at DESC)
records (created_by, created_at DESC)
records (thread_id, created_at DESC)

bookmarks (user_id)
bookmarks (thread_id)

collection_items (collection_id, position)
user_thread_activity (user_id, kind, last_at DESC)
```

## 7. 시드 / 디버그

- 실 운영 시드는 `supabase/seeds/` 로 분리 (M2).
- 로컬 개발 중에는 `src/lib/dummy.ts` 만으로 UI 가 동작하므로 DB 시드 없이도 모든 화면을 본다.

## 8. RLS 디버깅 체크리스트

쿼리가 비어 돌아오면 순서대로:

1. `auth.uid()` 가 있는가? (서버 컴포넌트면 `@supabase/ssr` 세션 확인)
2. 대상 행의 `status` / `visibility` 가 정책을 통과하는가?
3. `merged` 행을 보려고 한 건 아닌가? — 대부분의 SELECT 정책에서 제외됨.
4. join 대상의 RLS 가 막은 건 아닌가? — Supabase는 join 도 정책을 모두 통과해야 함.
