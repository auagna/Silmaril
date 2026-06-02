# CHANGELOG

> 교대(Claude Code ↔ Codex) 작업의 시간순 기록. 단일 기준점은 GitHub. 최신이 위.

## 2026-06-02

### Changes
- docs: thread-taxonomy 타입별 5항 보강 + 신규 `docs/canonical-knowledge-model.md`·`docs/seed-dataset-strategy.md` (개념 허브, AI-seed 시드 전략).
- chore: `bookmarks`·`user_thread_activity` 에 `id` PK 추가(+unique 유지). CHANGELOG 정비, 운영 규칙(브랜치/리포트 형식/CHANGELOG)을 CLAUDE/AGENTS 에 반영.
- feat(EXP-DB): MVP Supabase 스키마 `supabase/schema.sql` — 9테이블 + 4 enum + 인덱스 + 트리거(handle_new_user/set_updated_at). RLS·AI Wiki·perspectives 제외. `docs/erd.md` 동기화.

### Verification
- Expo RN MVP scaffold: `npm run typecheck` passed.
- Expo public config: `npx expo config --type public` passed.
- Expo Go physical-device smoke test remains pending. LAN Metro startup was blocked while fetching Expo SDK metadata with `write ECONNABORTED`.

## 2026-06-01

- feat(EXP1-3): Expo RN 스캐폴드 — Expo Router 5탭 + auth + thread/[id], Supabase client(AsyncStorage), 타입, theme, 더미 화면. (`9ada9aa`)
- chore(EXP0): Next.js 웹 MVP → `legacy-web/` 아카이브, 루트는 Expo. (`0bbd089`)
- docs(mvp): Expo RN MVP 기획 문서 + 스택 전환 D-014 (roadmap/taxonomy/feature-matrix/erd/api-spec). (`76e6473`)
- docs(v2): Atlas 중심 방향 전환 + 와이어프레임 v2, Fog→"미발견" (D-013/D-015). (`cf64486`)
- docs(ux): UX Research Sprint + UX Principles v1. (`201887d`)
- docs(wireframe): W1 모바일 와이어프레임 v1. (`325e3a2`)
- feat(threads/auth): Create Thread + 클라이언트 인증 (웹, D-010/D-011). (`725b3e5`, `bac5758`)
- chore: 교대 프로토콜 + MVP 스캐폴드. (`e1acf80`, `79dfc62`)
