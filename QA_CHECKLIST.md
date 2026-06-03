# QA Checklist (MVP)

> 실행: `npm test` (jest, 순수 로직 단위 테스트) · `npm run typecheck` · `npx expo export --platform ios`(번들).
> 기기: 아이폰 Expo Go (`npx expo start -c`). Windows 개발 PC엔 iOS 시뮬레이터 없음.

## 자동 (단위 테스트 — `npm test`)
- [x] confidence score (소스 점수·다중 가산·URL 감점·namuwiki 자동승인 금지)
- [x] translation fallback (locale → ko → en → canonical)
- [x] recommendNext 우선순위(연결·미방문·추천)
- [x] connectionsOf 양방향 + relation_type/tier
- [x] undiscovered = 저장 제외
- [x] computeLayout 4모드 좌표 + focus 중심
- [ ] (추후) archive add/remove · ingestion dedupe · search

## 수동 (Expo Go) — 핵심 플로우
1. [ ] 앱 실행 → 지도(Map) 진입
2. [ ] 노드 탭 → Bottom Sheet(Land) 내용 변경
3. [ ] ★추천 → 연결 노드로 이동 + active
4. [ ] 저장(1탭) → Archive(보관)에 반영
5. [ ] 검색(⌕) → 결과 선택 → Map focus
6. [ ] 타입 필터(인물/재료/감정…) 강조/비강조
7. [ ] 레이아웃 모드(맥락/집중/시간/계보) 전환 — 안 깨짐, selected 유지
8. [ ] 만들기(Create) 폼 입력 → 제출(목) 알림
9. [ ] My View 통계/언어토글/로그인 상태
10. [ ] ko ↔ en 전환 — UI + 노드/카드 텍스트
11. [ ] Day ↔ Night (기기 설정) — 대비 충분
12. [ ] 노드 타입별 아이콘(●⬡■◆▬◌…) 표시
13. [ ] 연결선 — 선택 노드 관계 강조

## 빌드/검증 게이트
- [ ] `npm run typecheck` 통과
- [ ] `npx expo export --platform ios` 번들 성공
- [ ] `npm test` 전부 통과

## 아직 테스트 못 한 영역 (미구현/환경)
- Supabase 실연결(실데이터)·Auth E2E·RLS — 스키마+seed 적용 후.
- Source/AI ingestion 실수집 — 법무 검토 후.
- pan/zoom · web/tablet · 컴포넌트 e2e — 추후.
