# UX Research — Sprint 1: 탐험 피드 (Exploration)

> Design with evidence, not vibes.
> 방법: Lazyweb(실제 출시 앱 스크린샷의 의미 검색) + 지목 레퍼런스의 도메인 분석.
> Lazyweb 한계: 스크린샷 검색이라 "행동 패턴"은 어떤 앱이 떠오르는지 + 그 앱의 알려진 UX로 추론한다.

## 연구 질문

사용자가 **계속 탐험하게** 만드는 UX는 무엇인가? (시각 스타일이 아니라 행동)
- curiosity loop / discovery / recommendation / collection browsing / knowledge exploration

## 증거 (Lazyweb 검색 결과 → 실제 앱)

| 쿼리 | 떠오른 실제 앱 (발췌) |
|------|----------------------|
| `explore browse grid` | **are:na**(반복), **savee**, glass, flipboard, glean, luma |
| `archive browsing` | **are:na**, the-new-yorker, the-atlantic, **notion**, reader(Readwise), perfectly-imperfect |
| `editorial homepage` | the-economist, financial-times, the-information, **medium**, artsy |
| `content discovery feed` | substack, product-hunt, matter, inoreader |

지목 레퍼런스: **Are.na · Letterboxd · Readwise Reader · Cosmos · Wikipedia · Pinterest**.
→ `are:na` 가 'explore'·'archive' 양쪽에서 반복 등장. **실마릴에 가장 가까운 제품임을 데이터가 재확인.**

## 추출한 UX 패턴

1. **블록 하나 = 탭 하나 (Are.na).** 모든 항목이 가벼운 진입점. 읽어야 하는 글이 아니라 "들어가 볼 수 있는 입구"로 제시 → 정보량에 안 눌린다.
2. **단 하나의 오늘의 앵커 (NYT/Economist/Substack).** 세션마다 큐레이션된 히어로 1개로 선택 마비를 없앤다. (실마릴 `오늘의 실마리` 이미 이 형태 — 강화할 것.)
3. **이어보기 트레일 (Readwise Reader/Letterboxd).** 돌아온 사용자에게 "이어서 탐험"을 먼저 보여 콜드스타트 제거.
4. **검색이 아니라 측면 연결로 발견 (Are.na connected channels).** 글로벌 피드를 들이붓지 말고 "이것이 연결된 것"을 보여준다 → 실마릴의 "연결 먼저" 철학과 직결.

## 강점

- 스캔 가능 / 저몰입 진입 → 이탈 줄고 체류↑ (Are.na, Pinterest).
- 에디토리얼 앵커는 "오늘 뭐 보지?" 비용을 0으로 (Economist, Substack).

## 약점 / 안티패턴

- **무한 추천 피드(소셜미디어형)** 는 탐험이 아니라 소비를 유발 → 저장/연결 동기 약화. (회피)
- 에디토리얼 카드가 너무 글-중심이면 다시 "안 읽음" 문제로 회귀 (the-atlantic류).

## 실마릴 적용 (문제 매핑)

- **문제 1 (정보량 많음 → 안 읽음):** 상세를 글벽으로 열지 말고 "연결된 실마리 + 한 줄 요약 카드"로 연다. 본문은 접어둔다.
- **문제 2 (탐험 → 길 잃음):** Home 상단 `이어서 탐험` 트레일 + 모든 상세에 "1-홉 이웃" 행 고정.
- 피드 정렬은 좋아요가 아니라 저장·연결·컬렉션 신호 (기존 결정 D-006 유지).
