import { confidenceScore, canAutoApprove, SOURCE_BASE_SCORE } from "./confidence";

describe("confidenceScore (검토 우선도)", () => {
  it("uses the highest source base score", () => {
    expect(confidenceScore({ sourceNames: ["wikipedia"], hasUrl: true })).toBeCloseTo(SOURCE_BASE_SCORE.wikipedia);
    expect(confidenceScore({ sourceNames: ["wikipedia", "wikidata"], hasUrl: true })).toBeGreaterThanOrEqual(
      SOURCE_BASE_SCORE.wikidata,
    );
  });

  it("adds a bump for multiple sources", () => {
    const one = confidenceScore({ sourceNames: ["wikidata"], hasUrl: true });
    const two = confidenceScore({ sourceNames: ["wikidata", "wikipedia"], hasUrl: true });
    expect(two).toBeGreaterThan(one);
  });

  it("penalizes missing url", () => {
    const withUrl = confidenceScore({ sourceNames: ["wikipedia"], hasUrl: true });
    const noUrl = confidenceScore({ sourceNames: ["wikipedia"], hasUrl: false });
    expect(noUrl).toBeLessThan(withUrl);
  });

  it("caps at 0.99 and floors at 0", () => {
    expect(confidenceScore({ sourceNames: ["official", "curator", "wikidata"], hasUrl: true })).toBeLessThanOrEqual(0.99);
    expect(confidenceScore({ sourceNames: [], hasUrl: false })).toBeGreaterThanOrEqual(0);
  });

  it("namuwiki / user_submission must not auto-approve", () => {
    expect(canAutoApprove(["namuwiki"])).toBe(false);
    expect(canAutoApprove(["user_submission"])).toBe(false);
    expect(canAutoApprove(["wikidata", "wikipedia"])).toBe(true);
  });
});
