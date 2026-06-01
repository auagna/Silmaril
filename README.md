# Silmaril

> 연결된 실마리를 따라 탐험하며 자신의 취향을 발견하고, **Atlas**(개인 탐험 지도)를 지어 미지의 세계를 밝혀 가는 지식 탐험 플랫폼.
>
> 📍 **제품 방향 정본: [docs/silmaril-v2-direction.md](docs/silmaril-v2-direction.md)** (Atlas · Fog · AI-seed · save-first).

Silmaril은 인물 / 작품 / 사조 / 장소 / 사건을 하나의 **실마리(Thread)** 로 다루고,
그 실마리들 사이의 **연결(Connection)** 을 따라가며 사용자가 자신만의 지식 지도를 만들도록 돕는다.

위키는 정답을 보여 주고, Letterboxd는 감상을 모아 주지만, Silmaril은 그 사이를 잇는다.
하나의 실마리에는 여러 **관점(Perspective)** 이 붙고, 사용자는 그 위에 자유롭게 **기록(Record)** 한다.

---

## 핵심 철학

- **실마리는 하나다.** 같은 대상에 대한 페이지는 하나만 존재한다.
- **관점은 여러 개다.** 하나의 실마리 위에 서로 다른 해석이 공존한다.
- **기록은 자유롭게 가능해야 한다.** 사용자의 생성 흐름에 브레이크를 걸지 않는다.
- **공식화는 생성의 조건이 아니라 검증 이후의 상태다.**
- **좋아요보다 저장과 연결이 중요하다.**
- **파트너 큐레이터는 권력자가 아니라 명예 배지를 받은 사용자다.**

## 핵심 개념

| 개념 | 정의 |
|------|------|
| `Thread` | 탐험 단위. 인물 / 작품 / 사조 / 장소 / 사건 / 책 / 영화 등 |
| `Perspective` | 한 실마리에 대한 관점 — 같은 대상에 대한 서로 다른 해석 |
| `Record` | 사용자의 개인 기록 — 특정 실마리에 연결될 수 있음 |
| `Connection` | 실마리 ↔ 실마리 관계 (영향, 출처, 소속, 동시대 등) |
| `Collection` | 실마리 묶음 — 사용자가 만든 큐레이션 |

## 기술 스택

- **Next.js** (App Router, TypeScript)
- **Supabase** (Postgres, Auth, RLS)
- **Tailwind CSS**
- **React Flow** (지도 그래프 뷰)
- **Vercel** 배포 가능 구조

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 에 Supabase URL / anon key 입력

# 3. Supabase 스키마 적용
# Supabase 프로젝트의 SQL Editor 에서:
#   - supabase/schema.sql 실행
#   - supabase/policies.sql 실행

# 4. 개발 서버 실행
npm run dev
```

http://localhost:3000 접속.

## 디렉토리 구조

```
README.md                  — 이 문서
TASKS.md                   — 작업 백로그
DECISIONS.md               — 의사결정 로그
HANDOFF.md                 — 다음 세션을 위한 핸드오프 문서
docs/
  product-spec.md          — 제품 명세
  data-model.md            — 도메인 모델
  information-architecture.md — 정보 구조 / 라우팅
  supabase-schema.md       — 스키마 해설
supabase/
  schema.sql               — 테이블 DDL
  policies.sql             — RLS 정책
src/
  app/                     — Next.js App Router 라우트
  components/              — 재사용 UI 컴포넌트
  features/
    threads/               — 실마리 도메인
    perspectives/          — 관점 도메인
    records/               — 기록 도메인
    collections/           — 컬렉션 도메인
    map/                   — 지도 / 그래프 뷰
  lib/                     — 외부 클라이언트 (supabase 등)
  types/                   — TypeScript 도메인 타입
  utils/                   — 공용 유틸
```

## 라이센스

TBD.
