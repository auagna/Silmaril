import { getThreadTranslation, connectionsOf, undiscovered, savedIds, getThreadById } from "./dummy";

describe("getThreadTranslation fallback", () => {
  it("returns the requested locale", () => {
    expect(getThreadTranslation("tadao-ando", "en").title).toBe("Tadao Ando");
    expect(getThreadTranslation("tadao-ando", "ko").title).toBe("안도 다다오");
  });

  it("falls back to canonical title for unknown id", () => {
    const r = getThreadTranslation("does-not-exist", "ko");
    expect(r.title).toBe("does-not-exist");
    expect(r.summary).toBe("");
  });
});

describe("connectionsOf", () => {
  it("is bidirectional and carries relation_type + tier", () => {
    const conns = connectionsOf("tadao-ando");
    const ids = conns.map((c) => c.thread.id);
    expect(ids).toContain("light"); // ando -> light
    const light = conns.find((c) => c.thread.id === "light")!;
    expect(light.relation_type).toBe("related_to");
    expect([1, 2]).toContain(light.tier);
  });
});

describe("undiscovered", () => {
  it("excludes already-saved threads", () => {
    const ids = undiscovered().map((t) => t.id);
    for (const saved of savedIds) expect(ids).not.toContain(saved);
  });
  it("only returns existing threads", () => {
    for (const t of undiscovered()) expect(getThreadById(t.id)).toBeDefined();
  });
});
