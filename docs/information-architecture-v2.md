# Information Architecture v2 — Map 중심

> IA를 **Map 중심 4탭** 구조로 재설계. 정본 방향 [silmaril-v2-direction.md](./silmaril-v2-direction.md), Map 설계 [map-experience.md](./map-experience.md).
> 결정: [DECISIONS D-017](../DECISIONS.md). 이 문서가 내비게이션 정본(이전 5탭 안 [information-architecture.md](./information-architecture.md) §0 를 대체).

## 0. 하단 탭 (4)

```
[ Map ]      [ Archive ]      [ ＋ Create ]      [ My View ]
 탐험          보관             생성               내 지도
```

| 탭 | 한 줄 목적 | 비고 |
|----|-----------|------|
| **Map** | 탐험 — 세계를 밝힌다 | 핵심 경험(Sky/Sea/Land), Atlas |
| **Archive** | 내가 담아둔 것 | 저장·기록·컬렉션 |
| **Create** | 만들기 | 실마리·기록·컬렉션 생성 |
| **My View** | 나의 지도/정체성 | 내 지도·취향 키워드·통계·리포트 |

## 1. 탭별 정의

### 1.1 Map (탐험)
- 목적: 발견과 탐험. 앱의 시작점이자 중심.
- 포함: 3레이어 Map(Sky 나침반/Sea Active Map/Land 상세 시트), 추천·Daily Discovery, 미발견 실마리, 연결 그래프.
- 상세: [map-experience.md](./map-experience.md).

### 1.2 Archive (보관)
- 목적: 사용자가 담아둔 것들을 본다. (저장-first의 귀결)
- 포함:
  - **저장** 한 실마리 (1급).
  - **기록**(짧은 노트 — 선택, 비어도 됨).
  - **컬렉션**(별도 탭 아님 — Archive 안).
- 세그먼트: 저장 / 기록 / 컬렉션.

### 1.3 Create (생성)
- 목적: 새로 만들기. (v1에서 빠졌던 Create 탭을 v2에서 부활 — 명시적 생성 진입점.)
- 포함:
  - **실마리 생성**(Thread) — status `local` 즉시 본인 지도 반영.
  - **기록 생성**(Record) — 가볍게, Thread 첨부 선택.
  - **컬렉션 생성**(Collection).
- 생성은 흐름을 막지 않는다(공식 승인 전에도 즉시 반영).

### 1.4 My View (내 지도)
- 목적: 사용자의 정체성/취향을 보여준다.
- 포함:
  - **내 지도** — 내가 밝힌 부분그래프 요약(Map의 개인 뷰).
  - **취향 키워드** — 저장/연결에서 추출된 개념(빛/침묵…).
  - **탐험 통계** — 저장 수·연결 수·탐험률(예: 일본 건축 32%).
  - **리포트**(Could-have, 자리만).
  - 향후 **취향 유형**(건축가 × 발굴자) 자리.

## 2. v1(5탭) → v2(4탭) 매핑

| v1 (현재 구현됨) | v2 |
|------------------|----|
| 홈(Home/Discovery) | **Map** 의 Sky(추천·Daily Discovery)로 흡수 |
| 검색(Search) | **Map** 의 Sky 검색 + (필요시) Archive 내 검색. 독립 탭 폐지 |
| 탐험(Explore/Atlas) | **Map** (승격·본체) |
| 기록(Records) | **Archive** (이름·범위 정리) |
| 프로필(Profile) | **My View** |
| (없음) | **Create** 신설(탭) |

## 3. 원칙 유지

- 저장은 1초·1급. 기록은 선택.
- 그래프/연결은 무료의 핵심. 정렬을 좋아요로 하지 않는다.
- 사용자 용어: 미발견/미확인 실마리/새로운 흔적 (`Fog`/`Locked`/`???` 금지).
- 컬렉션은 독립 탭 금지 → Archive 안.

## 4. 구현 상태 / 다음

- ⚠️ **현재 Expo 코드는 5탭(홈/검색/탐험/기록/프로필).** 이 문서는 목표(IA v2). **문서 우선, 구현은 다음 단계**(아래).
- 다음(구현): `app/(tabs)` 를 Map/Archive/Create/My-View 4탭으로 재구성. Map은 map-experience.md 기준. 흐름은 [navigation-flow.md](./navigation-flow.md).
