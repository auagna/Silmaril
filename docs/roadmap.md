# Silmaril — Roadmap

> 정본 방향: [silmaril-v2-direction.md](./silmaril-v2-direction.md) · 스택 전환 근거: [DECISIONS D-014](../DECISIONS.md).
> **iPhone-first.** Expo React Native + Supabase. 웹은 나중에 (Expo Web 또는 Next.js).

## 0. 한 줄

사용자가 실마리를 **저장**하고, **연결**을 따라 **탐험**하며, 자신의 **취향 지도**를 만들어 가는 iPhone-first 아카이빙/탐험 앱.

## 1. 플랫폼 순서

1. **iPhone 앱** (지금) — Expo RN.
2. 태블릿 대응.
3. 웹 접근 (Expo Web 또는 Next.js).

> 기존 Next.js 웹 MVP(인증·Create Thread)는 문서/스키마/UX를 검증한 디딤돌. 코드는 보존하되 모바일이 본진. (legacy 처리 → HANDOFF 참고)

## 2. 개발 순서 (이 로드맵의 핵심)

### Phase 1 — Thread Taxonomy v1  ✅(문서)
`docs/thread-taxonomy.md`. MVP 타입 확정 (**concept 포함**).

### Phase 2 — Feature Matrix  ✅(문서)
`docs/feature-matrix.md`. Must / Should / Could / Won't.

### Phase 3 — Supabase ERD  ✅(문서)
`docs/erd.md` (+ `supabase/schema.sql` 은 wiring 단계에서 마이그레이션).

### Phase 4 — API 명세  ✅(문서)
`docs/api-spec.md`. 함수 시그니처.

### Phase 5 — 화면 구현 (다음)
순서: **Auth → Home → Search → Thread Detail → Save → Records → Explore → Profile.**
먼저 Expo Router 탭 골격 + Supabase client + TS 타입 + **더미 데이터** 화면, 그 후 Supabase 실연결.

## 3. 버전 계획

| 버전 | 내용 |
|------|------|
| **MVP (v0.1)** | Auth · 검색 · Thread 상세 · 저장 · Records · 기본 Collection · 기본 Connection 표시 · 기본 Explore(탐험) · 미발견 실마리 · 프로필. 더미→Supabase. |
| **v0.2** | **AI Wiki** (Supabase Edge Function 시드 생성) · 최근 저장 기반 추천 · 취향 키워드. |
| **future** | 큐레이터 관점 · 취향 유형 분석 · 고급 그래프 · Culture Map 고도화 · (장기) Globe · NOU HAUS 연동. |

## 4. 서버 전략

```
Expo App → Supabase Auth / PostgreSQL / Storage
```

- 초기엔 **Supabase만.** 자체 서버 / Neo4j / 고급 추천 서버 / 실시간 AI 분석 ❌.
- AI Wiki 는 MVP 후반 또는 v0.2에서 **Edge Function** 으로.
- 그래프는 핵심이지만 MVP에선 **가볍게** (Atlas의 한 보기). 무거운 그래프 엔진 도입 안 함.

## 5. 비즈니스 모델 (메모 — MVP 결제 없음)

| Free | Pro (future) |
|------|------|
| 저장 · 기록 · 컬렉션 · 기본 연결 · 기본 탐험 | AI 추천 · AI 취향 분석 · 고급 그래프 · 고급 Atlas 분석 · 리포트 카드 |

> **그래프·연결 자체는 무료.** 유료는 *분석/AI 추천*에 둔다.

## 6. Silmaril ↔ NOU HAUS (NOU HAUS는 MVP 미구현, 방향만)

| | **Silmaril** (담는 과정) | **NOU HAUS** (표현하는 과정) |
|--|--|--|
| 행동 | 읽고·저장하고·연결하고·기록 | 배우고·실습하고·만들고·발표 |
| 결과 | 취향 지도 | 작품 / 포트폴리오 |

향후 연동 지점만 남긴다:
- Silmaril 관심 → NOU HAUS 클래스 추천.
- NOU HAUS 수강 후기/결과물 → Silmaril Records 표시.
- 클래스 탭은 나중에 Profile 또는 Records에 추가 가능.
