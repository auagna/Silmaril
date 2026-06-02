# Atlas System

> **Atlas = 내부 개념.** 사용자에게는 **탐험(Map)** 화면으로 노출된다.
> Map 화면 구성: [map-experience.md](./map-experience.md) · 지식 모델: [canonical-knowledge-model.md](./canonical-knowledge-model.md) · 탐험 규칙: [exploration-logic.md](./exploration-logic.md).
> 사용자 용어: **미발견 / 미확인 실마리 / 새로운 흔적 / 연결 가능한 실마리.** (`Fog`/`Locked`/`???` 금지 — D-015.)

## 0. 한 줄

Atlas는 **정본 지식 그래프(canonical graph)를 "사용자가 밝힌 만큼" 투영한 것**이다.
사용자는 정보를 정리하지 않는다 — 어두운 세계를 저장으로 밝혀간다.

## 1. 내부 개념 (5)

### 1.1 Thread (실마리)
- 그래프의 노드. 타입: person/work/movement/place/concept/organization.
- Atlas에서: 밝혀진(저장/조회) Thread = 점등 노드, 그 외 = 미발견.

### 1.2 Connection (연결)
- 노드 간 방향 타입 엣지. **Atlas의 핵심 자산** (노드보다 연결이 가치).
- Tier 1(사실)·Tier 2(해석) 구분 → 시각/추천에서 다르게 다룸. 상세: canonical-knowledge-model §3.

### 1.3 Concept (개념)
- 추상 노드(빛/침묵/구조…). 인물·작품을 잇는 **허브**.
- "왜 좋아하는가"를 드러내는 축 — Atlas에서 개념 노드가 탐험의 방향을 만든다. 대개 Tier 2 연결.

### 1.4 Exploration Progress (탐험 진행도)
- "내가 밝힌 세계"의 정도. 차원별(분야/지역/사조)로 산출.
- 계산(개념): `밝힌 노드 수(차원) / 추정 총량(차원)`. 소스 = `user_thread_activity` + `bookmarks` + `thread_connections`.
- UI: "일본 건축 32% · 기능주의 18%" 식. (Culture Map 뷰의 토대.)

### 1.5 Undiscovered Threads (미발견 실마리)
- 저장 노드의 연결 이웃 중 **아직 저장/조회 안 한** Thread.
- 계산: `{저장 thread 들의 connection 이웃} − {bookmarks ∪ activity.viewed}`.
- UI: **미발견 / 새로운 흔적**. 절대 `???`/`Fog`/`Locked` 로 표기하지 않음.
- 상세 규칙(언제 frontier에 추가/표시되는가): [exploration-logic.md](./exploration-logic.md).

## 2. 사용자 노출 매핑 (내부 → UI)

| 내부 개념 | 사용자에게 보이는 것 |
|-----------|----------------------|
| Atlas | 탐험(Map) 탭 |
| Thread | 실마리 |
| Connection | 연결 / "~로 이어짐" |
| Concept | (그냥 실마리의 한 종류 — 개념) |
| Undiscovered | 미발견 · 미확인 실마리 · 새로운 흔적 |
| frontier 후보 | 연결 가능한 실마리 |
| Exploration Progress | "밝힌 세계 N%" |

## 3. Atlas 보기 방식 (modes)

- **Graph** — 노드/연결 별자리 (MVP의 Sea가 이 경량 버전).
- **Culture Map** — 분야/지역/사조 차원의 진행도 지도 (My View의 "밝힌 세계" 미리보기 → 추후 본격화).
- **Globe** — 어두운 지구를 탐험으로 밝힘 (**future, MVP 제외**).

## 4. Map 화면과의 대응 (Sky/Sea/Land)

- **Sky(나침반):** 추천 실마리 · Daily Discovery · 미발견 점프 → Exploration Progress 표시.
- **Sea(Active Map):** Thread 노드 + Connection + 미발견 노드. = Atlas Graph 뷰.
- **Land(상세 시트):** 선택 Thread의 요약/저장/연결/관점/출처.

## 5. MVP 범위 / 추후

- **MVP:** Graph(경량 Sea) + 미발견 표시 + 진행도(더미 → 파생) + Land 상세. 데이터는 더미 → EXP4 실연결.
- **추후:** Culture Map 본격화, 진행도 정밀 산출, 관점 레이어, Globe.
- **금지(영구):** 사용자 UI에 Fog/Locked/??? · 무한 추천 피드(SNS) · 무거운 그래프/3D Globe(MVP).
