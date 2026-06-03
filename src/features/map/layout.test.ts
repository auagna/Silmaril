import { computeLayout, type GraphLayoutMode } from "./layout";
import { threads } from "@/lib/dummy";

const nodes = threads.slice(0, 6);
const W = 343;
const H = 380;
const MODES: GraphLayoutMode[] = ["web", "focus", "flow", "branch"];

describe("computeLayout", () => {
  it("returns a position for every node in every mode", () => {
    for (const mode of MODES) {
      const pos = computeLayout(mode, nodes, nodes[2].id, W, H);
      for (const n of nodes) {
        expect(pos[n.id]).toBeDefined();
        expect(typeof pos[n.id].x).toBe("number");
        expect(typeof pos[n.id].y).toBe("number");
      }
    }
  });

  it("focus mode centers the selected node", () => {
    const sel = nodes[3].id;
    const pos = computeLayout("focus", nodes, sel, W, H);
    expect(pos[sel].x).toBeCloseTo(W / 2);
    expect(pos[sel].y).toBeCloseTo(H / 2);
  });

  it("handles empty input", () => {
    expect(computeLayout("web", [], null, W, H)).toEqual({});
  });
});
