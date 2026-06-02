# MVP Feature Matrix (Map 중심)

> 정본: [silmaril-v2-direction.md](./silmaril-v2-direction.md) · IA: [information-architecture-v2.md](./information-architecture-v2.md) · Map: [map-experience.md](./map-experience.md).
> 스택: Expo RN + Supabase (D-014). **4탭 Map 중심 UX(D-017)** 기준으로 재정렬.

## Must Have (MVP v0.1) — 탭별

### 🗺 Map (탐험 — 핵심 경험)
| 기능 | 비고 |
|------|------|
| **Sea**: 노드 + 연결 표시 | 경량 별자리. 연결 Tier1(사실)/Tier2(해석) 구분 |
| **Land**: 실마리 상세 시트 | 요약 + **저장(1탭)** + 연결 리스트. 페이지 이동 아님 |
| **Sky**: 나침반 | 추천 · Daily Discovery · 미발견 점프 + 탐험률 |
| **미발견 실마리 표시** | 미지의 흔적. (`???`/`Fog`/`Locked` 금지) |
| 연결을 따라 이동 | Land의 연결 탭 → 카메라 이동 + 시트 갱신 |

### 🔖 Archive (보관)
| 기능 | 비고 |
|------|------|
| 저장한 실마리 | save-first의 귀결 (1급) |
| 기본 Collection | 담기 + 보기 (Archive 안, 별도 탭 ❌) |
| 짧은 기록 자리 | 선택 — 비어도 됨 |

### ＋ Create (생성)
| 기능 | 비고 |
|------|------|
| 실마리 / 기록 / 컬렉션 생성 진입 | 생성이 흐름을 막지 않음 (local 즉시) |

### 👤 My View (나)
| 기능 | 비고 |
|------|------|
| 탐험 통계 · 취향 키워드 자리 | 내 지도/밝힌 세계 요약 |

### 공통
| 기능 | 비고 |
|------|------|
| Supabase Auth 준비 | 이메일 기반 (저장/생성 시점에 필요) |
| Thread 검색 | 타입 필터(인물/작품/사조/장소/개념/조직) — Sky 검색 또는 보조 |

## Should Have
- 짧은 기록 (가볍게 — 선택)
- 이미지 없는 기본 카드 UI
- 기본 취향 키워드 표시
- 최근 저장 기반 추천 (Sky)

## Could Have
- 큐레이터 관점 (perspectives)
- SNS 공유 카드
- AI 취향 분석
- 고급 그래프 (Sea 드래그/줌, react-native-svg/gesture)
- Culture Map 뷰

## Won't Have (MVP)
- NOU HAUS 클래스 · 코치 시스템
- 3D 지구본 (Globe)
- 유료 Pro / 결제
- 고급 AI 추천
- 커뮤니티 검토 시스템

## 핵심 UX 게이트 (MVP 합격 기준)
1. 저장이 **1초** 안에 (Land에서 1탭).
2. 기록 없이도 저장·탐험만으로 지도가 자란다.
3. 그래프(Sea)는 메인이 아니라 Atlas의 한 보기. Land가 상세를 담당.
4. "정보 정리"가 아니라 **"내 세계를 밝힌다"** 는 느낌.
5. 미발견을 유치하게(`???`/Fog/Locked) 표현하지 않는다 → 미발견/새로운 흔적.
6. 문구는 **Toss처럼 짧게.**
7. 디자이너가 보기 싫은 릴스형 UI 금지. 정보성 콘텐츠를 찾는 사용자.
8. Cosmos처럼 이미지 중심이되, **연결과 맥락**을 반드시 보여준다.
