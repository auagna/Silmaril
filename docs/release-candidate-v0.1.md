# Silmaril — Release Candidate 점검 (v0.1)

> PHASE 56. **정직한 상태 점검**(코드 추가 없음). 버그/미완성을 사실대로 구분.
> 한 줄 결론: **현재 빌드는 "더미 데이터 기반 탐험 프로토타입"이다.** 백엔드·검색·소스/리뷰·다중 레이아웃은 미구현 → **공개 지식 플랫폼이 아니라, 핵심 탐험 경험을 보여주는 내부/TestFlight 데모 수준.** (프롬프트 의도 "v0.1 = 탐험 가능한 첫 번째 지도"에는 부합.)

## 0. 21항목 체크리스트 (정직)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 1 | Map 탐험 | ✅ | Sky/Sea/Land, 노드 선택·연결 따라가기 (더미) |
| 2 | 추천 키워드 이동 | △ | Sky "추천" 칩이 **고정 노드(Mies)** 선택. 우선순위 로직(PHASE 16) 미구현 |
| 3 | Bottom Sheet 정보 | ✅ | 요약/저장/연결/관점 (더미). collapse·expand·탭(PHASE 14)은 정적 |
| 4 | Archive 저장 | ✅ | 전역 store(더미), 저장 목록 표시 |
| 5 | Create 제안 | △ | **진입 카드만.** 폼/제출(PHASE 19·48) 미구현 |
| 6 | My View 요약 | ✅ | 통계·키워드·언어토글 (수치 더미) |
| 7 | ko / en 전환 | ✅ | useLocale + 토글, fallback |
| 8 | Day / Night | ✅ | useTheme, 시스템 기본 |
| 9 | Node Type System | ✅ | v1 (PHASE 29) |
| 10 | Node Icon/Label 문법 | ❌ | PHASE 30 미구현 (노드=텍스트 pill, 타입별 shape 없음) |
| 11 | Relation Type/Line 문법 | △ | tier 색만. 관계별 선 스타일(PHASE 31) 미구현 |
| 12 | Web/Flow/Branch/Focus 모드 | ❌ | PHASE 32 미구현 (고정 별자리 하나) |
| 13 | Flow Mode 시간축 | ❌ | PHASE 33 |
| 14 | Type Filter | ❌ | PHASE 34 |
| 15 | Supabase 연결 | ❌ | client·스키마는 있으나 **미적용·미연결**. 전부 더미 (PHASE 47) |
| 16 | Auth / Profile | △ | login/signup·authService **UI 스텁만**, 미연결·미게이팅 (PHASE 45) |
| 17 | Source / Review Queue | ❌ | PHASE 36~42 미구현 |
| 18 | Search | ❌ | PHASE 35 미구현 (4탭 IA에 검색 UI 없음) |
| 19 | Feedback | ❌ | PHASE 55 |
| 20 | iPhone 사용성 | ✅ | Expo Go SDK54 실기기 구동. 반응형/세이프에어리어/터치 패스 |
| 21 | Web preview | ❌ | iPhone-first 전용. web 레이아웃(PHASE 50) 없음 |

**요약: ✅ 8 · △ 3 · ❌ 10.** 토대(IA·테마·i18n·노드타입·Map 3층)는 단단하나, **데이터/검색/그래프 고도화/소스·리뷰/피드백은 없음.**

## 1. MVP 완성된 기능 (실제 동작, 더미)
- 4탭 IA(지도/보관/만들기/나) + Map 3층(Sky 나침반 / Sea 별자리 / Land 시트).
- 저장(1탭, save-first) + Archive 반영, 연결 따라가기(시트 갱신).
- Day/Night 테마, ko/en 다국어(UI+콘텐츠, fallback), Node Type System v1.
- Expo Go(SDK54) 실기기 구동. `tsc` + `expo export(ios)` 통과.

## 2. 출시 전 필수 수정 (v0.1을 "데모"로라도 내려면)
1. **추천 로직(PHASE 16):** Sky "추천"이 Mies 고정 → 최소한 selected 연결 이웃 우선.
2. **검색(PHASE 35) 최소판:** 4탭에 검색 진입 없음 → 사용자가 특정 실마리를 못 찾음. 로컬 더미 검색이라도 필요.
3. **데이터 정합:** schema/타입/더미 일치 유지. (Supabase 미연결이면 "더미 데모"임을 명시.)
4. **일관성 버그:** `app/auth/*`, `app/thread/[id]` 가 테마/i18n 미적용(정적 colors) → 들어가면 톤 깨짐. 4탭에서 진입로 최소화 or 전환.
5. **Create 빈손:** 진입만 있고 동작 없음 → "준비 중" 명시 or 비활성.
6. **소형 기기(SE) 실기기 확인:** 시트 높이/탭바.

## 3. 출시 후 개선 가능 (v0.2+)
- 노드 아이콘 문법(30) · 관계선 문법(31) · 레이아웃 모드(32) · Flow(33) · 타입필터(34).
- Supabase 실연결(47) + Auth/Profile(45) + RLS(46) + Create 제출/리뷰(48).
- pan/zoom(49) · web/tablet(50) · seed 확장(51).

## 4. 보류할 기능 (MVP 범위 밖, 신중)
- Source Adapter(Wikidata/Wikipedia/**나무위키**) + Ingestion + AI Draft (36~44): **법적/ToS/저작권·환각 리스크** → 별도 검토 후.
- Globe, 커뮤니티 거버넌스, 유료/추천 AI.

## 5. 기술 리스크
- **Sea 고정 레이아웃**: 노드 >8 시 겹침, pan/zoom 없음 → 데이터 늘면 못 씀.
- **전부 더미**: Supabase 스키마 미적용 → schema↔types↔dummy 드리프트 위험(현재는 맞춰둠).
- **Auth/Supabase E2E 미검증**(기기에서).
- **테마 미적용 잔여**(auth/thread[id] 정적 colors).
- **테스트 0**: PHASE가 쌓일수록 회귀 위험.
- **Windows 개발 = iOS 시뮬레이터 불가** → 검증은 Expo Go 의존(시각 회귀 못 잡음).
- **Expo SDK54/React19 + legacy-peer-deps** 의존성 취약(설치 환경 민감).

## 6. 운영 리스크
- **외부 소스 수집(36~40)**: 나무위키 원문/문장 재사용 금지(이미 candidate_only로 설계), Wikipedia 문장 직접 복사 금지 — 미준수 시 저작권 문제.
- **AI 초안(44)**: 사실 오류/환각 → 검수 없이 공개 금지.
- **리뷰/큐레이션 파이프라인 미구축**: 사용자 기여 허용 시 품질·악용 통제 공백.
- **프라이버시(53)**: 탐험/저장/관점 데이터 정책 미작성.
- **시드 정확성(51)**: 영향 관계 단정 금지(태도적 연결과 구분).

## 7. v0.1 Release Note (초안)
**Silmaril v0.1 — "첫 번째 지도" (Explorable Map Prototype)**
- 실마리(노드)와 연결을 따라가며 탐험하는 지도(Map): 하늘(나침반)·바다(별자리)·땅(상세 시트).
- 저장 중심 UX(한 번의 탭), 보관함(Archive).
- 한국어/영어, 라이트/다크(Day/Night Silmaril).
- 노드 타입 체계(인물·사조·작품·재료·개념·감정…).
- **알려진 한계:** 데이터는 데모용 더미(검색·실데이터·계정·소스 연결은 다음 버전). 지도는 작은 표본.
> 솔직한 한 줄: "완성된 지식 플랫폼이 아니라, 탐험의 감각을 확인하는 첫 지도."

## 8. v0.2 Roadmap (초안)
1. **데이터 실연결** — Supabase 적용 + seed(51) + service 교체(47) + 검색(35).
2. **탐험 깊이** — 추천 로직(16) + 타입 필터(34) + 관계선/아이콘 문법(31/30).
3. **그래프 모드** — Web/Focus 먼저, Flow/Branch 후속(32/33).
4. **기여/계정** — Auth/Profile(45) + Create 제출 + Review Queue(48/42) + Feedback(55).
5. **품질/운영** — RLS(46) + 테스트/QA(52) + privacy(53) + (신중) 소스/AI(36~44).
6. **확장** — web/tablet(50) + 배포(54).

## 가장 위험한 리스크 (Top 3)
1. **운영/법무:** 외부 소스(특히 나무위키/위키피디아 원문) 수집·재사용 — 활성화 전 ToS/저작권 검토 필수.
2. **기술:** 모든 화면이 더미 → 실데이터 연결(Supabase) 시 스키마/타입/RLS/성능에서 한 번에 문제 노출 가능. 작게 단계적으로.
3. **그래프 확장성:** Sea 고정 레이아웃은 노드 수 증가에 못 버팀 → 실데이터 전에 pan/zoom·레이아웃·노드수 제한 필요.
