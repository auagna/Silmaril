// NamuWikiReferenceAdapter (PHASE 39) — ⚠️ 참고(candidate_only) 전용.
// 금지: 원문 본문 저장 / 문장 복사 / AI 말투변환 재사용 / 자동 크롤링.
// 허용: 후보 title + source url + 낮은 confidence 만. 실제 기본정보는 Wikidata/Wikipedia/공식/큐레이터로 보강.
import type { Locale } from "@/i18n";
import type { SourceAdapter, SourceSearchResult, SourceDocument, ExtractedCandidate } from "../types";
import { confidenceScore } from "../confidence";

export const NamuWikiReferenceAdapter: SourceAdapter = {
  sourceName: "namuwiki",

  // 실제 검색/크롤링 미구현 — placeholder. (ToS/robots/라이선스 검토 전 활성화 금지)
  async search(_query: string, _locale: Locale): Promise<SourceSearchResult[]> {
    return [];
  },

  // 본문 fetch 안 함 — URL 기반 reference record 만 생성.
  async fetchPage(externalId: string, locale: Locale): Promise<SourceDocument | null> {
    return {
      id: `namu:${externalId}`,
      sourceName: "namuwiki",
      sourceUrl: undefined, // 실제 URL 은 검토/입력 후
      title: externalId,
      locale,
      fetchedAt: new Date().toISOString(),
      usedAs: "candidate_only", // 항상 candidate_only
    };
  },

  // 후보 title 중심만. 사실 본문은 다른 소스로 보강.
  async extractCandidates(doc: SourceDocument): Promise<ExtractedCandidate[]> {
    return [
      {
        id: `cand:${doc.id}`,
        candidateType: "keyword",
        title: doc.title,
        sourceName: "namuwiki",
        locale: doc.locale,
        confidenceScore: confidenceScore({ sourceNames: ["namuwiki"], hasUrl: !!doc.sourceUrl }),
      },
    ];
  },
};
