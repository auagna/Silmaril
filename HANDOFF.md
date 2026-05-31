# HANDOFF

> 다음 세션 (또는 다음 에이전트) 을 위한 인계 문서. 항상 최신 상태로 유지.
> **교대 규칙은 [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) 에 있다. 시작 전 반드시 읽는다.**

## 교대 (Claude Code ↔ Codex)

- 이어받는 기준: **이 문서(현재 상태) + `TASKS.md` 의 `## Now`**.
- 시작 시 git pull, 종료 시 커밋(+push). 원격: https://github.com/auagna/Silmaril
- 한 세션 = `## Now` 의 첫 미완료 항목 하나.

## 현재 상태 (2026-06-01)

**M0/M1 완료, 교대 프로토콜 수립 완료.**
**M2 진행 중 — Supabase Auth(클라이언트) + Create Thread 완료.**

### 이번에 추가된 것 (Create Thread)
- `/create/thread` 실마리 생성 폼 (title/type/summary/body/status[local|community]).
- `src/features/threads/`: `slug.ts`, `threadService.ts`(createThread + getThreadBySlug), `ThreadCreateForm.tsx`, `ThreadLiveView.tsx`.
- slug 전역 UNIQUE 충돌 시 `-2`,`-3`… 자동 접미사 (생성 안 막음, D-011/D-005).
- 생성 후 `/threads/[slug]` 이동. 상세는 더미 미스 시 `ThreadLiveView`(브라우저 클라이언트)로 실데이터 조회 → 본인 local 도 보임.
- `/create` 허브의 '실마리 생성' 카드가 이제 실제로 열림.
- **검증:** `npm run build` 11 라우트 통과 + dev 라이브 스모크 전 라우트 200.
- **운영 팁:** dev 에서 `Cannot find module './vendor-chunks/*.js'` 500 → `.next` 지우고 재시작 (이번에 한 번 발생, 해결).

### 이번에 추가된 것 (Auth)
- 회원가입 `/signup`, 로그인 `/login`, 로그아웃(Nav 우측), 현재 사용자 조회.
- `/create` 는 로그인 사용자만 접근 (`AuthGuard`, 클라이언트 가드).
- 프로필(`public.users`)은 **DB 트리거 `handle_new_user` 가 자동 생성** — `username→handle`, `name→display_name` (D-010). 클라이언트는 users 에 insert 안 함.
- UI 프리미티브 `src/components/ui/{Button,Input,Card}` 추가 (ink 톤).
- **검증:** `npm run build` 성공(10 라우트), `npx tsc --noEmit` 통과.
- **부수 수정:** `domain.ts` 의 엔티티명 `Record` 가 전역 `Record<K,V>` 를 가려 라벨 맵이 깨지던 기존 버그 수정(매핑 타입으로 교체). Next 14.2.5 → 14.2.35 보안 패치.

### ⚠️ 사람이 할 일 (Auth 동작 위해, Supabase 대시보드)
1. **트리거 갱신 (1회, 권장):** `schema.sql` 의 `handle_new_user()` 를 username 인식 버전으로 바꿨다.
   이미 옛 버전을 적용했으므로, SQL Editor 에서 `schema.sql` 의 `create or replace function public.handle_new_user() ... $$;` 블록(약 84~103행)만 복사해 다시 Run.
   (안 해도 가입은 됨 — 단 handle 이 `u_xxxx` 자동값이 됨.)
2. **이메일 확인 OFF (개발 편의):** Authentication → Providers → Email → "Confirm email" 끄기.
   켜져 있으면 가입 후 메일 확인 전까지 로그인 불가 (이 경우 가입은 `/login` 으로 보냄).

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

다음 에이전트는 **D1. 디자인 시스템 + 전역 셸 (UI/UX 패스)** 부터 시작한다. (사용자가 UI/UX 최우선으로 지정.)

**진행 전 (사람):** Claude Code 재시작 → 프로젝트 `.mcp.json` 의 **lazyweb 서버 승인** → `mcp__lazyweb__*` 도구 로드 확인.
**D1 방법 (네이티브 Lazyweb 도구로):**
1. `lazyweb_list_categories` / `lazyweb_list_collections` 로 결 파악, `lazyweb_search` 로 'minimal knowledge base', 'calm dashboard', 'note/archive app', 'graph explorer' 등 레퍼런스 수집.
2. 토큰 정리: 색(현재 ink + accent forest 유지/보정), 타이포(serif 디스플레이 + sans 본문), 간격 스케일, radius, Nav/레이아웃.
3. 적용: `tailwind.config.ts`, `app/globals.css`, `components/Nav.tsx`, `components/ui/{Button,Input,Card}`. 화면 로직은 건드리지 말고 **토큰/셸만** 먼저.
- 톤 기준: Apple HIG 여백·정돈 / Obsidian 탐험성 / Letterboxd 기록 / Wikipedia 정보구조.
- Lazyweb 메모/주의: [[lazyweb-ui-reference]] — 토큰은 `~/.lazyweb/lazyweb_mcp_token` + gitignore된 `.mcp.json`. **공개 레포에 커밋 금지.**

그 다음 N6 Perspective(페이지 하나·관점 여럿) → N3 상세 통합 → N4 Explore 실데이터.
(N2 인증·N5 Create Thread 완료. N1(@supabase/ssr) 이월. 상세·순서는 `TASKS.md ## Now` 가 정본.)

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
