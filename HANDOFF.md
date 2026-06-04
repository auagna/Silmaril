# HANDOFF

> 다음 세션 (또는 다음 에이전트) 을 위한 인계 문서. 항상 최신 상태로 유지.
> **교대 규칙은 [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) 에 있다. 시작 전 반드시 읽는다.**

## 교대 (Claude Code ↔ Codex)

- 이어받는 기준: **이 문서(현재 상태) + `TASKS.md` 의 `## Now`**.
- 시작 시 git pull, 종료 시 커밋(+push). 원격: https://github.com/auagna/Silmaril
- 한 세션 = `## Now` 의 첫 미완료 항목 하나.

## 현재 상태 (2026-06-04)

**🟢 이번 세션 (2026-06-04, 이어서) — Map 인터랙티브화 step1 (PHASE 49 / D-020).**
- 사용자 요청: "맵이 옵시디언처럼 유동성 + 확대축소". 레퍼런스 조사(Lazyweb: SkyView 별자리·c82 그래프 줌컨트롤 / web: gesture-handler+reanimated). 사용자 선택 = **단계적**.
- 추가: `react-native-gesture-handler ~2.28`, `react-native-reanimated ~4.1`, `react-native-worklets ~0.5`(reanimated4 peer). `babel.config.js` plugins=`['react-native-worklets/plugin']`(마지막). `app/_layout.tsx` 루트 `GestureHandlerRootView` 래핑.
- **`src/features/map/Sea.tsx` 재작성:** 다크 캔버스 + 한손가락 팬 / 두손가락 핀치 줌(0.5~3x, 중심 기준) + 노드 **길게눌러(180ms) 드래그**(연결선 실시간 추종) + 우하단 ⊕⊖ 줌·⌖ 리센터 + 탭=선택. 위치는 단일 `useSharedValue<Record<id,Pos>>` 맵(노드+엣지 공유 구독). `MapNode`/`MapEdge` 내부 컴포넌트. **props 인터페이스 불변** → `app/(tabs)/index.tsx` 등 호출부 무변경.
- 검증: `tsc` clean · jest 16/16 · `expo export ios` 성공(번들 3.13→4.37MB).
- ⚠️ **사용자 액션:** babel 변경 + 네이티브 의존성이라 **Expo 를 `npx expo start -c`(캐시 클리어)로 재시작**해야 반영됨. (env: `set REACT_NATIVE_PACKAGER_HOSTNAME=172.20.10.2` + `set EXPO_NO_DEPENDENCY_VALIDATION=1` 후 `-c`.)
- **다음 = PHASE 49 step2:** force 물리(척력+스프링) 시뮬레이션으로 떠다니는 유동성. settle 후 정지·드래그 시 재가열·모바일 성능 튜닝.

---

**🟢 이번 세션 (2026-06-04) — 실데이터 연결 완료 (PHASE 47).**
- 사용자가 Supabase에 `reset.sql` → `schema.sql` → `seed.sql` 적용 완료. supabase-js 확인: **threads=20 / translations=40 / connections=23 / viewpoints=3.** (seed enum 캐스트 버그 `v.locale::locale_type` / `'curator'::viewpoint_author` fix 후 성공.)
- **PHASE 47 = 화면 실데이터 hydrate (최소 침습).** `src/lib/dummy.ts` 의 `threads/threadTranslations/connections/viewpoints` 를 `export let`(live binding)으로 바꾸고 `hydrate()` + `useHydration()`(useSyncExternalStore) 추가. 새 `src/features/data/bootstrap.ts` 의 `loadRealData()` 가 앱 시작 시 Supabase에서 읽어 `hydrate({…, source:"supabase"})`. **실패/빈DB/미설정 시 더미 유지**(앱 안 깨짐). `app/_layout.tsx` 에 `<DataBootstrap/>`. Map/Archive/Search 가 `useHydration()` 구독 → 로드 후 재렌더. Map 부제에 데이터가 실DB면 `· live` 표시.
- 검증: `tsc --noEmit` clean · `jest` 16/16 · `expo export --platform ios` 번들 성공.
- **다음 후보:** 46 RLS(`policies.sql` 신규, 현재 RLS off) → 48 Create 실제 제출(reviewStore→DB) → 기기에서 `· live` 육안 확인. (법무 게이트: 37/38/39 외부 소스 어댑터.)

---

**현 트랙: Expo RN MVP (D-014, iPhone-first).** 웹은 `legacy-web/` 로 보존.
**완료:** 문서 세트(roadmap/taxonomy/feature-matrix/erd/api-spec) · Expo 골격(5탭+auth+thread/[id], 더미) · **MVP Supabase 스키마(`supabase/schema.sql`)**.
**✅ 실기기 구동 확인 (2026-06-02):** 아이폰 Expo Go(SDK 54)에서 정상 동작.
**✅ EXP-IA2 완료 (2026-06-02):** 앱이 **IA v2 4탭(지도/보관/만들기/나)** 로 재구성됨. Map=Sky/Sea/Land. 옛 5탭 삭제. `tsc`+`expo export`(1033 모듈) 통과.
**다음:** 사용자 Expo Go 재확인(Reload) → **EXP4(Supabase 실연결)** (스키마 SQL Editor 적용 1회 + service 구현 + 더미 대체).

**설계 문서 추가 (2026-06-02):** `atlas-system`(내부개념↔사용자용어) · `exploration-logic`(저장→미발견→새 흔적→추천 규칙, 안도 워크스루) · `seed-dataset-strategy` 확장(목표 500–1000 threads / 3000–5000 connections / 건축·산업디자인·그래픽·사진·예술 + Official/AI생성/운영진검수 기준). 이 규칙들은 EXP4 의 `getUndiscoveredThreads`/`getUserExploreMap` + 출시 전 시드 파이프라인의 근거.
**feature-matrix Map 중심 재정렬 (2026-06-02):** Must를 4탭(Map[Sky/Sea/Land]/Archive/Create/My View)별로 재배치. (canonical-knowledge-model·erd·schema·4탭 스켈레톤은 기존 상태가 이미 충족 → 재작업 안 함.)

**✅ Step 11 Day/Night 테마 (D-018):** `src/theme`(tokens Day/Night + Provider + `useTheme`, system 기본). 4탭+Map(Sky/Sea/Land)+ui+탭바+StatusBar 가 테마 적용. 금/주황은 추천·선택·저장만. `tsc`+`expo export`(1035) 통과.
- **사용법:** 컴포넌트에서 `const c = useTheme().colors; const s = useMemo(()=>makeStyles(c),[c]);`. 설정화면은 `useTheme().setMode('light'|'dark'|'system')` 만 연결하면 됨.
- **남은 부채:** `app/auth/*`, `app/thread/[id]` 는 아직 정적 `src/constants/theme.ts` 의 `colors` 사용(Day 근사). 추후 테마 전환.
- **다음 백로그(12~23):** Sky 아이콘 나침반 → Sea 키워드맵 정제 → Land 탭 시트 → Keyword 모델 → 추천 이동 → Archive/Create/My View 1차 → 전역상태 통합 → Supabase 초안/연결. **한 번에 하나씩.**

**✅ Step 24-25 (iPhone 반응형/안정화):** LandSheet 높이상한(SE 대응)·탭바 침범 방지·스크롤, Sea 노드 hitSlop. tsc+bundle 통과.
**✅ Step 26-27 다국어(D-019):** 결정 = **Thread 유지 + i18n 레이어**(Keyword=Thread). `src/i18n`(Locale/dict/`useLocale`, 기기언어→ko fallback, setLocale) + `thread_translations`/`viewpoints` 타입 + 더미 ko/en 병렬. 화면 전반 + 노드/카드 locale, My View 언어토글(한국어/English). tsc+export(1036) 통과. 영어 없어도 fallback.
- 사용법: `const { t, locale, setLocale } = useLocale();` · 콘텐츠는 `getThreadTranslation(id, locale)`.
- **✅ Step 28:** schema.sql 에 `thread_translations`·`viewpoints`·`thread_connection_translations`(선택)·`users.preferred_locale` + enum(locale_type/viewpoint_author) + 인덱스. erd 동기화. RLS 제외(추후).
- **✅ PHASE 52 테스트 (2026-06-02):** jest-expo + 순수 로직 16테스트(`npm test` 통과, legacy-web 제외) + `QA_CHECKLIST.md`. jest 29.7/jest-expo 54.
- **✅ PHASE 45 Auth (2026-06-02):** `useAuth`/AuthProvider(세션·guest fallback) + login/signup 테마화 + My View 로그인/로그아웃. 비로그인도 탐험 가능.
- **✅ 실데이터 블로커 해소 (2026-06-04):** `reset.sql`→`schema.sql`→`seed.sql` 적용 완료(20/40/23/3). **PHASE 47 hydrate 로 화면이 실DB 표시**(미설정/실패 시 더미 fallback 유지). 상단 "이번 세션" 참조.
- **✅ A/B/C (2026-06-02):** **A** service layer(supabase-ready·더미 fallback)+`seed.sql`(20키워드). **B** 그래프 레이아웃 모드(Web/Focus/Flow/Branch, `layout.ts`). **C** Source/Review/AI **구조(mock/placeholder)** — `src/features/sources/*` + `ingestionService`/`aiDraftService` + schema(source_documents/source_claims/review_candidates). 전부 tsc+export(1041) 통과. ⚠️ C는 실수집·크롤링·API·자동활성 **없음**(법무 게이트). 화면은 아직 더미 직접 사용(service 교체=PHASE47/EXP4).
- **✅ 클라이언트 MVP 기능완성 (2026-06-02):** PHASE 16 추천+방문 · 35 검색(모달) · 34 타입필터 · 30+31 노드 아이콘/관계선 문법 · 19 Create 폼(목). 전역 `useExplore`(selected+visited). 전부 tsc+export(1040) 통과. → **더미 기반으로는 탐험/검색/추천/생성-입력까지 동작.**
- **⛔ 자율 진행 경계:** 남은 PHASE 는 (a) **백엔드/환경**: Supabase 실연결(47)·Auth(45)·RLS(46)·Create 실제 제출(48) → 사용자가 스키마 적용+키+기기 검증 필요. (b) **법무**: Source Adapter/ingestion/AI(36~44, 특히 나무위키) → ToS/저작권 검토 전 활성화 금지. (c) **대형 인프라**: 그래프 레이아웃/Flow(32/33)·pan·zoom(49)·web/tablet(50)·테스트(52)·배포(54). 각각 별도 진행.
- **✅ PHASE 56 RC 점검:** `docs/release-candidate-v0.1.md`. **정직한 결론: 현재는 더미 데이터 기반 탐험 프로토타입**(공개 지식 플랫폼 아님). 21항목 ✅8/△3/❌10 — Map/테마/i18n/노드타입/저장은 동작, **검색·실데이터(Supabase)·소스/리뷰·그래프 고도화·Auth연결·Create폼·피드백·web은 미구현.** Top 리스크: ①외부소스 법무 ②전부 더미→실연결 시 일괄 노출 ③Sea 고정 레이아웃 확장성. 권장 다음: 검색(35) → 추천(16) → Supabase 실연결+seed(47/51).
- **✅ PHASE 29 Node Type System v1:** ThreadType 확장(person/movement/work/material/concept/emotion + form/place/era + organization) + `threads.subtype`. 더미 타입 정교화. `threadTypeLabel(type, locale)` 로 라벨. schema enum/subtype 반영. tsc+export 통과.
- **다음 = PHASE 30~55 (대형 백로그, 한 번에 하나씩):** 30 노드 아이콘/라벨 문법 → 31 관계선 → 32 레이아웃 모드 → 33 Flow → 34 타입필터 → 35 검색 → 36~40 Source Adapter/출처 → 41~44 ingestion/review/confidence/AI draft → 45~48 Auth/RLS/실데이터/Create제출 → 49 pan/zoom → 50 web/tablet → 51 seed → 52 QA → 53 privacy → 54 deploy → 55 feedback. (26·27·28 완료.)

> **SDK 54 업그레이드 완료 (D-016):** Expo Go(앱스토어=SDK54)와 맞춤. react 19.1 / RN 0.81.5 / expo-router 6 / ts 5.9. `.npmrc`(legacy-peer-deps) 추가. **`babel-preset-expo` 의존성 추가**(Metro resolve 에러 수정). 검증: `expo export --platform ios` 1032 모듈 번들 성공. 첫 실행은 `npx expo start -c`.

> **IA v2 설계 확정 (D-017, 문서만):** Map 중심 **4탭(Map/Archive/Create/My View)** + 3레이어 Map(Sky/Sea/Land), Thread Detail=bottom sheet. 문서: `docs/map-experience.md`·`information-architecture-v2.md`·`navigation-flow.md`. ⚠️ **현 Expo 코드는 아직 5탭** — 다음 구현 태스크 **EXP-IA2** 에서 4탭 재구성.

### 이번에 추가된 것 (EXP-DB · MVP Supabase 스키마)
- `supabase/schema.sql` 새로 작성 (옛 웹 스키마 대체): 9테이블 + 4 enum(`user_role` user/partner/admin, `thread_type` person/work/movement/place/**concept**/organization, `thread_status`, `visibility_type`) + 인덱스 + `handle_new_user`/`set_updated_at` 트리거.
- thread_connections / role=`user` / threads(`description`,`cover_image_url`,`trust_score`,`completion_score`,`merged_into_thread_id`) / user_thread_activity(viewed/saved/recorded/added_to_collection bool) — 미발견 파생 지원.
- **RLS·AI Wiki·perspectives·taste_profiles·reports·curator_badges·NOU HAUS 제외**(추후). `docs/erd.md` 동기화.
- `bookmarks`·`user_thread_activity` 는 `id` PK + `unique(user_id, thread_id)`.
- 운영: `CHANGELOG.md` 신설, CLAUDE/AGENTS 에 보고 형식·브랜치·CHANGELOG 규칙 반영. `.codex/`·`.claude/` gitignore.
- 문서 보강: `thread-taxonomy.md`(타입별 5항) + 신규 `docs/canonical-knowledge-model.md` · `docs/seed-dataset-strategy.md`. (개념 허브·AI-seed 전략.)
- ⚠️ **적용 시(사용자):** 옛 웹 스키마가 DB에 있으면 schema.sql 상단 RESET 블록 먼저 실행 후 적용.
- ✅ **타입 정합성 해소:** `src/types/database.ts` 를 스키마와 1:1 정렬 완료(+dummy/컴포넌트, `tsc` 통과). `thread_connections.connection_tier`(1 사실/2 해석) 추가, connection type 10종, `canonical-knowledge-model` 확장(그래프=핵심 자산).
- ⚠️ 남은 부채: `supabase/policies.sql` 은 옛 스키마용 → RLS 단계에서 새로. (AI-seed `origin` 컬럼/`aliases` 는 v0.2.)

### 이번에 추가된 것 (UX Research Sprint + 와이어프레임 v1)
- Lazyweb 증거 기반 4 스프린트 → `docs/ux-research/`: exploration / graph-navigation / collections / curator-system / **silmaril-ux-conclusion**.
- 결론: 실마릴 = "디자이너 취향 지도"(≈Are.na). **UX Principles v1** + 패턴 10개 확정.
- **W1 모바일 와이어프레임 v1**: `docs/wireframes/silmaril-mobile-v1.html` (클릭 가능 lo-fi, 5화면, 원칙 주석). file:// 로 열림.
- Lazyweb 네이티브 도구(`mcp__lazyweb__*`) 재시작 후 **로드·health 확인 완료**. (HTTP 채널도 여전히 사용 가능.)

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

### 🟣 스택 전환 (D-014, 2026-06-01) — 가장 중요

- **웹(Next.js) → iPhone-first Expo React Native.** 모바일이 본진. 백엔드 Supabase 유지.
- 정본 방향 [silmaril-v2-direction.md](docs/silmaril-v2-direction.md), 로드맵 [roadmap.md](docs/roadmap.md).
- 새 문서 완료: `docs/{roadmap,thread-taxonomy,feature-matrix,erd,api-spec}.md`. (Thread 타입에 **concept** 포함.)
- 사용자 용어: 미지영역 = **"미발견"** (`???`/`Fog`/`Locked` 금지, D-015). Atlas = 키워드 탭+스와이프.
- **진행 완료:** EXP0(웹→legacy-web/) + EXP1-3(Expo 골격·Supabase client·타입·더미 5탭 화면+상세+auth). `npm install`+`tsc`+`expo config` 검증 통과.
- **루트 = Expo 앱.** 구조: `app/(tabs)/{index,search,explore,records,profile}` + `app/auth/{login,signup}` + `app/thread/[id]` + `src/{components,features,lib,types,constants}`. StyleSheet + `src/constants/theme.ts`. 저장 store = `src/features/saves/store.ts`(더미).
- **다음 = (사용자) Expo Go 실기기 확인:** `npx expo start` → 아이폰 Expo Go QR. 그 후 **EXP4 Supabase 실연결**(service 구현 + 마이그레이션, erd 노트).
- **검증 한계:** Windows라 iOS 시뮬레이터 없음 → 실행 확인은 Expo Go(아이폰). 타입체크/config 는 통과.
- **2026-06-02 Codex 재검증:** `npm run typecheck`, `npx expo config --type public` 통과. LAN Metro 시작은 `https://api.expo.dev/v2/sdks/51.0.0/native-modules` 조회 중 `write ECONNABORTED` 로 중단됨. `--offline` Metro 는 localhost 전용이라 아이폰 확인에 사용할 수 없음. 네트워크 정상화 후 `npx expo start` 재시도.
- **프로세스 주의:** 이 저장소에서 먼저 떠 있던 Expo CLI PID `15968` 이 `8081` 을 점유 중이며 응답이 지연됨. Codex가 만든 `8082` 오프라인 서버는 종료함. 필요하면 사용자가 기존 Expo 터미널을 종료한 뒤 새로 시작.
- 미지영역 사용자 용어 = **"미발견 / 새로운 흔적"** (`???`/`Fog`/`Locked` 금지). Atlas=탐험 탭(어두운 화면), 키워드 탭+가로 스와이프.
- legacy-web/ = 아카이브된 Next.js 웹(보존). 새 개발은 루트 Expo 에서.

### ⚠️ v2 방향 전환 (D-013, 2026-06-01)
- 정본: **[docs/silmaril-v2-direction.md](docs/silmaril-v2-direction.md)**. 충돌 시 이 문서 우선.
- 핵심: **Atlas 가 제품 중심**(그래프는 한 모드) · **Fog**(`???` 미지영역, 추천 아님) · **AI-seed 우선**(AI Wiki→threads→connections, 빈 그래프 ❌) · **save-first**(노트 선택) · 내비 = **Home/Search/Explore(Atlas)/Records/Profile**(Create 탭 제거, Collections는 Records 안) · **Perspectives→Should** · **shadcn/ui 채택**(D-007 갱신) · NOU HAUS=future.
- 기존 코드(인증·Create Thread)는 유지. 재배치는 W2 확정 후.

다음은 **W2. 모바일 와이어프레임 v2 (v2 방향 반영)** → 사용자 검토 → **D1 디자인 시스템(shadcn)**.

- W1 산출물: `docs/wireframes/silmaril-mobile-v1.html` (사용자가 브라우저로 클릭 검토 중).
- 검토 포인트: 5개 UX 문제(정보과부하/길잃음/저장안함/중복피로/그래프안씀)를 이 흐름이 푸는가?
- 피드백 들어오면 같은 HTML을 v2로 수정 (구조 먼저, 시각은 D1).
- **D1 (와이어프레임 확정 후):** `tailwind.config.ts`(색/타이포/간격/radius) + `globals.css` + `Nav` + `components/ui/*`. 화면 로직 말고 토큰/셸만 먼저.
  - 실앱 토큰 레퍼런스는 `mcp__lazyweb__lazyweb_search`(로드·검증됨)로 수집. 톤: Are.na처럼 조용히 / Apple HIG 여백.
- 개발 트랙(N6 Perspective 등)은 디자인 확정까지 대기.
- Lazyweb 토큰 주의: [[lazyweb-ui-reference]] — `.mcp.json`/`.lazyweb/` gitignore됨, **공개 레포 커밋 금지.**

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
