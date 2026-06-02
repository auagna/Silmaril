# Canonical Knowledge Model

> Silmaril이 "지식"을 어떻게 표현하는가의 개념 모델. 물리 스키마는 [erd.md](./erd.md), 타입은 [thread-taxonomy.md](./thread-taxonomy.md).
> 한 줄: **하나의 대상 = 하나의 정본(canonical) 노드. 그 위에 연결·기여·관점이 쌓인다.**

## 1. 정본(Canonical) 원칙

- 실세계의 한 대상(인물/작품/사조/장소/개념/조직)은 **정확히 하나의 thread** 로 표현된다.
- 표기 변형(Dieter Rams ↔ 디터 람스)은 같은 thread 의 **aliases**(추후 컬럼). slug 는 하나.
- 중복이 생기면 **`merged_into_thread_id`** 로 정본에 흡수(merge). UI는 항상 정본으로.
- 목적: "실마리는 하나" — 같은 대상에 여러 페이지가 생겨 탐험이 파편화되는 것을 막는다.

## 2. 3개 층 (Layering)

| 층 | 무엇 | 출처 | MVP |
|----|------|------|-----|
| **정본 사실** | thread 의 title/summary/description + 연결 | 주로 AI-seed, 이후 보정 | ✅ |
| **사용자 기여** | bookmarks(저장) · records(기록) · collection_items | 사용자 행동 | ✅ |
| **관점(Perspective)** | 같은 정본에 대한 해석/큐레이션(바이라인) | 큐레이터/사용자 | 추후 |

> "실마리는 하나, 관점은 여러 개." 관점은 *경쟁 페이지*가 아니라 같은 정본 위의 레이어다(추후).

## 3. 연결(Edge) 모델

- `thread_connections` = **방향 있는 타입 엣지**: `from → [relation_type] → to`.
- relation_type 예: influenced_by / created / member_of / located_in / contemporary_of / related_to / derived_from / belongs_to.
- 엣지에도 `status`(검증 단계) + `trust_score`(신뢰) — 사실 주장도 검증 대상.
- **개념 중심성:** 인물·작품을 잇는 진짜 실마리는 종종 `concept`(빛/침묵)다. 개념 노드가 그래프의 허브가 되도록 시드한다.

## 4. 품질/상태 신호

- `thread_status`: `local → community → verified → official` (+ `merged`/`archived`). 공식화는 *생성 조건이 아니라 검증 이후 상태*.
- `trust_score`: 검증·인용·연결 기반 신뢰도(향후 산식). 정렬/노출에 활용.
- `completion_score`: 정본 정보가 얼마나 채워졌는지(요약/설명/연결/출처 충족도). 빈 노드를 식별해 보강·시드 유도.
- **출처(provenance):** MVP 스키마는 `created_by` + `status` 로 표현. AI-seed 구분용 `origin`(ai/user/curator) 컬럼은 AI Wiki 도입(v0.2) 시 추가.

## 5. 사용자 취향 지도 (Taste Map)

- 취향 지도는 별도 거대 테이블이 아니라 **사용자의 부분그래프**다:
  `bookmarks`(저장 노드) + 그 노드들의 `thread_connections` + `user_thread_activity`.
- "세계를 밝힌다" = 이 부분그래프가 정본 그래프 위에서 점점 커지는 것.
- 탐험률(예: 일본 건축 32%) = 특정 차원(place/movement)에서 사용자가 밝힌 노드 / 정본 노드 추정치.

## 6. 미발견(Undiscovered) 파생

```
미발견(user) = { 저장 thread 들의 연결 이웃 } − { bookmarks ∪ activity.viewed }
```
- 정본 그래프가 충분히 시드돼 있어야(= 연결이 풍부해야) 미발견이 의미 있게 나온다. → [seed-dataset-strategy.md](./seed-dataset-strategy.md).
- UI 용어: **미발견 / 미확인 실마리 / 새로운 흔적**. (`???`/`Fog`/`Locked` 금지 — D-015.)

## 7. 불변 규칙 (코드/시드가 지켜야 함)

1. 대상당 thread 하나. 중복은 merge, 새 페이지 금지.
2. 타입 단일. 겹치면 연결로 표현.
3. 개념을 적극 생성·연결. 개념 없는 그래프는 얕다.
4. AI가 먼저 정본을 시드, 사용자는 보정/기여. 빈 그래프로 시작하지 않는다.
5. 스키마와 TS 타입을 항상 일치(불일치는 부채로 명시, 즉시 정렬).
