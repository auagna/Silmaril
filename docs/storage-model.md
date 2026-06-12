# Storage Model — Markdown-first (Roadmap V2 · D-021)

> **Silmaril은 DB 중심 위키가 아니다.**
> Silmaril은 **파일 기반 개인 아카이브 위에 탐험 UI를 얹는 Knowledge Exploration Interface**다.
> 정본 결정: [DECISIONS D-021](../DECISIONS.md). 관련: [erd.md](./erd.md) · [canonical-knowledge-model.md](./canonical-knowledge-model.md).

---

## 1. Markdown-first 저장 철학

```
사용자 기록
↓
Markdown 파일 생성 (파일명은 사용자 기준)
↓
Silmaril이 읽어서 Map / Archive / My View로 표현
```

| 레이어 | 역할 | 비유 |
|---|---|---|
| **Markdown 파일** | **원본.** 기록의 단일 진실 공급원 | Obsidian Vault / GitHub repo |
| **Supabase** | 동기화 · 공유 · 검색 · **관계 색인** | 검색엔진의 인덱스 |
| **Silmaril UI** | 표현 (Map/Atlas/Archive/My View) | 탐험 인터페이스 |

**DB는 "원본"이 아니라 "색인"이다.** 이 구조의 장점:

1. 사용자가 데이터를 소유한다.
2. Obsidian처럼 오래 보관 가능하다.
3. GitHub로 백업 가능하다.
4. 실마릴이 망해도 기록은 남는다.
5. 개인 기준 파일명이 허용된다.
6. Atlas는 파일을 읽어 시각화한다 — UI는 언제든 다시 만들 수 있다.

---

## 2. Vault 구조

```
SilmarilVault/
├── People/
│   └── Tadao_Ando.md
├── Works/
│   └── Church_of_the_Light.md
├── Concepts/
│   └── Light.md
├── Materials/
│   └── Concrete.md
├── Perspectives/
│   └── 2026-06-10_Ando_Light.md
└── Collections/
    └── Light_and_Silence.md
```

- 폴더 구조는 **권장 기본값**이며 강제가 아니다. (타입별 폴더 = thread type과 1:1 대응이 기본.)
- 폴더를 무시하고 한 폴더에 모두 넣어도 동작해야 한다 — **구조 정보는 폴더가 아니라 frontmatter가 가진다.**

---

## 3. 파일명 정책

**사용자가 정한 파일명이 우선한다.** 예:

```
빛과 침묵에 대한 안도 생각.md
안도다다오_빛_콘크리트.md
2026-06-10_빛의교회_메모.md
```

규칙:

1. **Silmaril은 파일명을 강제하지 않는다.** 한국어·공백·자유 형식 모두 허용.
2. 시스템이 손대는 것은 **OS 금지 문자 제거뿐** (`\ / : * ? " < > |` → 공백 치환 후 정리).
3. **파일명은 식별자가 아니다.** 식별자는 frontmatter의 `id`. 파일명이 바뀌어도 연결은 깨지지 않는다.
4. 사용자가 파일명을 안 정하면 기본값을 제안한다: 관점 = `{날짜}_{제목}.md`, 실마리 = `{제목}.md`.

---

## 4. YAML frontmatter 규칙

파일명이 자유인 대신, **구조화 데이터는 frontmatter가 잡는다.**

```markdown
---
id: note_20260610_001
type: perspective
related_threads:
  - tadao-ando
  - light
  - concrete
visibility: private
created_at: 2026-06-10
---

나는 안도 다다오에서 건축보다 빛을 먼저 본다.
```

공통 필드:

| 필드 | 필수 | 의미 |
|---|---|---|
| `id` | ✅ | 전역 식별자 (파일명 아님) |
| `type` | ✅ | `thread` · `perspective` · `record` · `collection` |
| `related_threads` | 권장 | 연결된 실마리 slug 목록 — **연결선의 원천** |
| `visibility` | 권장 | `private`(기본) · `public` |
| `created_at` | 권장 | `YYYY-MM-DD` |

타입별 추가 필드:

| type | 추가 필드 |
|---|---|
| `thread` | `thread_type`(person/work/…) · `status` · (선택) `subtype`, `year` |
| `perspective` | `locale` · `author_type`(user/curator) |
| `collection` | `items`(thread slug 목록) |

원칙: **frontmatter = 기계가 읽는 구조, 본문 = 사람이 쓰는 자유 텍스트.** 본문 형식은 어떤 것도 강제하지 않는다.

---

## 5. Supabase와 파일의 역할 분리

| 데이터 | 원본 | Supabase의 역할 |
|---|---|---|
| 개인 기록·관점 (records/viewpoints) | **Markdown 파일** | 동기화 사본 + 공유(visibility=public) + 검색 색인 |
| 실마리 본문 (threads/translations) | 공유 지식 — 당분간 DB가 사실상 원본, **단 전체가 Markdown export 가능해야** | canonical 저장 + 병합(merged) 관리 |
| 연결 (thread_connections) | frontmatter `related_threads` + 큐레이션 연결 | **관계 색인** — 그래프 질의는 DB가 담당 |
| 북마크·활동 (bookmarks/activity) | 행동 로그 — DB 네이티브 | 탐험률·추천의 입력 |

동기화 방향(v0.3+): **파일 → DB 단방향이 기본.** 파일이 진실이고 DB는 따라온다. (DB에서 받는 것은 공유/공식 콘텐츠뿐.) 충돌 시 파일 우선.

---

## 6. MVP(v0.1) 적용 범위

iPhone에서 로컬 파일 시스템 + GitHub 동기화를 처음부터 구현하면 복잡하다. **v0.1은 sync를 구현하지 않는다.** 대신:

1. **모든 record / perspective / thread는 Markdown export 가능한 구조로 설계한다.**
2. 구현체: [`src/features/vault/markdown.ts`](../src/features/vault/markdown.ts) — frontmatter 직렬화/파싱 + `threadToMarkdown` / `viewpointToMarkdown` + 사용자 파일명 보존(`exportFileName`). 라운드트립 테스트로 보장.
3. **새 기능 설계 체크리스트:** "이 데이터는 Markdown 파일 하나로 떨어지는가?" 떨어지지 않는 구조(예: UI 상태와 뒤섞인 기록)는 만들지 않는다.

---

## 7. 향후 단계 (GitHub / Obsidian sync 계획)

| 버전 | 내용 | 기술 과제 |
|---|---|---|
| **v0.1** | Supabase 저장 + **Markdown export 구조** (지금) | `vault/markdown.ts` · 공유시트로 .md 내보내기 |
| **v0.2** | 앱 내부 Vault 도입 — 기록이 실제 .md 파일로 저장 | `expo-file-system` · Vault 인덱싱/스캔 |
| **v0.3** | GitHub sync / Obsidian 호환 export | git 동기화(REST or isomorphic-git) · 충돌 정책(파일 우선) · iCloud 폴더 옵션 |
| **v1.0** | **파일 기반 저장 = 기본 철학** — DB는 완전한 색인으로 | 마이그레이션 도구(DB→Vault 일괄 export) |
