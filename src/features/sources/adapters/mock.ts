// MockSourceAdapter (PHASE 36) — 실제 네트워크 없이 후보 흐름을 시연.
import type { Locale } from "@/i18n";
import type { SourceAdapter, SourceSearchResult, SourceDocument, ExtractedCandidate } from "../types";
import { confidenceScore } from "../confidence";

export const MockSourceAdapter: SourceAdapter = {
  sourceName: "mock",

  async search(query: string, locale: Locale): Promise<SourceSearchResult[]> {
    if (!query.trim()) return [];
    return [
      { sourceName: "mock", externalId: `mock:${query}`, title: query, description: `(mock) ${query}`, sourceUrl: undefined, locale },
    ];
  },

  async fetchPage(externalId: string, locale: Locale): Promise<SourceDocument | null> {
    return {
      id: `doc:${externalId}`,
      sourceName: "mock",
      title: externalId.replace(/^mock:/, ""),
      locale,
      fetchedAt: new Date().toISOString(),
      usedAs: "candidate_only",
    };
  },

  async extractCandidates(doc: SourceDocument): Promise<ExtractedCandidate[]> {
    return [
      {
        id: `cand:${doc.id}`,
        candidateType: "keyword",
        title: doc.title,
        summary: `(mock) ${doc.title}`,
        sourceName: "mock",
        sourceUrl: doc.sourceUrl,
        locale: doc.locale,
        confidenceScore: confidenceScore({ sourceNames: ["mock"], hasUrl: !!doc.sourceUrl }),
      },
    ];
  },
};
