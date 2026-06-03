// 그래프 레이아웃 모드 (PHASE 32). 같은 데이터, 정렬 기준만 다르게.
// web=자유 연결망 / focus=선택 중심 / flow=시간(가로) / branch=계보(세로).
// 완전한 그래프 엔진 아님 — 좌표 기반 단순 배치 + 모드 전환 시 안 깨지게.
import type { Thread } from "@/types/database";
import { connectionsOf } from "@/lib/dummy";

export type GraphLayoutMode = "web" | "focus" | "flow" | "branch";

export type Pos = { x: number; y: number };

function ring(cx: number, cy: number, r: number, ids: string[], out: Record<string, Pos>) {
  ids.forEach((id, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, ids.length) - Math.PI / 2;
    out[id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

export function computeLayout(
  mode: GraphLayoutMode,
  nodes: Thread[],
  selectedId: string | null,
  w: number,
  h: number,
): Record<string, Pos> {
  const out: Record<string, Pos> = {};
  const ids = nodes.map((n) => n.id);
  if (ids.length === 0) return out;
  const cx = w / 2;
  const cy = h / 2;
  const idSet = new Set(ids);

  if (mode === "focus") {
    const center = selectedId && idSet.has(selectedId) ? selectedId : ids[0];
    out[center] = { x: cx, y: cy };
    const neighbors = connectionsOf(center).map((c) => c.thread.id).filter((id) => idSet.has(id) && id !== center);
    const nset = new Set(neighbors);
    const outer = ids.filter((id) => id !== center && !nset.has(id));
    ring(cx, cy, Math.min(w, h) / 2 - 110, neighbors, out);
    ring(cx, cy, Math.min(w, h) / 2 - 48, outer, out);
    return out;
  }

  if (mode === "flow") {
    // 가로 = 순서(시간 근사), 세로 = 인덱스 밴드.
    const pad = 60;
    const span = Math.max(1, ids.length - 1);
    ids.forEach((id, i) => {
      out[id] = { x: pad + ((w - 2 * pad) * i) / span, y: cy + (i % 2 === 0 ? -1 : 1) * (h / 5) };
    });
    return out;
  }

  if (mode === "branch") {
    // 세로 계보: root 위, 나머지 행으로.
    out[ids[0]] = { x: cx, y: 56 };
    const rest = ids.slice(1);
    const perRow = 3;
    rest.forEach((id, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const rowCount = Math.min(perRow, rest.length - row * perRow);
      const colSpan = Math.max(1, rowCount - 1);
      const x = rowCount === 1 ? cx : 60 + ((w - 120) * col) / colSpan;
      out[id] = { x, y: 130 + row * 92 };
    });
    return out;
  }

  // web (기본): 첫 노드 중심 + 링.
  out[ids[0]] = { x: cx, y: cy };
  ring(cx, cy, Math.min(w, h) / 2 - 64, ids.slice(1), out);
  return out;
}
