# Navigation Flow

> 사용자 이동 흐름. IA: [information-architecture-v2.md](./information-architecture-v2.md) · Map: [map-experience.md](./map-experience.md).
> 원칙: **최소 클릭으로 탐험.** 시작점은 항상 **Map**.

## 0. 시작점

앱 진입 → **Map**. (로그인은 행동을 막지 않음 — 저장/생성 시점에만 필요. Auth는 EXP4.)

## 1. 핵심 흐름

```
Map (Sea: 내가 밝힌 세계)
 ├─▶ 노드 탭 ─▶ Thread Detail (Land 시트, peek)
 │        ├─▶ 저장 ─▶ (노드 점등) ─▶ Archive 에 반영
 │        ├─▶ 컬렉션 추가
 │        └─▶ 연결 탭 ─▶ Map 카메라 이동(다음 노드) ─▶ 시트 갱신 ↺ (탐험 지속)
 │
 ├─▶ Sky 아이콘 ─▶ 오늘의 발견 / 추천 / 미발견 점프
 │
 ├─▶ Create (탭) ─▶ 실마리 / 기록 / 컬렉션 생성 ─▶ 생성물이 Map·Archive 에 즉시
 │
 └─▶ My View (탭) ─▶ 내 지도 / 취향 키워드 / 통계
```

## 2. 명시된 주요 경로

```
Map → Thread Detail → Save → Archive          (발견→저장→보관)
Map → Create                                  (탐험 중 떠오른 것 즉시 생성)
Map → My View                                 (내가 밝힌 세계 돌아보기)
```

## 3. 클릭 최소화 설계

- **Thread Detail = Bottom Sheet(Land), 페이지 이동 아님.** 노드 1탭으로 요약+저장이 즉시 보이고, 시트를 내리면 바로 Map으로 복귀 → 탐험이 끊기지 않음.
- **저장 = 1탭** (시트 peek 단계에서 바로). 추가 확인 없음(낙관적).
- **연결 따라가기 = 시트 안에서 1탭** → Map 카메라가 이동하고 시트가 갱신(새 화면 push 없음). 연속 탐험이 한 손가락으로.
- **미발견 → 발견 = 1탭** (흐릿한 노드 탭하면 드러남).
- 하단 4탭은 어디서든 1탭 전환.

## 4. 전환 규칙

| From | To | 방식 |
|------|----|------|
| Map | Thread Detail | Land Bottom Sheet (오버레이, 비파괴) |
| Thread Detail | 다른 Thread | Map 카메라 이동 + 시트 갱신 (push 아님) |
| Thread Detail | Save | 인라인 토글 (이동 없음) |
| Save | Archive | 탭 전환 시 반영(자동 동기) |
| Map | Create / My View | 하단 탭 |
| Create 완료 | Map / Archive | 생성 후 Map 포커스(새 노드) 또는 Archive |

## 5. 빈/엣지 상태

- 신규 사용자: Map은 비어 보이지 않게 **AI-seed 그래프 + Daily Discovery**로 시작(빈 그래프 금지 — D-013, seed 전략).
- 저장 0: Sky가 "오늘의 발견"으로 첫 탭 유도. 막다른 길 없음.

## 6. 구현 메모 (다음 단계)

- Expo Router: `app/(tabs)/{map,archive,create,my-view}` + Map 위 Land 시트(`@gorhom/bottom-sheet` 또는 RN Modal). Thread Detail은 라우트 push 대신 시트 상태로.
- 현재 5탭 코드 → 4탭 재구성은 별도 구현 태스크(IA v2 §4).
