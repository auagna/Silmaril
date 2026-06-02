# Seed Dataset Strategy

> 앱이 **빈 그래프로 시작하지 않도록** 초기 정본 데이터를 채우는 전략 (D-013: AI-seed 우선).
> 모델: [canonical-knowledge-model.md](./canonical-knowledge-model.md) · 타입: [thread-taxonomy.md](./thread-taxonomy.md).

## 1. 원칙

- **AI가 먼저 정본(threads/connections)을 시드, 사용자가 나중에 보정.** 신규 사용자도 첫날부터 밝힐 세계가 있어야 한다.
- **넓고 얕게(X) → 좁고 깊게(O).** 한 도메인을 *밀도 높게* 시드해야 연결·미발견·탐험률이 살아난다.
- **개념을 허브로.** 인물/작품만이 아니라 concept(빛/침묵/구조…)를 충분히 만들어 그래프 중심에 둔다.

## 2. MVP 시드 도메인 — 디자인 & 건축

예시들(안도 타다오·디터 람스·바우하우스·빛·침묵)이 한 결로 묶이는 **디자인/건축** 클러스터를 첫 시드로.
이유: 타깃 사용자(디자이너)와 정렬 + 인물↔작품↔사조↔장소↔개념이 촘촘히 연결되는 도메인.

## 3. 시드 모양 (목표치, MVP)

| 타입 | 목표 수(초안) | 비고 |
|------|----------------|------|
| person | 15–25 | 디터 람스, 안도 타다오, 루이스 칸, 그로피우스… |
| work | 15–25 | SK4, 빛의 교회, 롱샹… (이미지 중심) |
| movement | 6–10 | 바우하우스, 모더니즘, 브루탈리즘… |
| place | 6–10 | 데사우, 베를린, 나오시마… |
| **concept** | **10–15** | **빛/침묵/구조/물성/여백/현상학/기능주의…** (허브) |
| organization | 4–8 | 바우하우스(학교), CIAM… |

- **연결 밀도:** thread 당 평균 ≥ 3 connections. 개념 노드는 더 많이(허브).
- **품질 바:** 각 thread = `summary` 1줄 필수 + 연결 ≥ 2 + (가능하면) `cover_image_url`.

## 4. 생성 파이프라인

```
주제 리스트(도메인 큐레이션)
  → AI Wiki 생성: threads(요약/설명) + 타입 분류
  → 개념 추출: 인물/작품에서 공통 개념(빛/침묵)을 concept thread 로 승격
  → 연결 생성: relation_type 부여한 thread_connections
  → 사람 검수(중복 merge, 오류 수정)
  → 발행: status = community (official 은 검증 후)
```

- **MVP 현 단계:** AI 파이프라인(Edge Function)은 v0.2. **지금은 손큐레이션 + `src/lib/dummy.ts`** 가 사실상의 시드. 실연결(EXP4) 시 이 시드를 `threads`/`thread_connections` 로 적재.
- **v0.2:** Supabase Edge Function `seedThreadWiki(topic)` 가 위 단계를 자동화. 생성물은 `origin='ai'`(컬럼 추가 시).

## 5. 중복/품질 관리

- slug + aliases 로 dedup. 충돌 시 접미사 대신 **동일 대상이면 merge**(`merged_into_thread_id`).
- 빈/얕은 노드(낮은 `completion_score`)는 미발행 또는 보강 큐로.
- 사실 오류 방지: AI 생성물은 발행 전 사람 검수(특히 연결의 방향/관계).

## 6. 미발견 체감을 위한 시드 설계

- 사용자가 몇 개만 저장해도 **연결 이웃이 풍부**하게 떠야 "새로운 흔적"이 의미 있다.
- 따라서 시드는 *허브 개념 + 그 주변 인물/작품/장소*가 빽빽한 형태로. (외딴 노드 최소화.)

## 7. 다음 액션

- EXP4(실연결)에서 `dummy.ts` 시드를 Supabase 에 적재하는 시드 스크립트 작성(`supabase/seed.sql` 또는 TS 시더).
- v0.2에서 AI Wiki Edge Function + `origin` 컬럼 도입.
