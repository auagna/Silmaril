# CHANGELOG

> 교대(Claude Code ↔ Codex) 작업의 시간순 기록. 단일 기준점은 GitHub. 최신이 위.

## 2026-06-02

### Changes
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
