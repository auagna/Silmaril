# TASKS

> 교대 작업의 단일 진실 공급원. `## Now` 의 **체크 안 된 첫 항목 하나만** 진행한다.
> 완료된 항목은 `[x]`, 진행 중은 `[~]`, 대기 중은 `[ ]`.
> 규칙 전문은 [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) 참조.

---

## Now — 다음 작업 (위에서부터 하나씩)

> **전제 (사람이 1회 수행):** Supabase 프로젝트 `gqvjpfoxktueiclhpjlu` 의 SQL Editor 에서
> `supabase/schema.sql` → `supabase/policies.sql` 를 실행하고,
> `.env.local` 에 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 를 채운다.
> (이 전제가 안 돼 있어도 N1 은 진행 가능 — env 없으면 더미 폴백 유지.)

- [x] **N2(변형). 이메일/비밀번호 인증 (클라이언트 측).** 회원가입·로그인·로그아웃·현재 사용자·`/create` 가드 완료.
      프로필은 `handle_new_user` 트리거가 생성 (D-010).
- [x] **N5. Create Thread.** `/create/thread` 폼 + `threadService.createThread`(slug 충돌 접미사) + slug 유틸.
      생성 후 `/threads/[slug]` 이동, 상세는 `ThreadLiveView` 실데이터 폴백 (D-011).
### 🟣 현재 트랙: Expo RN MVP (D-014) — iPhone-first

> 정본: [silmaril-v2-direction.md](docs/silmaril-v2-direction.md) · [roadmap.md](docs/roadmap.md).
> 미지영역 사용자 용어 = **미발견** (`???`/`Fog`/`Locked` 금지, D-015). Atlas = 키워드 탭+스와이프.

- [x] **P1-4 문서** — roadmap · thread-taxonomy(concept 포함) · feature-matrix · erd · api-spec.
- [x] **문서 보강** — thread-taxonomy 타입별 5항(정의/예시/필수필드/연결가능타입/MVP이유) + **canonical-knowledge-model** + **seed-dataset-strategy**.
- [x] **EXP0. 기존 Next.js 웹 → `legacy-web/` 이동.** 루트는 Expo 차지.
- [x] **EXP1-3. Expo 골격 + Supabase client + 타입 + 더미 화면.**
      Expo Router 5탭(홈/검색/탐험/기록/프로필) + auth(login/signup) + thread/[id]. StyleSheet + `src/constants/theme.ts`.
      `src/lib/supabase.ts`(AsyncStorage), `src/types/database.ts`, `src/lib/dummy.ts`, `src/features/saves/store.ts`.
      검증: `npm install` + `tsc --noEmit` 통과 + `expo config` 정상 + EXPO_PUBLIC env 로드 확인.
- [x] **EXP-RUN. Expo Go(SDK 54) 실기기 구동 확인 완료 (2026-06-02).** QR 스캔 → 아이폰에서 앱 정상 동작. (연결 이슈는 동일망 재스캔으로 해결. Metro/번들 정상·4초 서빙 검증.)
      Codex 사전 검증(2026-06-02): `npm run typecheck`, `npx expo config --type public` 통과.
      이 PC에서 Expo API 조회가 `ECONNABORTED` 되면 네트워크 정상화 후 재시도. `--offline`은 localhost 전용이라 실기기 확인에 부적합.
- [x] **EXP-DB. MVP Supabase 스키마 작성.** `supabase/schema.sql` — 9테이블(users/threads/thread_connections/bookmarks/records/collections/collection_items/user_thread_activity/sources) + 4 enum(user_role[user/partner/admin]/thread_type[concept 포함]/thread_status/visibility_type) + 인덱스. RLS·AI Wiki·perspectives 제외. `docs/erd.md` 동기화.
- [ ] **EXP-DB-APPLY. (사용자) 스키마 적용.** Supabase SQL Editor 에서 `supabase/schema.sql` 실행. ⚠️ 옛 웹 스키마가 있으면 파일 상단 RESET 블록 먼저 (실데이터 없음 → reset 권장).
- [x] **연결 모델 + 타입 정렬.** `thread_connections.connection_tier`(1 사실/2 해석) 추가 · connection type 10종 · `src/types/database.ts` 를 스키마와 1:1 정렬(+dummy/컴포넌트). `canonical-knowledge-model` 확장. `tsc` 통과.
- [x] **IA v2 설계 문서** — `map-experience`(Sky/Sea/Land) · `information-architecture-v2`(4탭 Map/Archive/Create/My View) · `navigation-flow` (D-017).
- [x] **Atlas 설계 문서** — `atlas-system`(내부개념↔사용자용어) · `exploration-logic`(저장→미발견→새로운흔적→추천 규칙) · `seed-dataset-strategy` 확장(500–1000 threads / 3000–5000 connections / 5분야 + Official/AI/검수 기준).
- [x] **Step 11. Day/Night 테마 시스템** — `src/theme`(tokens Day/Night + Provider + `useTheme`, system 기본/`setMode`). 4탭+Map(Sky/Sea/Land)+ui+탭바+StatusBar 적용. 금/주황은 추천/선택/저장만. `tsc`+`expo export` 통과. (auth/thread[id]는 추후 — 정적 폴백.) — D-018
- [ ] **Step 12-23 (UI 빌드 백로그)** — Sky 아이콘 나침반 · Sea 키워드맵 정제 · Land 탭 시트(기본/관점/연결) · Keyword 데이터 모델 · 추천 이동 로직 · Archive/Create/My View 1차 · 전역상태 통합 · Supabase 스키마초안/연결준비. (한 번에 하나씩 진행.)
- [x] **Step 24-25. iPhone-first 반응형 + 안정화** — LandSheet 높이상한/탭바 침범 방지/스크롤, Sea 노드 터치영역. tsc+bundle 통과(TS/import 버그 없음).
- [x] **Step 26-27. i18n(ko/en) + 번역 레이어** — `src/i18n`(Locale/dict/`useLocale`) + `thread_translations`/`viewpoints` + 더미 ko/en + 화면 적용 + My View 언어토글. **Thread 유지(Keyword=Thread, D-019).** tsc+export 통과.
- [x] **PHASE 29. Node Type System v1** — ThreadType 확장(material/emotion/form/era + form/place/era) + `subtype` + 더미 타입 정교화(Concrete=material, Silence=emotion, +Church of the Light=work) + locale 타입라벨 + schema enum/subtype. tsc+export 통과.
- [ ] **PHASE 30-55 (대형 백로그)** — 노드 아이콘/관계선 문법 · 그래프 레이아웃 모드 · Flow · 타입필터 · 검색 · Source Adapter(Wikidata/Wikipedia/Namu) · ingestion · review queue · confidence · AI draft · Auth/RLS · mock→Supabase · Create 제출 · pan/zoom · web/tablet · seed · QA · privacy · deploy · feedback. **한 번에 하나씩.** (대부분 미구현 — RC 점검 참조.)
- [x] **PHASE 56. RC 점검** — `docs/release-candidate-v0.1.md`: 21항목 정직 점검(✅8/△3/❌10), 리스크, v0.1 노트, v0.2 로드맵. 결론: **더미 기반 탐험 프로토타입**(공개 플랫폼 아님).
- [x] **클라이언트 MVP 일괄** — PHASE 16(추천+방문)·35(검색)·34(타입필터)·30+31(아이콘/관계선 문법)·19(Create 폼 목업). 전역 explore store. tsc+export(1040) 통과.
- [x] **Track A** — service layer(keyword/archive/viewpoint, supabase-ready·더미 fallback) + `supabase/seed.sql`(20키워드 ko/en, PHASE51).
- [x] **Track B** — 그래프 레이아웃 모드 Web/Focus/Flow/Branch(PHASE32, `layout.ts`). (pan/zoom[49]은 gesture lib 필요 → 보류.)
- [x] **Track C(구조)** — Source 어댑터 인터페이스+Mock+NamuWiki(candidate_only)+confidence+ingestion(mock)+reviewStore+aiDraft(mock)+schema(source_documents/source_claims/review_candidates). (PHASE36/39/40/41/42/43/44 골격.)
- [x] **PHASE 52. 테스트/QA** — jest-expo + 순수로직 16테스트(confidence/translation/recommend/connections/undiscovered/layout) + `QA_CHECKLIST.md`. `npm test` 통과.
- [x] **PHASE 45. Auth** — `AuthContext`/`useAuth`(세션, guest fallback), AuthProvider, login/signup 테마화, My View 로그인/로그아웃. (users 테이블 존재 → 동작.)
- [x] **실데이터 적용 (사용자 1회).** Supabase에 `reset.sql` → `schema.sql` → `seed.sql` 적용 완료. supabase-js 확인: threads=20 / translations=40 / connections=23 / viewpoints=3. (seed enum 캐스트 버그 fix 후 성공.)
- [x] **PHASE 47. 화면 실데이터 hydrate.** `src/lib/dummy.ts` 배열을 `export let`(live binding)으로 + `hydrate()`/`useHydration()`(useSyncExternalStore). `src/features/data/bootstrap.ts`(`loadRealData`: supabase→hydrate, 실패/빈DB/미설정 시 더미 유지). `app/_layout.tsx`에 `DataBootstrap`. Map/Archive/Search 구독, Map에 `· live` 표시. tsc+16테스트+ios export 통과.
- [x] **PHASE 49 step1. Map 인터랙티브화 (D-020).** gesture-handler+reanimated(+worklets) 추가, babel worklets 플러그인, 루트 `GestureHandlerRootView`. `Sea.tsx` 재작성: 팬·핀치줌(0.5~3x)·노드 길게눌러 드래그(연결선 실시간 추종)·⊕⊖줌/⌖리센터·탭=선택. props 불변. tsc+16테스트+ios export(4.37MB) 통과. ⚠️ 사용자: Expo `-c` 재시작 필요.
- [x] **PHASE 49 step2. Map force 물리.** `useFrameCallback`(UI 스레드)로 척력+스프링+센터링 매 프레임 적분, 운동에너지<임계 또는 600프레임이면 자동 settle, 드래그 시 해당 노드 고정+재가열. 시드는 노드/모드/폭 변할 때만(선택 탭으로 리셋 안 됨). tsc+16테스트+ios export 통과.
- [x] **Map 시각 정리.** 저장됨(🔖) 아이콘 제거, 노드 = 분류 아이콘(흐리게 opacity 0.4)+키워드+연결선. 선택/추천만 또렷(주황/금).
- [x] **Map 보기 모드 고도화.** 4→3개(맥락/시간/계보, 집중 제거). 모드가 물리를 덮지 않고 한 축 고정(`buildModeLayout` 시드+핀): 시간=x 연도(`THREAD_YEAR`), 계보=y 세대(`computeDepths`), 맥락=자유.
- [x] **Roadmap V2 채택 + 현황 체크 (D-022).** `roadmap.md` V2 단계표 — **실위치 = PHASE 13(MVP Build)**. taxonomy v2 3계층(`thread-taxonomy.md`).
- [x] **Storage Model (D-021).** `docs/storage-model.md`(Markdown-first: 파일=원본/DB=색인/파일명 사용자 기준/frontmatter 규칙/단계 v0.1~v1.0) + v0.1 구현체 `src/features/vault/markdown.ts` + 테스트 5(라운드트립/파일명). jest 21/21.
- [ ] **IA v2.1 구현.** Create 탭 제거 → 3탭(Map/Archive/My View), 관점 작성 = Land 시트 **Quick Perspective**(작성 시 Markdown export 구조 준수). ← 다음 구현
- [ ] **문서 갭 보강.** world-model.md + design-system.md · discovery-system.md(관점 충돌/랜덤 항해/Compass) · canonical-knowledge-model V2 정합(part_of/contemporary_of).
- [ ] **남은 단계 = 환경/결정/법무 필요:**
      · **사용자/환경:** 46 RLS · 48 Create 실제 제출(reviewStore→DB) · 기기 검증.
      · **법무:** 37/38 Wikidata/Wikipedia 실어댑터 · 39 나무위키 활성화 — ToS/저작권 검토 후.
      · **대형 인프라:** 33 Flow 시간축 정밀 · 49 pan/zoom · 50 web/tablet · 52 테스트 · 53 privacy · 54 배포 · 55 feedback.
- [x] **Step 28. Supabase 다국어 테이블** — schema.sql 에 `thread_translations`(unique thread_id,locale) · `viewpoints`(locale) · `thread_connection_translations`(선택) · `users.preferred_locale` + enum(locale_type/viewpoint_author) + 인덱스. erd 동기화. (RLS 제외.)
- [x] **EXP-IA2. 4탭 재구성 (구현 완료).** `app/(tabs)` = 지도(Map)/보관(Archive)/만들기(Create)/나(My View). Map=Sky(나침반)+Sea(별자리 노드·연결·미발견, 경량 RN)+Land(바텀시트 상세, 의존성 0). 옛 5탭 삭제. `tsc` + `expo export`(1033 모듈) 통과. 더미 데이터.
- [ ] **EXP4. Supabase 실연결** — service 함수(api-spec) 구현 → 더미 store/dummy 대체 + seed 적재. RLS(`policies.sql` 신규)도 이 단계. (타입 정렬은 완료.)

> 이전 웹 트랙(W2/D1 등)은 D-014로 보류. UX 원칙/와이어프레임(v1·v2)은 RN 디자인의 참고 자산으로 유지.
      Lazyweb 네이티브 도구는 재시작+서버 승인 후 `mcp__lazyweb__*` 로 사용. (참고: [[lazyweb-ui-reference]])

### ⚪ 개발 트랙 (디자인 확정까지 대기) — v2 MVP 우선순위 (D-013)

> **Must:** Thread Pages · Search · Save · Collections · Connections · **Atlas** · **Basic AI Wiki**
> **Should:** Notes · **Perspectives** · User Profiles  ·  **Won't(MVP):** Curator Economy · Globe · NOU HAUS · Advanced AI
> 기존 완료(인증·Create Thread)는 유지. 내비/Explore=Atlas/Records 재배치는 W2 확정 후.

- [ ] **Atlas v0** — Explore 탭에 어두운 캔버스 + 저장 노드 + Fog(`???`) (Graph 모드부터).
- [ ] **Basic AI Wiki** — 실마리 시드 생성 파이프라인 (origin='ai').
- [ ] **Search 탭** — 타입별 실마리 검색.
- [ ] **Records 탭** — Saved / Notes / Collections / Reviews 통합.
- [ ] **N6. Perspective 작성.** (Should-Have로 강등 — 페이지 하나·관점 레이어, Genius 모델)
      Thread 상세에 관점 목록 + 작성 폼(`PerspectiveCreateForm`). `thread_id`/작성자 연결, `visibility='public'` 로 생성.
      *(실마릴 핵심 차별점: 페이지는 하나, 관점은 여러 개.)*
- [ ] **N3. Thread 상세(`/threads/[id]`)를 Supabase 실데이터로 통합.**
      현재 더미 우선 + 미스 시 `ThreadLiveView` 폴백. 관점/연결/기록을 실데이터로 묶어 통합.
- [ ] **N4. Explore 를 Supabase 실데이터로 읽기.**
      검색은 `title` / `aliases` 에 대한 `ilike`. 타입 탭 유지.
- [ ] **N1(이월). `@supabase/ssr` 도입 + 서버 세션 읽기.**
      현재 인증은 클라이언트 세션(localStorage). 서버 컴포넌트/가드에서 세션이 필요해지면 이 과제로 전환.
      `src/lib/supabase.ts` 유지, SSR 헬퍼는 같은 `src/lib/` 안에서 확장.

## Next — 그 다음 (Now 가 비면 여기서 하나 올린다)

- [ ] 저장(bookmark) / 좋아요(reaction) 토글 — 서버 액션 + `user_thread_activity` 기록.
- [x] 실마리 생성 폼 → `status='local'`/`community` 즉시 저장 (D-002, D-011).
- [ ] 관점(Perspective) 작성 폼 — 특정 Thread 에 첨부. ← 다음
- [ ] 개인 기록(Record) 작성 폼 — Thread 첨부는 선택.
- [ ] 컬렉션 생성 + 항목 추가/정렬.
- [ ] 관리자/파트너용 공식화 상태 변경 (`community → verified → official`, `merged`).

## Later

M3/M4/M5 백로그는 아래 "마일스톤 백로그" 참조.

---

## 마일스톤 백로그

### M0 — 기반 (Foundation) ✅

- [x] 프로젝트 루트 파일 구조 결정
- [x] 도메인 모델 / 정보 구조 문서화
- [x] Supabase 스키마 / RLS 정책 초안
- [x] TypeScript 도메인 타입 정의
- [x] Next.js App Router 스켈레톤
- [x] Tailwind 설정
- [x] Supabase 클라이언트 분리 (`src/lib/supabase.ts`)
- [x] 더미 데이터 시드 (`src/lib/dummy.ts`)
- [x] 교대 프로토콜 문서 (`CLAUDE.md`, `AGENTS.md`)

### M1 — 더미 기반 UI ✅

- [x] Home — 오늘의 실마리 / 이어서 탐험 / 추천 / 큐레이터 활동
- [x] Explore — 검색 + 타입 탭 + 결과 그리드
- [x] Create — 실마리 / 관점 / 기록 / 컬렉션 / 링크
- [x] Map — 그래프 뷰 + 필터 칩
- [x] Profile — 사용자 정보 + 카운트 + 파트너 배지
- [x] Thread 상세 — 관점 탭 / 연결 / 기록 / 컬렉션 / 출처
- [x] 공용 컴포넌트 — ThreadCard, PerspectiveCard, FilterChip, EmptyState

### M2 — Supabase 실제 연결 (진행 중 — `## Now` 가 이 마일스톤)

- [ ] Supabase 프로젝트 생성 + 스키마 적용  *(프로젝트는 생성됨: gqvjpfoxktueiclhpjlu)*
- [x] Auth (이메일/비밀번호, 클라이언트 측) — 회원가입/로그인/로그아웃/현재 사용자/Create 가드
- [ ] `threads` CRUD 서버 액션
- [ ] `perspectives` CRUD 서버 액션
- [ ] `records` CRUD 서버 액션
- [ ] `connections` 생성 / 그래프 조회
- [ ] `collections` + `collection_items`
- [ ] `bookmarks` / `reactions` 토글
- [ ] `user_thread_activity` 집계

### M3 — 큐레이션 / 검증 흐름

- [ ] Thread 상태 머신: `local` → `community` → `verified` → `official`
- [ ] 중복 실마리 병합(`merged`) UX
- [ ] 파트너 큐레이터 배지 노출
- [ ] 신뢰 점수 / 검토 이력 표시

### M4 — 지도 (Map) 고도화

- [ ] React Flow 기반 실제 그래프 (실데이터 바인딩)
- [ ] 좋아요 / 저장 / 기록 / 컬렉션 필터
- [ ] 노드 클러스터링
- [ ] 노드 더블클릭 → Thread 상세
- [ ] 지도 공유 링크

### M5 — 탐험 경험

- [ ] "이어서 탐험" 추천 로직
- [ ] 출처(`sources`) 자동 임베드
- [ ] 검색 — 풀텍스트 / 별칭 / 임베딩
- [ ] 알림 — 내가 저장한 실마리에 새 관점이 붙었을 때

### Tech debt / 운영

- [ ] e2e 시드 데이터 스크립트
- [ ] Vercel 배포 + 환경변수 설정
- [ ] 에러 / 빈 상태 UI 컴포넌트화
- [ ] 다크 모드 토큰화
