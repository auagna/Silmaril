// MVP 더미 데이터. Supabase 실연결 전 UI 구동용. (EXP4에서 service + seed 로 대체)
// 스키마(supabase/schema.sql)와 동일 필드명.
import type { Thread, ThreadConnection, RelationType, ThreadType, ConnectionTier } from "@/types/database";

function t(id: string, title: string, type: ThreadType, summary: string): Thread {
  return {
    id,
    title,
    slug: id,
    type,
    summary,
    description: null,
    cover_image_url: null,
    status: "community",
    created_by: null,
    trust_score: 0,
    completion_score: 0,
    merged_into_thread_id: null,
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

function conn(from: string, to: string, relation_type: RelationType, tier: ConnectionTier): ThreadConnection {
  return {
    id: `${from}__${to}`,
    from_thread_id: from,
    to_thread_id: to,
    relation_type,
    connection_tier: tier,
    description: null,
    created_by: null,
    status: "community",
    trust_score: 0,
    created_at: "2026-06-01T00:00:00Z",
  };
}

export const connections: ThreadConnection[] = [
  conn("louis-kahn", "ando-tadao", "influenced", 1), // 사실
  conn("ando-tadao", "light", "related_to", 2), // 해석
  conn("ando-tadao", "silence", "related_to", 2),
  conn("louis-kahn", "light", "related_to", 2),
  conn("carlo-scarpa", "ando-tadao", "contemporary_of", 1),
  conn("ando-tadao", "phenomenology", "shares_theme", 2),
  conn("dieter-rams", "braun-sk4", "created", 1),
  conn("dieter-rams", "bauhaus", "influenced_by", 1),
  conn("bauhaus", "dessau", "located_in", 1),
];

// 사용자가 "저장한" 더미 실마리.
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

export function connectionsOf(
  threadId: string,
): { thread: Thread; relation_type: RelationType; tier: ConnectionTier }[] {
  const out: { thread: Thread; relation_type: RelationType; tier: ConnectionTier }[] = [];
  for (const c of connections) {
    if (c.from_thread_id === threadId) {
      const th = getThreadById(c.to_thread_id);
      if (th) out.push({ thread: th, relation_type: c.relation_type, tier: c.connection_tier });
    } else if (c.to_thread_id === threadId) {
      const th = getThreadById(c.from_thread_id);
      if (th) out.push({ thread: th, relation_type: c.relation_type, tier: c.connection_tier });
    }
  }
  return out;
}

// "미발견" = 저장한 실마리의 이웃 중 아직 저장 안 한 것. (UI: 미발견 / 새로운 흔적)
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
