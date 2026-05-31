# HANDOFF

> 다음 세션 (또는 다음 에이전트) 을 위한 인계 문서. 항상 최신 상태로 유지.
> **교대 규칙은 [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) 에 있다. 시작 전 반드시 읽는다.**

## 교대 (Claude Code ↔ Codex)

- 이어받는 기준: **이 문서(현재 상태) + `TASKS.md` 의 `## Now`**.
- 시작 시 git pull, 종료 시 커밋(+push). 원격: https://github.com/auagna/Silmaril
- 한 세션 = `## Now` 의 첫 미완료 항목 하나.

## 현재 상태 (2026-06-01)

**M0 (Foundation) 완료, M1 (더미 기반 UI) 완료. M2 (Supabase 연결) 미착수.**
**교대 프로토콜(`CLAUDE.md`/`AGENTS.md`) 수립 완료.**

### 무엇이 동작하는가
- Next.js App Router 스켈레톤. `/`, `/explore`, `/create`, `/map`, `/profile`, `/threads/[id]` 라우트가 더미 데이터로 동작.
- Tailwind 적용. 톤은 흰 배경 + 두꺼운 본문 여백 + 가는 라인의 카드. 다크 모드는 토큰 준비만 함.
- TypeScript 도메인 타입 정의 (`src/types/domain.ts`). Supabase 스키마와 1:1.
- 더미 시드 (`src/lib/dummy.ts`) — 디터 람스 / 바우하우스 / 브라운 / 빛의 교회 / 데이비드 보위 등이 들어 있음.
- Supabase 클라이언트 분리 (`src/lib/supabase.ts`) — 환경변수 없이는 동작 안 함, 빌드 시점 깨지지 않게 lazy.
- Supabase SQL 스키마 (`supabase/schema.sql`) + RLS 정책 (`supabase/policies.sql`) 작성됨. **아직 어느 프로젝트에도 적용 안 함.**

### 무엇이 동작하지 않는가
- 실제 인증 없음 (현재 사용자는 더미 `users[0]`).
- 실제 Supabase 연결 없음. 모든 데이터는 메모리 상의 더미.
- Map 페이지의 그래프는 React Flow placeholder — 노드 / 엣지 렌더링은 됨, 실제 연결 데이터에 묶이는 작업은 M2.
- 검색은 클라이언트 필터 (`includes`) — 풀텍스트 / 별칭 / 임베딩 검색은 M5.

## 다음 작업 = `TASKS.md` 의 `## Now` 첫 항목

다음 에이전트는 **N1. `@supabase/ssr` 도입 + 서버/브라우저 클라이언트 분리** 부터 시작한다.
(상세·순서는 `TASKS.md ## Now` 가 정본. 여기서는 맥락만.)

**전제 (사람이 1회):**
- Supabase 프로젝트 **`gqvjpfoxktueiclhpjlu`** 가 생성됨 (URL: `https://gqvjpfoxktueiclhpjlu.supabase.co`).
- SQL Editor 에서 `supabase/schema.sql` → `supabase/policies.sql` 실행 (아직 적용 여부 미확인 — 적용했으면 이 줄 갱신할 것).
- `.env.local` 에 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력. **service role key 는 클라이언트에 절대 노출 금지.**

**N1~N4 맥락:**
- N1: `src/lib/supabase.ts` 는 유지. SSR/서버 헬퍼는 같은 `src/lib/` 안에서 확장 (구조 재배치 금지).
- N2: 매직링크부터.
- N3: 첫 라이브 라우트는 `/threads/[id]` — 가장 정보가 풍부, 파급 효과 큼. 행 없으면 더미 폴백.
- N4: Explore 실데이터 — 검색은 `title`/`aliases` `ilike`.
- 이후 Create 흐름: 실마리 생성 시 `status='local'` 즉시 저장, 본인 지도/기록에 바로 반영 (D-002).

## 절대 깨지면 안 되는 원칙 (코드에 새기지 말고 행동으로 지킬 것)

1. **생성 흐름에 브레이크를 걸지 마라.** 공식화 / 검증을 생성의 전제로 만들지 않는다.
2. **중복 실마리는 새 페이지를 만들지 말고 병합한다.** (`merged_into` 사용 — D-005)
3. **하나의 실마리에는 여러 관점이 붙는다.** 같은 대상에 페이지를 두 개 만들지 않는다.
4. **좋아요로 정렬하지 않는다.** 저장 / 연결 / 컬렉션 포함 수가 1등급 시그널 (D-006).

## 변경 파일 목록 (이번 세션)

```
README.md                                (new)
CLAUDE.md                                (new) — 공유 에이전트 프로토콜
AGENTS.md                                (new) — Codex 진입점 → CLAUDE.md
TASKS.md                                 (new)
DECISIONS.md                             (new)
HANDOFF.md                               (new)
.env.example                             (new)
docs/product-spec.md                     (new)
docs/data-model.md                       (new)
docs/information-architecture.md         (new)
docs/supabase-schema.md                  (new)
supabase/schema.sql                      (new)
supabase/policies.sql                    (new)
package.json                             (new)
tsconfig.json                            (new)
next.config.mjs                          (new)
postcss.config.mjs                       (new)
tailwind.config.ts                       (new)
.gitignore                               (new)
src/app/layout.tsx                       (new)
src/app/page.tsx                         (new)
src/app/globals.css                      (new)
src/app/explore/page.tsx                 (new)
src/app/create/page.tsx                  (new)
src/app/map/page.tsx                     (new)
src/app/profile/page.tsx                 (new)
src/app/threads/[id]/page.tsx            (new)
src/components/Nav.tsx                   (new)
src/components/ThreadCard.tsx            (new)
src/components/PerspectiveCard.tsx       (new)
src/components/RecordCard.tsx            (new)
src/components/CollectionCard.tsx        (new)
src/components/FilterChip.tsx            (new)
src/components/EmptyState.tsx            (new)
src/components/Badge.tsx                 (new)
src/features/threads/ThreadHeader.tsx    (new)
src/features/perspectives/PerspectiveList.tsx (new)
src/features/records/RecordFeed.tsx      (new)
src/features/collections/CollectionGrid.tsx   (new)
src/features/map/GraphView.tsx           (new)
src/lib/supabase.ts                      (new)
src/lib/dummy.ts                         (new)
src/types/domain.ts                      (new)
src/utils/cn.ts                          (new)
```

## 실행 방법

```bash
npm install
cp .env.example .env.local   # (선택) 키 비어 있어도 더미 UI는 동작
npm run dev
# → http://localhost:3000
```

## 알려진 위험 / 트레이드오프

- **React Flow는 SSR과 잘 안 맞는다.** Map 페이지의 그래프 컴포넌트는 `'use client'` 로 격리되어 있음. 페이지 자체는 서버 컴포넌트.
- **`reactions` 테이블을 두긴 했지만 정렬에 쓰지 말 것.** 단순 카운트는 보여 줘도, 추천 / 정렬에서는 `bookmarks` + `connections` 우선.
- **`local` 상태의 RLS는 까다롭다.** 본인만 볼 수 있어야 하지만, 본인 컬렉션/기록에서 참조할 때 join 결과가 비어 보이면 안 됨. policies.sql의 `threads_select` 정책을 보존할 것.
