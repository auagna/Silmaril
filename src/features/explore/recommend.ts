// 추천 키워드 이동 (PHASE 16). 클라이언트 mock 로직 — 추후 Supabase RPC/AI 로 교체.
// 우선순위: ①연결+추천+미방문 ②연결+미방문 ③전체 추천+미방문 ④전체 미방문 ⑤첫 번째.
import { threads, connectionsOf, recommendedIds } from "@/lib/dummy";

export function recommendNext(currentId: string | null, visited: Set<string>): string | null {
  const all = threads.map((t) => t.id);
  if (all.length === 0) return null;
  const rec = new Set(recommendedIds);

  const neighbors = currentId ? connectionsOf(currentId).map((c) => c.thread.id) : [];
  const unvisited = (ids: string[]) => ids.filter((id) => !visited.has(id) && id !== currentId);

  const p1 = unvisited(neighbors.filter((id) => rec.has(id)));
  if (p1.length) return p1[0];
  const p2 = unvisited(neighbors);
  if (p2.length) return p2[0];
  const p3 = unvisited(all.filter((id) => rec.has(id)));
  if (p3.length) return p3[0];
  const p4 = unvisited(all);
  if (p4.length) return p4[0];
  return all[0];
}
