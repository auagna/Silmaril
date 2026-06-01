# Thread Taxonomy v1

> Thread = 실마리 = 탐험의 단위. **실마리는 하나, 관점은 여러 개.** (같은 대상에 페이지 둘 ❌)
> 정본 방향: [silmaril-v2-direction.md](./silmaril-v2-direction.md).

## MVP Thread Types (6)

| type | 한국어 | 정의 | 예시 |
|------|--------|------|------|
| `person` | 인물 | 사람 | 디터 람스, 안도 타다오, 루이스 칸 |
| `work` | 작품 | 구체적 산출물 | Braun SK4, 빛의 교회, 롱샹 성당 |
| `movement` | 사조 | 흐름·운동·양식 | 바우하우스, 모더니즘, 브루탈리즘 |
| `place` | 장소 | 지역·도시·건축물 위치 | 데사우, 베를린, 나오시마 |
| `concept` | 개념 | 추상적 주제·가치·이론 | **빛 · 침묵 · 구조 · 물성 · 여백 · 현상학 · 기능주의** |
| `organization` | 조직 | 단체·학교·집단 | 바우하우스(학교), CIAM |

### ⭐ `concept` 은 반드시 포함한다

실마릴에서 사용자가 **실제로 좋아하는 것은 인물·작품보다 *개념*일 수 있다.**
> 안도 타다오 → 루이스 칸 → 카를로 스카르파 로 이어지는 진짜 실마리는 **"빛"** 또는 **"침묵"** 이라는 개념이다.

`concept` 이 있어야 "나는 왜 이것을 좋아하는가"를 탐험할 수 있다. Atlas의 연결이 개념을 통해 풍부해진다.

## 추후 확장 Types

`event` (사건) · `company` (기업) · `book` (책) · `film` (영화) · `music` (음악) · `media` (매체)

> MVP는 6종으로 시작. 확장 타입은 `threads.type` enum 에 나중에 추가 (스키마 호환 유지).

## 규칙

1. **중복 금지.** 같은 대상은 하나의 thread. 중복은 추후 `merged` 로 흡수 (future).
2. **타입은 단일.** 한 thread 는 하나의 type. (바우하우스가 movement이자 organization이면 → 둘 다 만들지 말고 주된 것 하나 + connection으로 연결.)
3. **AI-seed 우선.** 초기 thread/타입 분류는 AI Wiki 가 시드, 유저가 보정 (D-013).
4. **표기 변형은 `aliases`** 로 (예: Dieter Rams ↔ 디터 람스). slug 는 하나.

## 사용자 노출 (Search 타입 필터)

인물 · 작품 · 사조 · 장소 · **개념** · 조직
