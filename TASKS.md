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
- [x] **EXP0. 기존 Next.js 웹 → `legacy-web/` 이동.** 루트는 Expo 차지.
- [x] **EXP1-3. Expo 골격 + Supabase client + 타입 + 더미 화면.**
      Expo Router 5탭(홈/검색/탐험/기록/프로필) + auth(login/signup) + thread/[id]. StyleSheet + `src/constants/theme.ts`.
      `src/lib/supabase.ts`(AsyncStorage), `src/types/database.ts`, `src/lib/dummy.ts`, `src/features/saves/store.ts`.
      검증: `npm install` + `tsc --noEmit` 통과 + `expo config` 정상 + EXPO_PUBLIC env 로드 확인.
- [ ] **EXP-RUN. (사용자) Expo Go 로 실기기 확인.**  ← **다음 작업 (사용자)**
      `npx expo start` → 아이폰 Expo Go 로 QR 스캔. 5탭/탐험(Atlas)/저장/상세 흐름 점검.
      Codex 사전 검증(2026-06-02): `npm run typecheck`, `npx expo config --type public` 통과.
      이 PC에서 Expo API 조회가 `ECONNABORTED` 되면 네트워크 정상화 후 재시도. `--offline`은 localhost 전용이라 실기기 확인에 부적합.
- [ ] **EXP4. Supabase 실연결** — service 함수(api-spec) 구현 + 마이그레이션(connections→thread_connections, origin 컬럼, perspectives→future, reactions 제외 — erd 노트). 더미 → 실데이터.

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
