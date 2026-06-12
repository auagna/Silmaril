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

// ─────────────────────────────────────────────────────────────
// 모드별 시드 + 핀(축 고정). 물리는 핀이 없는 축만 움직인다.
//  맥락(web) = 핀 없음(자유) · 시간(flow) = x 연도 고정 · 계보(branch) = y 세대 고정.
// ─────────────────────────────────────────────────────────────

// 시간(연도) — 시간 모드 가로축 기준. 없으면 자유(연결로 배치). thread id/slug 기준.
// 인물=출생, 사조=형성기, 작품=완공 근사. (정본 아님 — 탐험용 근사.)
export const THREAD_YEAR: Record<string, number> = {
  "mies-van-der-rohe": 1886,
  "le-corbusier": 1887,
  "tadao-ando": 1941,
  bauhaus: 1919,
  modernism: 1920,
  brutalism: 1950,
  minimalism: 1960,
  "barcelona-pavilion": 1929,
  "church-of-the-light": 1989,
};

export type Pin = { px: number | null; py: number | null };

type SimEdgeLite = { from_thread_id: string; to_thread_id: string; relation_type: string };

// 방향성 연결 → [부모, 자식]. (위=조상.)
function parentChild(rel: string, from: string, to: string): [string, string] | null {
  if (rel === "influenced" || rel === "created") return [from, to];
  if (rel === "derived_from" || rel === "belongs_to") return [to, from];
  return null; // related_to/shares_theme/located_in 등은 계층 아님
}

// 세대 깊이(longest-path) — 루트(부모 없음)=0. 사이클은 guard로 차단.
export function computeDepths(ids: string[], edges: SimEdgeLite[]): Record<string, number> {
  const idSet = new Set(ids);
  const children: Record<string, string[]> = {};
  ids.forEach((id) => (children[id] = []));
  for (const e of edges) {
    const pc = parentChild(e.relation_type, e.from_thread_id, e.to_thread_id);
    if (!pc) continue;
    const [p, ch] = pc;
    if (idSet.has(p) && idSet.has(ch)) children[p].push(ch);
  }
  const depth: Record<string, number> = {};
  ids.forEach((id) => (depth[id] = 0));
  let changed = true;
  let guard = 0;
  while (changed && guard < ids.length + 5) {
    changed = false;
    guard++;
    for (const p of ids) {
      for (const ch of children[p]) {
        if (depth[ch] < depth[p] + 1) {
          depth[ch] = depth[p] + 1;
          changed = true;
        }
      }
    }
  }
  return depth;
}

export function buildModeLayout(
  mode: GraphLayoutMode,
  nodes: Thread[],
  edges: SimEdgeLite[],
  w: number,
  h: number,
): { seed: Record<string, Pos>; pins: Record<string, Pin> } {
  const ids = nodes.map((n) => n.id);
  const seed: Record<string, Pos> = {};
  const pins: Record<string, Pin> = {};
  const padX = 46;
  const padY = 42;
  if (ids.length === 0) return { seed, pins };

  if (mode === "flow") {
    // 시간: 가로축 = 연도. 연도 있는 노드만 x 고정, 나머지는 자유(연결로 끌려감).
    const years = ids.map((id) => THREAD_YEAR[id]).filter((y): y is number => y != null);
    const minY = years.length ? Math.min(...years) : 1880;
    const maxY = years.length ? Math.max(...years) : 2000;
    const span = Math.max(1, maxY - minY);
    ids.forEach((id, i) => {
      const yr = THREAD_YEAR[id];
      const px = yr != null ? padX + ((w - 2 * padX) * (yr - minY)) / span : null;
      const sy = padY + ((h - 2 * padY) * ((i % 5) + 0.5)) / 5;
      seed[id] = { x: px ?? w / 2 + (i % 2 ? 26 : -26), y: sy };
      pins[id] = { px, py: null };
    });
    return { seed, pins };
  }

  if (mode === "branch") {
    // 계보: 세로축 = 세대 깊이(방향성 연결). x 는 자유.
    const depth = computeDepths(ids, edges);
    const maxD = Math.max(1, ...ids.map((id) => depth[id] ?? 0));
    const perRow: Record<number, number> = {};
    ids.forEach((id) => {
      const d = depth[id] ?? 0;
      const py = padY + ((h - 2 * padY) * d) / maxD;
      const idx = perRow[d] ?? 0;
      perRow[d] = idx + 1;
      seed[id] = { x: padX + 30 + ((idx * 74) % Math.max(1, w - 2 * padX - 60)), y: py };
      pins[id] = { px: null, py };
    });
    return { seed, pins };
  }

  // web(맥락): 자유 — computeLayout 시드, 핀 없음.
  const base = computeLayout("web", nodes, null, w, h);
  ids.forEach((id) => {
    seed[id] = base[id] ?? { x: w / 2, y: h / 2 };
    pins[id] = { px: null, py: null };
  });
  return { seed, pins };
}
