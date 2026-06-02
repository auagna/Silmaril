# Seed Dataset Strategy

> 앱이 **빈 그래프로 시작하지 않도록** 초기 정본 데이터를 채우는 전략 (D-013: AI-seed 우선).
> 모델: [canonical-knowledge-model.md](./canonical-knowledge-model.md) · 타입: [thread-taxonomy.md](./thread-taxonomy.md) · 탐험: [exploration-logic.md](./exploration-logic.md).

## 1. 목표 (MVP 출시 전 Official Seed)

| 항목 | 목표 |
|------|------|
| Threads | **500 – 1,000** |
| Connections | **3,000 – 5,000** (thread당 평균 ~5) |
| 분야 | **건축 · 산업디자인 · 그래픽 · 사진 · 예술** (5) |
| 개념(concept) 비중 | 전체의 **12–18%** (허브 역할 — 분야 횡단) |

> 연결이 노드의 ~5배 → 미발견/추천/탐험률이 의미 있게 작동(고립 노드 최소화).

## 2. 원칙

- **AI가 먼저 정본 시드 → 운영진 검수 → 발행.** 사용자는 이후 보정/기여.
- **개념을 허브로.** 빛/침묵/구조/물성/여백/그리드/타이포그래피/추상 등 분야를 가로지르는 개념으로 그래프를 묶는다.
- **분야 내 깊게 + 분야 간 개념으로 연결.** (한 분야만 깊은 게 아니라, 5분야를 *개념*이 가로질러 잇는다.)

## 3. 분야별 배분 (초안)

| 분야 | Threads(초안) | 핵심 타입 | 예시 |
|------|----------------|-----------|------|
| 건축 | 120–220 | person/work/movement/place | 안도 타다오, 빛의 교회, 브루탈리즘, 나오시마 |
| 산업디자인 | 100–180 | person/work/company/movement | 디터 람스, Braun SK4, 기능주의 |
| 그래픽 | 90–160 | person/work/movement/concept | 헬베티카, 스위스 스타일, 그리드 |
| 사진 | 80–150 | person/work/movement | 앙리 카르티에-브레송, 결정적 순간 |
| 예술 | 90–160 | person/work/movement/place | 바우하우스, 모더니즘, 미니멀리즘 |
| (횡단) 개념 | 70–140 | concept | 빛·침묵·구조·물성·여백·추상·리듬 |

## 4. Official Seed Dataset 기준 (발행 자격)

한 Thread가 **Official Seed** 가 되려면:
1. `summary` 1–2문장 필수 + (가능하면) `description`.
2. **연결 ≥ 2** (최소 하나는 개념 또는 사조와 연결 — 고립 금지).
3. 타입 정확 + 정본 1개(중복은 merge).
4. 사실 검증됨(출처 있거나 운영진 확인) → `status = official` 또는 `verified`.
5. 민감/저작권 문제 없음(이미지·텍스트).

→ 기준 미달은 `community`/보강 큐로(미발행 또는 후속 보강).

## 5. AI 생성 기준

- **입력:** 분야별 주제 리스트(큐레이션) → AI가 thread(요약/설명/타입) + connection 생성 + **개념 추출**(인물/작품에서 공통 개념을 concept thread로 승격).
- **Tier 부여:** 사실 관계(영향/창작/소속/위치/동시대)는 **Tier 1**, 해석(관련/주제공유)은 **Tier 2** 로 보수적으로. 불확실하면 Tier 2 + 낮은 trust_score.
- **품질 게이트(자동):** 중복 slug/alias 제거, 연결 ≥ 2 충족, 빈 요약 제외, 자기연결·역방향중복 제거.
- **출처/사실성:** AI는 단정 대신 검증 대상 표시(`origin='ai'`, 추후 컬럼). 환각 의심 항목 플래그.
- **산출:** `origin='ai'`, 초기 `status='community'` 로 적재 → 검수 후 승격.

## 6. 운영진 검수 기준

- **체크리스트:** ① 사실 정확성 ② 연결 *방향/관계* 적절 ③ 중복 → merge ④ 개념 승격 타당 ⑤ Tier 분류 적절 ⑥ 민감/저작권.
- **샘플링:** AI 배치의 100% 자동 게이트 + **인물/사조 노드는 100% 인간 검수**, 그 외 ≥ 20% 표본 + 이상치.
- **승격:** 검수 통과 → `verified`, 운영진 공식 인정 → `official`. 반려 → 보강 큐.
- **사인오프:** 분야별 담당 1인 검수 기록(누가/언제). 추후 `reports`/감사 로그.

## 7. 단계 (Phasing)

```
지금: 더미(src/lib/dummy.ts) 소규모 — UI 검증용
  ▼
EXP4: 더미 → Supabase 적재(seed script) + 소규모 실데이터
  ▼
출시 전: AI 배치 생성(분야별) → 자동 게이트 → 운영진 검수 → Official Seed 500–1000 / 3000–5000
```

- 도구: Supabase Edge Function `seedThreadWiki(topic)`(v0.2) + `supabase/seed.sql`/TS 시더.
- 미발견 체감 보장: 시드는 *허브 개념 + 주변 노드*가 빽빽하도록(고립 노드 최소화) — [exploration-logic.md](./exploration-logic.md) §3.

## 8. 다음 액션

- EXP4에서 시더 스크립트(더미→DB).
- 출시 전 AI 배치 파이프라인 + 검수 운영 정의(담당/도구).
