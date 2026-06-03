# Thread Taxonomy v1

> Thread = 실마리 = 탐험의 단위. **실마리는 하나, 관점은 여러 개.** (같은 대상에 페이지 둘 ❌)
> 정본 방향: [silmaril-v2-direction.md](./silmaril-v2-direction.md) · 스키마: [erd.md](./erd.md).

> **PHASE 29 — Node Type System v1 적용:** 타입 확장 = MVP 우선 `person·movement·work·material·concept·emotion` + 보조 `form·place·era` + 호환 `organization`. `subtype`(보조 분류) 필드 추가. (type=큰 분류=시각/탐구 기준, subtype/태그=세부.) 아래 6종 설명은 기본 골격이며 material/emotion/form/era 는 같은 규칙을 따른다.

## MVP Thread Types (확장: Node Type System v1)

`person · movement · work · material · concept · emotion` (+ 보조 `form · place · era`, 호환 `organization`)

> 공통 필수 필드(모든 타입): `title`, `type`, `slug`(자동), `status`(기본 local), `created_by`.
> 공통 권장: `summary`(한 줄), `description`, `cover_image_url`.
> 타입별 구조화 메타데이터(생몰년, 제작연도 등)는 MVP 스키마에 별도 컬럼을 두지 않고 `description`/연결로 표현 — 구조화는 추후(JSONB).

---

### 1. person — 인물

1. **정의:** 한 사람(창작자·사상가·인물).
2. **예시:** 디터 람스, 안도 타다오, 루이스 칸, 발터 그로피우스.
3. **필수 필드:** 공통 필수 + `summary`(누구이며 왜 중요한가 한 줄). 권장: `cover_image_url`.
4. **연결 가능한 타입:** work(`created`), movement/concept(`belongs_to`,`influenced_by`), organization(`member_of`), place(`located_in`), person(`contemporary_of`,`influenced_by`).
5. **MVP 포함 이유:** 가장 직관적인 탐험 출발점. "누구"에서 사조·개념으로 뻗어나간다.

### 2. work — 작품

1. **정의:** 구체적 산출물(건축물·제품·디자인·저작).
2. **예시:** Braun SK4, 빛의 교회, 롱샹 성당.
3. **필수 필드:** 공통 필수 + `summary`. 권장: `cover_image_url`(시각 중심).
4. **연결 가능한 타입:** person(`created` 역방향), movement/concept(`belongs_to`), place(`located_in`), work(`derived_from`).
5. **MVP 포함 이유:** 취향은 결국 구체적 작품에서 시작/검증된다. 이미지 중심 카드의 핵심.

### 3. movement — 사조

1. **정의:** 흐름·운동·양식·학파.
2. **예시:** 바우하우스, 모더니즘, 브루탈리즘.
3. **필수 필드:** 공통 필수 + `summary`(무엇을 지향한 흐름인가).
4. **연결 가능한 타입:** person(`member_of`), movement/concept(`influenced_by`,`derived_from`), place(`located_in`), work(`belongs_to` 역방향).
5. **MVP 포함 이유:** 인물·작품을 묶는 상위 맥락. 탐험의 "지역"을 형성한다.

### 4. place — 장소

1. **정의:** 지역·도시·건축물 위치·문화권.
2. **예시:** 데사우, 베를린, 나오시마.
3. **필수 필드:** 공통 필수 + `summary`. 권장: `cover_image_url`.
4. **연결 가능한 타입:** place(`located_in` 상위 지역), person/movement/work/organization(`related_to`,`located_in` 역방향).
5. **MVP 포함 이유:** Atlas의 Culture Map / 탐험률("일본 건축 32%")의 축. 문화적 탐험을 지리로 정박.

### 5. concept — 개념 ⭐

1. **정의:** 추상적 주제·가치·이론.
2. **예시:** **빛 · 침묵 · 구조 · 물성 · 여백 · 현상학 · 기능주의.**
3. **필수 필드:** 공통 필수 + `summary`(이 개념이 무엇을 뜻하는가). cover 없을 수 있음(이미지 없는 기본 카드 OK).
4. **연결 가능한 타입:** person/work/movement(`belongs_to`,`related_to`), concept(`derived_from`,`influenced_by`).
5. **MVP 포함 이유:** **반드시 포함.** 사용자가 실제로 좋아하는 건 인물·작품보다 *개념*일 수 있다. "나는 왜 이것을 좋아하는가"(안도 타다오→루이스 칸→스카르파의 공통분모 = **빛/침묵**)를 답하는 핵심 축. 개념이 있어야 연결이 의미를 갖는다.

### 6. organization — 조직

1. **정의:** 단체·학교·집단·스튜디오.
2. **예시:** 바우하우스(학교), 브라운(기업적 성격이나 MVP에선 organization로), CIAM.
3. **필수 필드:** 공통 필수 + `summary`.
4. **연결 가능한 타입:** person(`member_of` 역방향), place(`located_in`), movement(`belongs_to`).
5. **MVP 포함 이유:** 인물·작품이 모이는 제도적 맥락. (company 와 겹칠 수 있으나 MVP는 organization 하나로 흡수.)

---

## 추후 확장 Types

`event` (사건) · `company` (기업) · `book` (책) · `film` (영화) · `music` (음악) · `media` (매체)

> `thread_type` enum 에 나중에 추가 (스키마 호환 유지). MVP는 6종.

## 규칙

1. **중복 금지.** 같은 대상은 하나의 thread. 표기 변형은 `aliases`(추후 컬럼). 중복은 `merged_into_thread_id` 로 흡수.
2. **타입은 단일.** 겹치면 주된 것 하나 + connection 으로 연결 (예: 바우하우스 movement ↔ organization).
3. **AI-seed 우선.** 초기 타입 분류는 AI Wiki 가 시드, 유저가 보정 (D-013). 자세히는 [seed-dataset-strategy.md](./seed-dataset-strategy.md).
4. **개념을 적극 생성.** 인물/작품만 있고 개념이 없으면 탐험이 얕아진다 → [canonical-knowledge-model.md](./canonical-knowledge-model.md).

## 사용자 노출 (Search 타입 필터)

인물 · 작품 · 사조 · 장소 · **개념** · 조직
