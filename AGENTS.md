# AGENTS.md — Codex 진입점

이 파일은 **Codex** 를 비롯한 에이전트의 진입점이다.

## 공유 프로토콜은 CLAUDE.md 에 있다

Silmaril의 모든 에이전트(Claude Code, Codex, 사람)는 **하나의 동일한 운영 규칙**을 따른다.
그 전문은 [`CLAUDE.md`](./CLAUDE.md) 에 있다.

> **먼저 [`CLAUDE.md`](./CLAUDE.md) 를 읽고 그대로 따른다.** 이 문서는 그 요약이자 안전망이다.

---

## 요약 (CLAUDE.md 를 읽지 못하는 경우의 최소 규칙)

**교대 모델**
- Claude Code ↔ Codex 가 번갈아 작업한다. 한쪽 이용량이 끝나면 다른 쪽이 이어받는다.
- 이어받는 기준: **`HANDOFF.md`(현재 상태) + `TASKS.md`(`## Now`)**.
- 교대는 git 으로. 끝낼 때 커밋(+push), 시작할 때 pull.
- 원격: https://github.com/auagna/Silmaril

**세션 시작 — 이 순서로 읽는다**
`README.md` → `DECISIONS.md` → `TASKS.md` → `HANDOFF.md` → `docs/product-spec.md` → `docs/data-model.md` → `docs/information-architecture.md` → `docs/supabase-schema.md`

**무엇을 할지**
- `TASKS.md` 의 `## Now` 에서 **체크 안 된 첫 항목 하나만** 진행한다.
- 한 번에 여러 기능 금지.

**작업 규칙**
- 기존 구조를 임의로 바꾸지 않는다 (확장은 OK, 재배치는 금지).
- Supabase 클라이언트는 `src/lib/supabase.ts`.
- API Key 를 코드에 넣지 않는다 — `.env.example` 만 갱신.
- 모호하면 `DECISIONS.md` 우선.

**세션 종료 — 반드시**
1. 완료 작업 `TASKS.md` 에 `[x]` 체크
2. `HANDOFF.md` 갱신 (끝낸 것 / 진행 중이던 정확한 위치 / 다음 할 일 / 변경 파일 / 실행 방법 / 주의·건드리면 안 되는 구조)
3. `CHANGELOG.md` 에 한 줄 추가
4. 빌드 가능한 상태로 커밋(+push). 커밋 접두사 `feat/docs/chore/fix`. 새 기능은 가급적 `feature/*` 브랜치.
5. 보고 형식: `Completed / Changed Files / How to Run / How to Test / Next Task / Handoff Updated`

**철학**
실마리는 하나, 관점은 여러 개, 기록은 자유롭게, 공식화는 검증 이후.
