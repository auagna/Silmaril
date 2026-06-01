# MVP Feature Matrix

> 정본: [silmaril-v2-direction.md](./silmaril-v2-direction.md). 스택: Expo RN + Supabase (D-014).

## Must Have (MVP v0.1)

| 기능 | 비고 |
|------|------|
| Supabase Auth | 이메일 기반 |
| Thread 검색 | 타입 필터 (인물/작품/사조/장소/개념/조직) |
| Thread 상세 | 연결 먼저, 본문 접힘 |
| Thread 저장 | **1초 안에.** save-first 핵심 |
| Records 탭 | 저장/기록/컬렉션 |
| 기본 Collection | 담기 + 보기 |
| 기본 Connection 표시 | 상세에서 연결 리스트 |
| 기본 Explore / Atlas 화면 | 키워드 탭 + 스와이프, 가벼운 노드/카드 |
| **미발견 실마리 표시** | 추천 아님 — 미지의 흔적. (`???`/`Fog`/`Locked` 금지) |
| 사용자 프로필 | 통계 + 자리 |

## Should Have

- 짧은 기록 (가볍게 — 선택)
- 이미지 없는 기본 카드 UI
- 기본 취향 키워드 표시
- 최근 저장 기반 추천

## Could Have

- 큐레이터 관점 (perspectives)
- SNS 공유 카드
- AI 취향 분석
- 고급 그래프

## Won't Have (MVP)

- NOU HAUS 클래스
- 코치 시스템
- 3D 지구본 (Globe)
- 유료 Pro / 결제
- 고급 AI 추천
- 커뮤니티 검토 시스템

## 핵심 UX 게이트 (MVP 합격 기준)

1. 저장이 **1초** 안에 된다.
2. 기록 없이도 저장·탐험만으로 지도가 자란다.
3. 그래프는 메인이 아니라 Atlas의 한 보기.
4. "정보 정리"가 아니라 **"내 세계를 밝힌다"** 는 느낌.
5. 미발견 영역을 유치하게(`???`) 표현하지 않는다.
6. 문구는 **Toss처럼 짧게.**
7. 디자이너가 보기 싫은 릴스형 UI 금지. 정보성 콘텐츠를 찾는 사용자임을 명심.
8. Cosmos처럼 이미지 중심이되, **연결과 맥락**을 반드시 보여준다.
