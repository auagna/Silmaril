# DECISIONS

> 의사결정 로그. 새 결정은 위에 추가. 각 항목은 *맥락 → 결정 → 결과*.

---

## 2026-06-02 · D-016 · Expo SDK 51 → 54 업그레이드

- **맥락:** iOS Expo Go(앱스토어 최신)가 **SDK 54** 인데 프로젝트는 SDK 51 → "Project is incompatible" 로 실기기에서 안 열림. iOS Expo Go 는 구버전 설치 불가(최신만 지원).
- **결정:** 프로젝트를 **Expo SDK 54** 로 올림. `expo@^54` 설치 후 `expo install --fix` 로 정렬: react 19.1 · react-native 0.81.5 · expo-router 6.0.24 · safe-area 5.6 · screens 4.16 · async-storage 2.2 · ts 5.9. `@types/react` 19, typescript 5.9 수동 정렬.
- **npm peer 충돌:** React 19 로 ERESOLVE → **`.npmrc` 에 `legacy-peer-deps=true`** (SDK 53+ / npm 표준 회피책). 커밋됨.
- **결과:** `tsc --noEmit` 통과, `expo config` sdkVersion 54.0.0. 코드 변경 불필요(expo-router 6 API 동일). 검증은 사용자 Expo Go(SDK 54).
- **참고:** SDK 변경 후 첫 실행은 `npx expo start -c`(캐시 클리어) 권장.

## 2026-06-01 · D-015 · 사용자 용어 — "미발견" (`???`/`Fog`/`Locked` 금지) + Atlas 인터랙션

- **맥락:** v2 와이어프레임에서 `???`로 미지영역 표시 → 사용자가 "오류난 줄" 안다는 피드백.
- **결정:**
  - 미지영역의 **사용자 노출 용어 = 미발견 / 미확인 실마리 / 새로운 흔적 / 연결 가능한 실마리.** UI에 `???`·`Fog`·`Locked` 절대 금지.
  - `Atlas`·`Fog`·`Graph`·`Culture Map` 은 **내부 개념 용어**. 사용자에겐 탭 이름 "탐험"(Explore).
  - **Atlas 인터랙션 = 키워드 탭 + 스와이프** (노드를 눌러 들어가고, 스와이프로 인접 실마리 탐색). 무거운 그래프 조작 아님.
- **결과:** RN Explore 화면은 키워드/카드 탭+스와이프, 미발견은 절제된 표현(예: "새로운 흔적 6개").

## 2026-06-01 · D-014 · 스택 전환 — 웹(Next.js) → iPhone-first Expo React Native

- **맥락:** 제품을 **iPhone 앱부터** 만들기로 확정. 기존 Next.js 웹 MVP(인증·Create Thread, 빌드 정상)는 문서/스키마/UX 검증용 디딤돌이었음.
- **결정:**
  - **Expo React Native + Expo Router + TypeScript + Supabase** 로 모바일 앱을 본진으로 개발. NativeWind 또는 StyleSheet (구현 시 택1).
  - 폴더: `app/(tabs)/{index,search,explore,records,profile}.tsx` + `app/auth/*` + `app/thread/[id].tsx` + `src/{components,features,lib,types,utils,constants}`.
  - 백엔드는 **Supabase만** (Auth/PostgreSQL/Storage). 자체 서버·Neo4j·고급 추천 서버 ❌. AI Wiki 는 v0.2 Edge Function.
  - 그래프는 MVP에서 **가볍게**(Atlas 한 보기). 3D Globe ❌(future).
  - **순서: 문서(Phase1-4) → Expo 골격 → 더미 화면 → Supabase 실연결.**
  - MVP Thread 타입에 **`concept` 포함** (taxonomy 문서). `connections`→`thread_connections`, `perspectives`→future, `reactions` 제외 (erd 문서).
  - 웹은 나중에 (Expo Web 또는 Next.js).
- **기존 Next.js 코드 처리:** 임의 삭제·재배치 안 함. **사용자 확인 후** `legacy-web/` 로 이동 예정(보존). 문서/`supabase/`/`docs/`/루트 MD 는 스택 무관 → 유지.
- **검증 한계:** 이 개발 머신은 Windows — iOS 시뮬레이터 불가. Expo 앱 검증은 **Expo Go(아이폰 실기기)** 로 사용자가. 타입체크/번들은 가능.
- **재고할 시점:** RN 한계로 그래프/애니메이션이 막히면 일부 화면 웹뷰 또는 Skia 검토.

## 2026-06-01 · D-013 · v2 방향 전환 — Atlas 중심 / Fog / AI-seed / 새 내비

- **맥락:** 제품 방향을 재정의하는 종합 스펙 입력. 기존 일부 결정과 충돌.
- **결정 (정본: [docs/silmaril-v2-direction.md](docs/silmaril-v2-direction.md)):**
  1. **Atlas 가 제품의 감정적 중심.** 그래프는 Atlas 의 한 모드(보조). Atlas = Graph / Cultural Map / Globe(future).
  2. **Fog 시스템 신규** — 발견 주변에 `???` 미지영역(추천 아님, 미스터리). 탐험 > 추천.
  3. **AI-seed 우선** — AI Wiki 가 먼저 Threads/Connections/Graph 를 생성, 유저는 나중에 보정. (유저 생성 그래프 의존 ❌.) → **D-002 보완:** 유저의 `local` 생성은 여전히 막지 않되, 빈 그래프로 시작하지 않는다.
  4. **Save-and-explore first** — note-first 아님. 기록은 항상 선택.
  5. **내비 변경** — Home / Search / Explore(=Atlas) / Records / Profile. `Create` 탭 제거, `Map`→`Explore` 승격, `Search` 독립. **Collections 는 Records 안** (별도 탭 ❌).
  6. **MVP 재정의** — Must: Thread/Search/Save/Collections/Connections/**Atlas**/**Basic AI Wiki**. **Perspectives → Should-Have** (핵심에서 강등). Curator/Globe/NOU HAUS → future.
  7. **shadcn/ui 채택** — **D-007("Tailwind-only 시작") 갱신.** 단, 톤(조용한 탐험 도구)을 라이브러리 기본 모양에 끌려가지 않게 유지.
  8. **NOU HAUS** = 미래 자매 제품(Output형). MVP 미구현, 확장 포인트만.
  9. Thread 타입에서 `media` 제거 → 10종.
- **결과:** 기존 코드(인증·Create Thread)는 유지하되, 내비/Explore=Atlas/Records로의 재배치는 디자인(W2 와이어프레임) 확정 후 단계적으로. 이번 턴엔 문서·와이어프레임만.
- **재고할 시점:** AI Wiki 생성 비용/품질이 MVP에 안 맞으면 시드 범위 축소.

## 2026-06-01 · D-012 · 개발 일시정지 → UX Research Sprint → 원칙 확정

- **맥락:** 기능(인증·생성)은 붙었지만 UX가 미확정. 더 짜면 "위키+인스타+그래프"가 섞인 애매한 앱 위험. 디자이너 타겟인데 톤도 기본 폼.
- **결정:** 코드 멈추고 **Lazyweb 증거 기반 UX 리서치 스프린트 4개**(탐험/그래프/컬렉션/큐레이터)를 먼저 수행. 결과를 `docs/ux-research/` 5개 문서로, **패턴 10개 + 원칙 8개**로 수렴. 100개 수집이 아니라 패턴 추출.
- **핵심 결론:** 실마릴 = **"디자이너들의 지적 취향 지도"**, 출시 제품 중 **Are.na 에 가장 가까움**(Lazyweb 검색에서 are:na 반복 등장으로 실증). 그래프는 **로컬·보조·리스트 기반**(전역 그래프 안티패턴 — 문제 5). 평판은 **기여 가시성**(GitHub/Genius), 권력 아님. 저장 = 1급 동사(한 탭).
- **결과:** `docs/ux-research/silmaril-ux-conclusion.md` 의 **UX Principles v1** 이 이후 모든 디자인/개발의 상위 기준. 다음은 코드가 아니라 **모바일 와이어프레임 v1**.
- **재고할 시점:** 실제 사용자 테스트 데이터가 쌓이면 원칙 v2 로.

## 2026-06-01 · D-011 · Create Thread — 허브 유지 + slug 충돌 접미사 + 상세 실데이터 폴백

- **맥락:** 외부 Create Thread 스펙이 (a) `/create/page.tsx` 를 폼으로 교체, (b) `description` 컬럼·`@/types/database`·`supabase` 싱글톤·`AppShell` 가정, (c) slug 를 그대로 insert.
- **결정:**
  - 폼은 **`/create/thread`** 에 둔다. `/create` 는 M1 의 허브 유지 — 그 '실마리 생성' 카드가 이제 실제로 열린다(그전엔 죽은 링크). 다른 생성 항목(관점/기록/컬렉션/링크)도 보존.
  - 컬럼 매핑: 스펙의 `description` → 우리 스키마 **`body`**. 타입은 `@/types/domain`. 클라이언트는 `getSupabaseBrowser()`/`requireSupabaseBrowser()` 사용(싱글톤 아님). `AppShell` 미도입(루트 layout 이 셸 제공).
  - **slug 전역 UNIQUE 충돌 시 `-2`,`-3`… 접미사로 자동 회피** (생성 실패 안 시킴). 같은 대상 중복은 이후 큐레이터가 `merged` 로 정리 — D-005 와 일관.
  - 생성 후 `/threads/[slug]` 로 이동. 상세는 아직 더미만 읽으므로, **더미에 없으면 브라우저 클라이언트로 조회하는 `ThreadLiveView` 폴백**을 추가(본인 local 도 세션으로 보임). 관점/연결/기록 실데이터 통합은 N3.
  - 생성 가능한 status 는 **local | community 만**. verified/official 은 검증/관리 흐름 전용.
- **결과:** `npm run build` 11 라우트 통과, 라이브 스모크 전 라우트 200. 생성→상세 이동이 끊기지 않음.
- **운영 노트:** dev 에서 의존성/벤더청크 변경 후 `Cannot find module './vendor-chunks/*.js'` 500 이 나면 **`.next` 삭제 후 재시작**. (프로덕션 빌드는 영향 없음.)

## 2026-06-01 · D-010 · 인증은 클라이언트 측 + 프로필은 DB 트리거가 생성

- **맥락:** 외부에서 받은 Auth 스펙이 (a) `users` 에 `username`/`name`/`role:'user'` 를 클라이언트에서 insert, (b) `@/components/ui/*`·`AppShell` 가정, (c) `supabase` 싱글톤 import 였음. 그러나 우리 스키마는 `handle`/`display_name`, role enum 은 `member|partner|admin`(= 'user' 없음), 프로필은 `handle_new_user` 트리거가 이미 자동 생성.
- **결정:**
  - 프로필 행은 **DB 트리거가 단독 생성**. 클라이언트는 `users` 에 insert/ update 하지 않는다. (중복키·RLS 타이밍·enum 위반 회피) — `username`→`handle`, `name`→`display_name` 는 `signUp` 의 `options.data` 메타데이터로 넘기고, 트리거가 읽는다.
  - role 은 컬럼 기본값 `member`. (가입 시 role 을 클라이언트가 지정하지 않는다.)
  - 인증은 **클라이언트 세션(supabase-js, localStorage)** 으로 시작. 서버 컴포넌트 세션 읽기(`@supabase/ssr`)는 N1 과제로 남김.
  - `/create` 가드는 현재 **클라이언트 가드(`AuthGuard`)**. SSR 가드는 N1 이후.
  - 외부 스펙의 `AppShell` 은 도입하지 않음 — 루트 `layout.tsx` 가 이미 Nav+main 셸 제공. UI 프리미티브(`Button`/`Input`/`Card`)는 `src/components/ui/` 에 우리 ink 톤으로 생성.
- **결과:** 빌드/타입체크 통과. 가입 흐름이 트리거와 충돌하지 않음. role/handle 무결성 유지.
- **사람이 할 일(1회):** 이미 적용한 DB 의 트리거를 갱신본으로 교체(아래 HANDOFF 참조). 개발 편의를 위해 이메일 확인 OFF 권장.
- **재고할 시점:** 서버 렌더에서 로그인 상태가 필요해지면 즉시 N1(`@supabase/ssr`) 로 전환.

## 2026-06-01 · D-009 · 두 에이전트(Claude Code + Codex) 교대 작업

- **맥락:** 한 도구의 이용량이 소진되면 다른 도구로 작업을 이어가야 함. 두 도구가 서로의 진행 상태를 모름.
- **결정:**
  - 공유 프로토콜을 `CLAUDE.md` 에 두고, Codex 가 읽는 `AGENTS.md` 는 거기로 안내(+안전망 요약). **단일 진실, 중복 최소화.**
  - 교대 SSOT 는 `HANDOFF.md`(현재 상태) + `TASKS.md`(`## Now`) 두 개로 고정.
  - 교대는 **git** 으로. 세션 종료 시 커밋(+push), 시작 시 pull.
  - 각 세션은 `## Now` 의 **첫 미완료 항목 하나만** 처리.
- **결과:** 어느 도구로 시작하든 같은 파일을 읽고 같은 지점에서 이어받는다. 원격: github.com/auagna/Silmaril.
- **재고할 시점:** 에이전트가 3개 이상 되거나, 병렬(동시) 작업이 필요해지면 — 그 땐 작업 잠금/브랜치 전략 추가.

## 2026-06-01 · D-008 · Map 라이브러리는 React Flow

- **맥락:** 그래프 시각화 후보 — d3-force, cytoscape, vis-network, React Flow.
- **결정:** React Flow.
- **이유:** React 친화적 노드/엣지 모델, 커스텀 노드 컴포넌트, 줌/팬 기본 제공, Apple HIG 스타일에 맞추기 쉬움.
- **재고할 시점:** 노드 1만 개 이상 다룰 때 — 그 때는 force simulation을 백엔드에서 미리 계산하는 방향.

## 2026-06-01 · D-007 · Tailwind만으로 디자인 시스템 시작

- **맥락:** shadcn/ui, Radix, Headless UI 검토.
- **결정:** 초기 단계는 Tailwind + 직접 만든 작은 컴포넌트 세트만.
- **이유:** 톤이 "조용한 탐험 도구" — 라이브러리 기본 모양에 끌려가지 않기 위해. Radix는 필요한 컴포넌트(Dialog, Popover, Tabs)만 선택적 도입.

## 2026-06-01 · D-006 · 좋아요는 있지만 1등급 시그널이 아니다

- **맥락:** 인스타그램형 좋아요는 페이지 게이미피케이션을 유도함.
- **결정:** `reactions` 테이블은 두되, Home/Explore의 정렬 기준은 **저장 + 연결 + 컬렉션 포함 수**.
- **이유:** "좋아요보다 저장과 연결이 중요하다"는 철학.

## 2026-06-01 · D-005 · 중복 실마리는 새 페이지를 만들지 않고 `merged` 상태로 흡수

- **맥락:** 같은 인물에 대해 "디터 람스" / "Dieter Rams" / "디이터 람스" 같은 분기 발생 가능.
- **결정:** `threads.merged_into` FK 컬럼 + `status = 'merged'`. UI는 항상 흡수된 본체로 리다이렉트.
- **결과:** 사용자는 생성을 망설이지 않아도 됨 — 나중에 큐레이터가 병합.

## 2026-06-01 · D-004 · Thread 상태는 5단계 + `merged`

- **맥락:** local → community → verified → official + 중복 처리.
- **결정:** `thread_status` enum: `local`, `community`, `verified`, `official`, `merged`, `archived`.
- **결과:**
  - `local`: 작성자 본인만 볼 수 있지만 본인의 지도/기록/컬렉션에는 즉시 사용 가능.
  - `community`: 공개. 큐레이터 검토 큐에 진입.
  - `verified`: 다수 검토 통과.
  - `official`: 실마릴 팀 / 파트너 큐레이터가 공식화.
  - `merged`: 다른 실마리에 흡수됨.
  - `archived`: 더 이상 노출 안 함.

## 2026-06-01 · D-003 · Perspective는 Thread의 자식, Record와는 별도 테이블

- **맥락:** "관점"과 "개인 기록"의 차이가 모호해질 수 있음.
- **결정:**
  - `perspectives` = **실마리에 대한 큐레이션된 해석.** 다른 사용자에게 보여 줄 의도.
  - `records` = **개인 피드.** 본인 지도/타임라인이 기본 노출 범위, 공개는 옵션.
- **결과:** 두 테이블을 합치지 않는다. Record를 "관점으로 승격"하는 액션은 가능하게 둔다.

## 2026-06-01 · D-002 · `local` 상태도 즉시 사용 가능

- **맥락:** 공식화를 거쳐야만 본인 지도에 쓸 수 있게 하면 흐름이 끊김.
- **결정:** 작성자 본인 시점에서 `local` 실마리는 검색/연결/컬렉션/기록 첨부 모두 가능.
- **결과:** RLS는 "본인 또는 status >= community" 기준으로 작성.

## 2026-06-01 · D-001 · 스택은 Next.js + Supabase

- **맥락:** MVP 속도 + 인증 + 그래프 쿼리 + Vercel 배포 용이성.
- **결정:** Next.js App Router (서버 액션 활용), Supabase Postgres + Auth + RLS.
- **재고할 시점:** 그래프 쿼리가 무거워지면 별도 인덱싱(예: ArangoDB, Neo4j Aura, 또는 pgvector + 임베딩) 검토.
