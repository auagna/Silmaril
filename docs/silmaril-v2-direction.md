# Silmaril — v2 방향 (북극성)

> 2026-06-01 확정. **이 문서가 제품 방향의 최상위 정본이다.** 기존 문서(product-spec / IA / data-model)와
> 충돌하면 **이 문서가 우선**한다. 결정 근거: [DECISIONS D-013](../DECISIONS.md).
> UX 근거(증거 기반): [docs/ux-research/](./ux-research/).

## 0. 한 줄 정의

Silmaril은 **연결된 실마리(Thread)를 따라 탐험하며 자신의 취향을 발견하고, 개인 탐험 지도(Atlas)를 지어
미지의 세계를 점점 밝혀 가는** 지식 탐험 플랫폼이다.

- Silmaril은 **아니다**: 위키 클론 / 핀터레스트 클론 / 노트앱 / SNS.
- Silmaril은 **이다**: 탐험을 통해 취향을 발견하는 플랫폼. (정보 수집이 아니라 세계를 밝히는 경험.)

핵심 질문의 전환: 사용자는 **"내가 무엇을 좋아하는가"** 가 아니라 **"나는 왜 그것을 좋아하는가"** 를 탐구한다.
> 안도 타다오 → 루이스 칸 → 카를로 스카르파 → 현상학. 사용자는 *연결*을 발견한다.

## 1. Atlas — 제품의 감정적 중심 ⭐

> 그래프가 아니다. AI가 아니다. **Atlas다.**

- 사용자는 **어두운 세계 / 안개(Fog) / 미지의 영토**에서 시작한다.
- 실마리를 저장할수록 세계가 **밝혀진다(visible).**
  - 예: 안도 타다오 · 루이스 칸 · 카를로 스카르파 저장 → Atlas가 일본·독일·이탈리아와 관련 개념을 드러낸다.
- Atlas 모드 (전환 가능):
  1. **Graph** — 노드/엣지 (보조 뷰. 메인 아님.)
  2. **Cultural Map** — 문화/지역/사조의 지도
  3. **Globe (future)** — 어두운 지구를 탐험으로 밝힘 (일본 63% / 독일 41% …). "내가 탐험한 세계"의 표상. MVP 아님.

목표 감정: **"나는 내 세계를 밝히고 있다."** (정보를 정리하고 있다 ❌)

## 2. Fog 시스템 (중요·신규)

- 발견한 관심사 *주변*에 **`???` 미지의 영역**을 보여준다.
- 이것은 **추천이 아니라 미스터리**다. 느낌은 "저기 뭐가 있을까?"
- **탐험 > 추천.** Fog는 호기심 루프의 엔진이다.

## 3. AI 전략 (중요·방향 변경)

- **유저 생성 그래프에 의존하지 않는다.** AI가 **먼저** 초기 지식 구조를 만든다.
- 흐름: **AI Wiki → Threads → Connections → Graph → (유저가 나중에 보정/기여)**.
- 함의: 빈 그래프로 시작하지 않는다. 신규 사용자도 첫날부터 밝힐 세계가 있다.
- MVP에는 **Basic AI Wiki**(시드 생성)가 Must-Have로 포함. 고급 AI 분석은 Won't(MVP).

## 4. 핵심 제품 통찰 — Save-and-Explore First

- 사용자는 **거의 글을 쓰지 않는다.** 사용자는 **저장을 사랑한다.**
- 그러므로 **노트 우선 경험을 만들지 않는다.** **저장+탐험 우선** 경험을 만든다.
- **기록(Notes/Reviews)은 항상 선택.** (UX 리서치의 "저장은 1급 동사" 결론과 일치.)

## 5. 내비게이션 (현재 확정 구조) — 모바일 하단 탭

| 탭 | 역할 | 포함 |
|----|------|------|
| **Home** | Discovery | Daily Discovery · Continue Exploring · Curator Picks · Newly Created Threads |
| **Search** | Find Threads | 타입별: Person/Work/Movement/Place/Event/Organization … |
| **Explore** | **메인 = Atlas** | Atlas(Graph/Cultural Map/Globe-future) · **Fog** · Exploration Progress · Unlock Paths |
| **Records** | User Archive | Saved Threads · Notes · **Collections** · Reviews |
| **Profile** | Identity | Taste Profile · Exploration Stats · Reports · Badges |

> **변경점:** `Create` 탭 제거. `Map` → `Explore(Atlas)` 로 승격. `Search` 독립 탭 신설.
> **Collections 는 Records 안에 둔다 — 별도 탭으로 만들지 않는다.**

## 6. Thread 타입

Person · Work · Movement · Place · Event · Organization · Company · Book · Film · Music
> (기존 11종에서 `media` 제거 → 10종. 예: Person=디터 람스, Movement=바우하우스, Place=데사우, Work=Braun SK4.)

## 7. MVP 우선순위

**Must Have**
1. Thread Pages
2. Search
3. Save
4. Collections
5. Connections
6. **Atlas**
7. **Basic AI Wiki**

**Should Have**: Notes · Perspectives · User Profiles
**Could Have**: Taste Analysis · Curator Trails · Reports
**Won't Have (MVP)**: Curator Economy · Coach System · NOU HAUS Courses · Advanced AI Analysis · Globe Mode · Community Governance

> **변경점:** Perspectives 가 핵심에서 **Should-Have** 로. Curator 시스템·Globe 는 future.

## 8. 미래 기능 (확장 포인트만 남긴다)

- **Curator System** — organize/interpret/connect (Bauhaus Curator 등).
- **Taste Identity System** — Architect / Discoverer / Curator / Critic / Evangelist 조합 (예: Architect × Discoverer). MBTI 아님 — *탐험 행동*의 표상.
- **Globe Mode** — §1 참조.

## 9. NOU HAUS 경계 (MVP 아님)

| | Silmaril | NOU HAUS |
|--|----------|----------|
| 방향 | **Input** | Output |
| 목적 | Archive / Explore / Curate | Learn / Practice / Create / Exhibit |
| 사용자 | Explorer / Recorder / Curator | Learner / Creator / Coach |
| 결과 | **Taste Map** | Creative Work |

- 관계: **Silmaril은 관심을 발견**하고, **NOU HAUS는 관심을 기술·작품으로 전환**한다.
- **NOU HAUS는 MVP에 구현하지 않는다. 미래 통합 지점만 남긴다.**

## 10. 기술 스택

Next.js · TypeScript · Supabase · Tailwind · **shadcn/ui**
> **변경점:** shadcn/ui 채택 (기존 D-007 "Tailwind-only 시작" 갱신 — D-013).

## 11. 개발 방향 (지금)

- Silmaril MVP **먼저**. NOU HAUS는 무시(확장 포인트만).
- 집중: **Thread · Connection · Atlas · Save · Collection · Exploration Loop.**
- **Atlas를 제품의 감정적 중심으로** 만든다.
