// 검토 우선도(confidence) — 진실 판정 아님, "검토 우선순위" (PHASE 43).
import type { SourceName } from "./types";

export const SOURCE_BASE_SCORE: Record<SourceName, number> = {
  official: 0.9,
  curator: 0.9,
  wikidata: 0.85,
  museum_archive: 0.85,
  wikipedia: 0.75,
  user_submission: 0.4,
  namuwiki: 0.35, // 참고용(candidate_only) — 자동 승인 금지
  mock: 0.5,
};

/** 기본 점수 + 다중 소스 가산 − 출처 없음 감점. (0~0.99) */
export function confidenceScore(opts: { sourceNames: SourceName[]; hasUrl: boolean }): number {
  const { sourceNames, hasUrl } = opts;
  if (sourceNames.length === 0) return 0.2;
  const base = Math.max(...sourceNames.map((s) => SOURCE_BASE_SCORE[s] ?? 0.3));
  const multi = Math.min(0.1, 0.04 * (sourceNames.length - 1)); // 여러 소스서 발견 → 가산
  const urlPenalty = hasUrl ? 0 : 0.15; // 출처 URL 없으면 감점
  return Math.max(0, Math.min(0.99, base + multi - urlPenalty));
}

/** namuwiki 는 자동 승인되지 않는다(검토 필수). */
export function canAutoApprove(sourceNames: SourceName[]): boolean {
  return !sourceNames.includes("namuwiki") && !sourceNames.includes("user_submission");
}
