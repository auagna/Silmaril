# UX Research — Sprint 3: 컬렉션 (Collections)

> 컬렉션은 실마릴의 **리텐션 핵심**이다. "어떻게 컬렉션이 *팔로우할 만큼* 가치 있어지는가?"

## 연구 질문

- 저장(save)이 어떻게 좋아요보다 강한 행동이 되는가?
- 컬렉션이 어떻게 따라갈(follow) 가치를 갖는가?
- 만든 사람의 동기 / 발견 루프는?

## 증거 (Lazyweb 검색 결과 → 실제 앱)

| 쿼리 | 떠오른 실제 앱 (발췌) |
|------|----------------------|
| `saved collection board` | **are:na**(반복), **savee**, github, opensea |
| `moodboard grid` | **milanote**, **savee**, origami, goat |
| `bookmarks saved items` | **instapaper**, **pinboard**, glass, perplexity |
| `reading list highlights` | **reader**(Readwise), **goodreads**(반복), craft, libby |

지목 레퍼런스: Are.na · Pinterest · Letterboxd Lists · Cosmos · Readwise Highlights.
→ are:na·savee·milanote(비주얼 보드) + goodreads·reader(읽기/하이라이트) 두 계열이 뚜렷.

## 추출한 UX 패턴

8. **컬렉션 = 정체성/취향의 단위 (Are.na 채널, Letterboxd 리스트, savee).** "이름 붙은 컬렉션에 담기"가 핵심 동사 — 좋아요보다 강하다.
9. **모으기보다 *짓기* (Are.na "connect").** 이미 관련 블록이 있는 채널에 담으면 "짓고 있다"는 감각이 생긴다. 팔로우 가능한 컬렉션이 발견 루프를 만든다.
10. **한 탭 저장, 정리는 나중 (Pinterest/mymind).** 저장을 절대 막지 않는다 — 분류는 지연. (실마릴 "생성에 브레이크 금지" 철학과 일치.)

## 강점

- 컬렉션은 *큐레이터의 작품*이 된다 (Are.na 채널을 작품처럼 본다) → 만들 동기 + 팔로우 동기.
- Readwise/Goodreads: 저장이 곧 "나중의 나에게 주는 자료" → 저장이 소비가 아니라 투자.

## 약점 / 안티패턴

- **하트만 누르고 끝 (인스타형).** 좋아요는 휘발 — 지도에 아무것도 안 남는다 (문제 3).
- 폴더가 너무 무거우면(분류 강제) 저장 자체를 안 한다 (Pinterest 초기 학습).
- 컬렉션이 비공개·고립되면 발견 루프가 죽는다.

## 실마릴 적용 (문제 매핑)

- **문제 3 (좋아함 → 기록 안 함):**
  - **저장(bookmark)을 1급 동사로, 한 탭.** 좋아요는 부차.
  - 저장 시 "컬렉션에 담기"를 가볍게 제안하되 강제하지 않음 (담을 곳 없으면 그냥 저장).
  - 탐험자는 기록 없이 저장·연결만으로도 자기 지도가 자란다 (UX 원칙).
- **리텐션:** "이 실마리는 당신의 *바우하우스 입문* 컬렉션의 항목들과 연결됩니다" 식의 *짓는 감각* 알림.
- 공개 컬렉션 + 팔로우 → 큐레이터 발견 루프 (Sprint 4와 연결).
