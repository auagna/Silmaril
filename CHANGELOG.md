# CHANGELOG

> 교대(Claude Code ↔ Codex) 작업의 시간순 기록. 단일 기준점은 GitHub. 최신이 위.

## 2026-06-04

### Changes
- fix(Map 물리): 연결선이 안 보이던 문제 = 인력<척력 + 경계 없음으로 노드가 캔버스 밖으로 퍼져 선이 잘림. 해결: 경계 클램프(PAD=30, 화면 안 유지) + 척력↓(6500)/센터링↑(0.022). **관련성(connection_tier) 기준 인력 고도화** — tier1(사실) ideal 88·k 0.085(가깝고 강하게), tier2(해석) ideal 150·k 0.04(멀고 약하게). 연결선 시각도 tier별(tier1 또렷·1.5px, tier2 옅게·1px). 하이드레이션 일시 불일치 가드 추가. tsc+jest16+ios export 통과.
- feat(PHASE 49 step2, D-020): Map force 물리. `useFrameCallback`(UI 스레드)로 척력+스프링+센터링 매 프레임 적분, 운동에너지<임계/600프레임이면 자동 settle, 노드 드래그 시 고정+재가열(이웃 출렁). 시드는 노드/모드/폭 변경 시에만(탭 리셋 없음). 물리 상수 Sea.tsx 상단 모음. tsc+jest16+ios export 통과.
- change(Map 시각): 저장됨(🔖) 아이콘 제거. 노드 = 분류 아이콘(흐리게 opacity 0.4)+키워드+연결선. 선택(주황)/추천(금)만 또렷. ★ 추천 글리프 대신 분류 아이콘 금색.
- feat(PHASE 49 step1, D-020): Map 인터랙티브화. gesture-handler+reanimated(+worklets) 추가, babel worklets 플러그인, 루트 GestureHandlerRootView. `Sea.tsx` 재작성 — 팬·핀치줌(0.5~3x, 중심기준)·노드 길게눌러 드래그(연결선 실시간 추종)·⊕⊖줌/⌖리센터·탭=선택. 위치는 단일 useSharedValue 맵으로 노드+엣지 공유. props 불변(호출부 무변경). tsc+jest16+ios export(4.37MB) 통과. ⚠️ 사용자 Expo `-c` 재시작 필요. 다음=step2 force 물리.
- feat(PHASE 47): 화면 실데이터 hydrate. Supabase에 `reset/schema/seed.sql` 적용 완료(threads=20/translations=40/connections=23/viewpoints=3). `src/lib/dummy.ts` 배열을 live binding(`export let`)으로 + `hydrate()`/`useHydration()`(useSyncExternalStore). 새 `src/features/data/bootstrap.ts`(`loadRealData`: 시작 시 supabase→hydrate, 실패/빈DB/미설정 시 더미 유지). `app/_layout.tsx`에 `DataBootstrap`. Map/Archive/Search 구독, Map 부제에 `· live`. tsc clean + jest 16/16 + ios export 통과.
- fix(seed): `thread_translations`/`viewpoints` insert 의 enum 캐스트 — `v.locale::locale_type`, `'curator'::viewpoint_author` (ERROR 42804 해소).

## 2026-06-02

### Changes
- test(PHASE 52): jest-expo 셋업 + 순수 로직 단위 테스트 16개(4 suites: confidence/translation fallback/recommendNext/connectionsOf/undiscovered/computeLayout) + `QA_CHECKLIST.md`. `npm test` 통과, jest는 legacy-web 제외.
- feat(PHASE 45): Supabase Auth — `AuthContext`/`useAuth`(세션 구독, guest fallback), `_layout` AuthProvider, login/signup 화면 테마화, My View 로그인/로그아웃 상태. tsc+export(1042) 통과. (비로그인도 탐험 가능.)
- feat(A/B/C): **A** supabase-ready service layer + seed.sql(20키워드 ko/en). **B** 그래프 레이아웃 모드 Web/Focus/Flow/Branch(PHASE32). **C** Source/Review/AI 구조(어댑터 인터페이스+Mock+NamuWiki placeholder+confidence+ingestion+reviewStore+aiDraft, **전부 mock/placeholder — 실수집·크롤링·API·자동활성 없음**)+schema(source_documents/source_claims/review_candidates). 각 tsc+export(1041) 통과.
- feat(client MVP 일괄): PHASE 16(추천+방문)·35(검색 모달)·34(타입 필터)·30+31(노드 아이콘/관계선 문법)·19(Create 폼 목업). 전역 explore store(selected+visited). 각 tsc+export 통과(1040). **여기까지 = 더미 기반 클라이언트 MVP 기능완성.** 이후(Supabase 실연결·Auth·Source/AI·web·배포)는 환경/법무/결정 필요.
- docs(PHASE 56): RC 점검 `docs/release-candidate-v0.1.md` — 21항목 정직 점검(✅8/△3/❌10), 리스크, v0.1 노트, v0.2 로드맵. 결론=더미 탐험 프로토타입.
- feat(PHASE 29): Node Type System v1 — ThreadType 확장(material/emotion/form/era 등) + `subtype` + schema enum/컬럼 + locale 타입라벨. 더미 타입 정교화(Concrete=material, Silence=emotion, +Church of the Light). tsc+export(1036) 통과.
- feat(Step 28): Supabase 다국어 스키마 — `thread_translations`(unique thread_id,locale)·`viewpoints`(locale)·`thread_connection_translations`(선택)·`users.preferred_locale` + enum(locale_type/viewpoint_author). erd 동기화. (RLS 제외.)
- feat(Step 26-27): 다국어(ko/en) — `src/i18n`(Locale/translations/`useLocale`, 기기언어 기본·ko fallback) + `thread_translations`/`viewpoints` 타입 + 더미 ko/en 병렬. Map/Sea/Land/Archive/Create/My View + 노드/카드 locale 반영, My View 언어 토글. Thread 모델 유지(Keyword=Thread, D-019). tsc+export(1036) 통과.
- fix(Step 24-25): iPhone-first 반응형/안정화 — LandSheet 높이 상한(0.72H, SE 대응)·탭바 침범 방지(insets 중복 제거)·연결 스크롤, Sea 노드 hitSlop(터치영역). tsc+expo export(1035) 통과(런타임 TS/import 버그 없음).
- feat(Step 11): Day/Night 전역 테마 — `src/theme`(tokens + Provider + `useTheme`, system 기본/setMode). 4탭·Map(Sky/Sea/Land)·ui·탭바·StatusBar 적용. 금/주황은 추천·선택·저장만. tsc+expo export(1035) 통과. (D-018)
- docs: `feature-matrix` 를 Map 중심 4탭(Map/Archive/Create/My View)으로 재정렬. (canonical-knowledge-model·erd·schema·4탭 스켈레톤은 기존 충족 — 재작업 없음.)
- docs: Atlas 설계 — `atlas-system`(내부개념↔사용자용어) · `exploration-logic`(탐험 규칙) · `seed-dataset-strategy` 확장(500–1000 threads/3000–5000 connections, 5분야, Official/AI/검수 기준).
- feat(EXP-IA2): 앱을 IA v2 Map 중심 4탭으로 재구성 — 지도(Sky/Sea/Land)/보관/만들기/나. 옛 5탭 삭제. 경량 별자리 Sea + 의존성 0 Land 바텀시트. tsc + expo export(1033 모듈) 통과. (D-017)
- chore(EXP-RUN): 아이폰 Expo Go(SDK 54) 실기기 구동 확인 완료 (QR 스캔 정상). 연결 이슈는 동일망 재스캔으로 해결.
- docs: IA v2 (Map 중심) 설계 — `map-experience`(Sky/Sea/Land) · `information-architecture-v2`(4탭) · `navigation-flow`. (D-017)
- fix: `babel-preset-expo` 의존성 추가 (SDK 54 Metro resolve 에러). `expo export` 번들 검증.
- chore: Expo SDK 51 → **54** 업그레이드 (react 19.1 / RN 0.81.5 / expo-router 6 / ts 5.9). `.npmrc` legacy-peer-deps. Expo Go(SDK54) 호환. tsc·expo config 통과. (D-016)
- feat: 연결 모델 강화 — `thread_connections.connection_tier`(1 사실/2 해석) + connection type 10종. `canonical-knowledge-model` 확장(그래프=핵심 자산). `src/types/database.ts` 를 스키마와 1:1 정렬(+dummy/컴포넌트), `tsc` 통과.
- docs: thread-taxonomy 타입별 5항 보강 + 신규 `docs/canonical-knowledge-model.md`·`docs/seed-dataset-strategy.md` (개념 허브, AI-seed 시드 전략).
- chore: `bookmarks`·`user_thread_activity` 에 `id` PK 추가(+unique 유지). CHANGELOG 정비, 운영 규칙(브랜치/리포트 형식/CHANGELOG)을 CLAUDE/AGENTS 에 반영.
- feat(EXP-DB): MVP Supabase 스키마 `supabase/schema.sql` — 9테이블 + 4 enum + 인덱스 + 트리거(handle_new_user/set_updated_at). RLS·AI Wiki·perspectives 제외. `docs/erd.md` 동기화.

### Verification
- Expo RN MVP scaffold: `npm run typecheck` passed.
- Expo public config: `npx expo config --type public` passed.
- Expo Go physical-device smoke test remains pending. LAN Metro startup was blocked while fetching Expo SDK metadata with `write ECONNABORTED`.

## 2026-06-01

- feat(EXP1-3): Expo RN 스캐폴드 — Expo Router 5탭 + auth + thread/[id], Supabase client(AsyncStorage), 타입, theme, 더미 화면. (`9ada9aa`)
- chore(EXP0): Next.js 웹 MVP → `legacy-web/` 아카이브, 루트는 Expo. (`0bbd089`)
- docs(mvp): Expo RN MVP 기획 문서 + 스택 전환 D-014 (roadmap/taxonomy/feature-matrix/erd/api-spec). (`76e6473`)
- docs(v2): Atlas 중심 방향 전환 + 와이어프레임 v2, Fog→"미발견" (D-013/D-015). (`cf64486`)
- docs(ux): UX Research Sprint + UX Principles v1. (`201887d`)
- docs(wireframe): W1 모바일 와이어프레임 v1. (`325e3a2`)
- feat(threads/auth): Create Thread + 클라이언트 인증 (웹, D-010/D-011). (`725b3e5`, `bac5758`)
- chore: 교대 프로토콜 + MVP 스캐폴드. (`e1acf80`, `79dfc62`)
