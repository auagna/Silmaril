// MVP 더미 데이터. Supabase 실연결 전 UI 구동용. (EXP4에서 service 로 대체)
import type { Thread, ThreadConnection, RelationKind, ThreadType } from "@/types/database";

function t(
  id: string,
  title: string,
  type: ThreadType,
  summary: string,
  origin: Thread["origin"] = "ai",
): Thread {
  return {
    id,
    slug: id,
    title,
    aliases: [],
    type,
    summary,
    body: null,
    cover_url: null,
    status: "community",
    origin,
    created_by: "seed",
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  };
}

export const threads: Thread[] = [
  t("ando-tadao", "안도 타다오", "person", "빛과 노출 콘크리트로 침묵의 공간을 짓는 건축가."),
  t("louis-kahn", "루이스 칸", "person", "빛을 구조의 본질로 다룬 건축가."),
  t("carlo-scarpa", "카를로 스카르파", "person", "디테일과 물성의 시인."),
  t("light", "빛", "concept", "공간을 드러내고 침묵을 만드는 근본 재료."),
  t("silence", "침묵", "concept", "비움으로 채우는 건축적 정서."),
  t("phenomenology", "현상학", "movement", "경험과 지각으로 세계를 보는 사조."),
  t("bauhaus", "바우하우스", "movement", "교육 혁명이자 산업화의 산물."),
  t("dessau", "데사우", "place", "바우하우스 교사가 있는 독일 도시."),
  t("dieter-rams", "디터 람스", "person", "좋은 디자인 10원칙. 기능주의의 윤리."),
  t("braun-sk4", "Braun SK4", "work", "백설공주의 관 — 모더니즘 산업디자인의 상징."),
];

export const connections: ThreadConnection[] = [
  conn("ando-tadao", "louis-kahn", "influenced_by"),
  conn("ando-tadao", "light", "belongs_to"),
  conn("ando-tadao", "silence", "belongs_to"),
  conn("louis-kahn", "light", "belongs_to"),
  conn("carlo-scarpa", "ando-tadao", "contemporary_of"),
  conn("ando-tadao", "phenomenology", "related_to"),
  conn("dieter-rams", "braun-sk4", "created"),
  conn("dieter-rams", "bauhaus", "influenced_by"),
  conn("bauhaus", "dessau", "located_in"),
];

function conn(from: string, to: string, relation: RelationKind): ThreadConnection {
  return {
    id: `${from}__${to}`,
    from_thread: from,
    to_thread: to,
    relation,
    note: null,
    origin: "ai",
    created_by: "seed",
    created_at: "2026-06-01T00:00:00Z",
  };
}

// 사용자가 "저장한" 더미 실마리 (Atlas에서 밝혀진 노드).
export const savedIds = ["ando-tadao", "louis-kahn", "light"];

export function getThreadById(id: string): Thread | undefined {
  return threads.find((x) => x.id === id || x.slug === id);
}

export function searchThreads(q: string, type?: ThreadType): Thread[] {
  const ql = q.trim().toLowerCase();
  return threads.filter(
    (x) =>
      (!type || x.type === type) &&
      (ql === "" || x.title.toLowerCase().includes(ql) || (x.summary ?? "").toLowerCase().includes(ql)),
  );
}

export function connectionsOf(threadId: string): { thread: Thread; relation: RelationKind }[] {
  const out: { thread: Thread; relation: RelationKind }[] = [];
  for (const c of connections) {
    if (c.from_thread === threadId) {
      const th = getThreadById(c.to_thread);
      if (th) out.push({ thread: th, relation: c.relation });
    } else if (c.to_thread === threadId) {
      const th = getThreadById(c.from_thread);
      if (th) out.push({ thread: th, relation: c.relation });
    }
  }
  return out;
}

// "미발견" = 저장한 실마리의 이웃 중 아직 저장 안 한 것. (UI 용어: 미발견 / 새로운 흔적)
export function undiscovered(): Thread[] {
  const seen = new Set(savedIds);
  const out = new Map<string, Thread>();
  for (const id of savedIds) {
    for (const { thread } of connectionsOf(id)) {
      if (!seen.has(thread.id)) out.set(thread.id, thread);
    }
  }
  return [...out.values()];
}

// Atlas/Explore 진행률 (더미). 사용자 노출: "일본 건축 32%" 식.
export const exploreProgress = [
  { label: "빛 / 침묵", pct: 38 },
  { label: "일본 건축", pct: 32 },
  { label: "기능주의", pct: 18 },
];
