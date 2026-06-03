import { recommendNext } from "./recommend";

describe("recommendNext (PHASE 16 우선순위)", () => {
  it("prefers a connected, unvisited neighbor of the current node", () => {
    const next = recommendNext("tadao-ando", new Set());
    // 안도의 이웃 중 하나여야 함 (자기 자신 아님)
    expect(next).toBeTruthy();
    expect(next).not.toBe("tadao-ando");
  });

  it("returns a recommended/unvisited node when nothing selected", () => {
    const next = recommendNext(null, new Set());
    expect(next).toBeTruthy();
  });

  it("does not return an already-visited node when alternatives exist", () => {
    const visited = new Set<string>(["light", "silence", "concrete"]);
    const next = recommendNext("tadao-ando", visited);
    expect(next).toBeTruthy();
    expect(visited.has(next as string)).toBe(false);
  });
});
