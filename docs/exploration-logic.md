# Exploration Logic

> 탐험이 실제로 "어떻게 펼쳐지는가"의 규칙. Atlas: [atlas-system.md](./atlas-system.md) · 모델: [canonical-knowledge-model.md](./canonical-knowledge-model.md).
> 사용자 용어: 미발견 / 미확인 실마리 / 새로운 흔적 / 연결 가능한 실마리. (`Fog`/`Locked`/`???` 금지.)

## 0. 사용자별 Thread 상태 (탐험 관점)

`user_thread_activity` 기준의 4단계:

```
미발견(undiscovered) → 새로운 흔적(surfaced) → 발견(viewed) → 저장(saved)
```
- **미발견:** 저장 노드의 연결 이웃이지만 아직 frontier에 안 떠오른 것.
- **새로운 흔적(surfaced):** frontier에 올라와 사용자에게 보이는 미발견. (UI에서 점선 노드/카드)
- **발견(viewed):** Land 시트 등으로 열어 본 것. `activity.viewed=true`.
- **저장(saved):** `bookmarks` + `activity.saved=true`. 그래프에서 점등.

## 1. 워크스루 — "안도 타다오 저장"

```
[안도 타다오] 저장
  │  bookmarks(+), activity.saved=true → 노드 점등
  ▼
연결이 펼쳐진다 (안도의 thread_connections):
  · 안도 ─influenced(T1)→ 루이스 칸
  · 안도 ─related_to(T2)→ 빛
  · 안도 ─related_to(T2)→ 침묵
  · 안도 ─contemporary_of(T1)→ 카를로 스카르파
  · 안도 ─shares_theme(T2)→ 현상학
  ▼
이 이웃들이 "연결 가능한 실마리"로 보임.
그중 아직 저장/조회 안 한 것 = 미발견 → 일부가 "새로운 흔적"으로 표면화.
  ▼
빛·침묵(개념, T2)이 새로운 흔적으로 강조 → "왜 안도를 좋아하나"의 단서.
  ▼
루이스 칸 저장 → 그 이웃(칸→빛, 칸→구조…)이 다시 펼쳐짐 → frontier 확장 (호기심 루프)
```

## 2. 규칙 정의

### 2.1 어떤 실마리가 보이는가 (visible)
- **저장한 실마리** + **저장 노드의 1-홉 연결 이웃**(연결 가능한 실마리). 기본 1-홉, 필요 시 2-홉.
- 보이는 것은 항상 "내가 밝힌 것 + 그 가장자리"로 한정 → 정보 과부하 방지.

### 2.2 어떤 실마리가 미발견 상태인가
```
미발견(user) = ⋃(저장 thread t)  이웃(t)   −   ( bookmarks(user) ∪ {viewed=true} )
```
- 즉 "저장한 것들이 가리키는, 아직 안 가본 곳".
- 저장이 늘면 미발견 집합이 함께 자란다(밝힐수록 가장자리가 넓어짐).

### 2.3 언제 "새로운 흔적"이 나타나는가 (surfacing 조건)
미발견 중 아래를 만족하면 frontier(새로운 흔적)로 표시:
1. **방금 저장/조회한 노드의 이웃** (직후 즉시 1~3개 표면화 — 행동에 대한 즉각 보상).
2. **여러 저장 노드가 공통으로 가리키는** 미발견 (공유 이웃 = 강한 신호).
3. **개념(concept) 노드 우선** — Tier 2 연결로 닿는 개념은 "왜 좋아하나"를 드러내므로 우대.
- 표시 수 제한(예: 한 번에 ≤ 6) → 미스터리감 유지, 과부하 방지.

### 2.4 언제 추천 실마리가 표시되는가 (recommendation 조건)
- **신호: 저장 · 연결 · 컬렉션** (좋아요 아님 — D-006).
- 후보 = 미발견 ∪ 약한관련, 점수 상위:
```
score(t) =  w1·(저장노드와의 공유 이웃 수)
          + w2·(공유 개념 허브 수)          ← "왜"의 축
          + w3·trust_score(t)
          + w4·connection_density(t)
          − w5·days_since_relevant
```
- Sky(나침반)의 "추천"/Daily Discovery가 이 결과를 사용. Tier 2(개념) 가중치를 높게.

## 3. 엣지 케이스

- **저장 0 (신규):** 미발견 계산 불가 → **Daily Discovery(시드)** 로 첫 실마리 제시. 빈 화면 금지.
- **이웃을 다 봄:** 1-홉 소진 시 **2-홉 확장** 또는 추천으로 폴백.
- **고립 노드(연결 없음):** 시드 품질 문제 → seed 전략에서 연결 ≥ 2 보장([seed-dataset-strategy.md](./seed-dataset-strategy.md)).
- **그래프가 얕음:** 정본 시드가 충분해야 미발견이 의미 있음 → AI-seed 우선(D-013).

## 4. 구현 메모 (MVP)

- MVP는 더미(`src/lib/dummy.ts`)의 `connectionsOf`/`undiscovered` 로 위 규칙의 1-홉 버전을 근사.
- EXP4(실연결)에서 `getUndiscoveredThreads` / `getUserExploreMap`(api-spec) 로 Supabase 쿼리화.
- 점수화(2.4)는 v0.2(추천) 단계에서 본격 도입. MVP는 "방금 저장한 노드의 이웃 + 공유 이웃" 정도로 단순.
