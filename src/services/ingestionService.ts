// Ingestion 파이프라인 1차 (PHASE 41) — service 수준 mock.
// query → 어댑터 검색/추출 → 통합 → 중복제거 → confidence → review queue.
// 실제 외부 API/크롤링 미연결(법무·환경 검토 후). 원문 복사 없이 후보 중심.
import type { Locale } from "@/i18n";
import type { ExtractedCandidate, ReviewCandidate, SourceAdapter } from "@/features/sources/types";
import { MockSourceAdapter } from "@/features/sources/adapters/mock";
import { NamuWikiReferenceAdapter } from "@/features/sources/adapters/namuwiki";
import { confidenceScore } from "@/features/sources/confidence";
import { enqueueCandidates } from "@/features/sources/reviewStore";

// MVP: Mock + NamuWiki(placeholder). 추후 Wikidata/Wikipedia 어댑터 추가.
const ADAPTERS: SourceAdapter[] = [MockSourceAdapter, NamuWikiReferenceAdapter];

async function collect(query: string, locale: Locale): Promise<ExtractedCandidate[]> {
  const all: ExtractedCandidate[] = [];
  for (const adapter of ADAPTERS) {
    try {
      const results = await adapter.search(query, locale);
      for (const r of results) {
        const doc = await adapter.fetchPage(r.externalId, locale);
        if (!doc) continue;
        const cands = await adapter.extractCandidates(doc);
        all.push(...cands);
      }
    } catch {
      /* 어댑터 실패는 무시(앱 안 깨지게) */
    }
  }
  return all;
}

// title(소문자) 기준 중복 제거 + 다중 소스 → confidence 재계산.
function dedupe(cands: ExtractedCandidate[]): ExtractedCandidate[] {
  const byTitle = new Map<string, ExtractedCandidate[]>();
  for (const c of cands) {
    const k = c.title.trim().toLowerCase();
    byTitle.set(k, [...(byTitle.get(k) ?? []), c]);
  }
  return [...byTitle.values()].map((group) => {
    const sources = group.map((g) => g.sourceName);
    const hasUrl = group.some((g) => !!g.sourceUrl);
    return { ...group[0], confidenceScore: confidenceScore({ sourceNames: sources, hasUrl }) };
  });
}

export async function runIngestion(query: string, locale: Locale): Promise<ReviewCandidate[]> {
  const merged = dedupe(await collect(query, locale));
  const review: ReviewCandidate[] = merged.map((c) => ({
    id: `rc:${c.id}`,
    candidateType: c.candidateType,
    title: c.title,
    summary: c.summary,
    sourceName: c.sourceName,
    sourceUrl: c.sourceUrl,
    confidenceScore: c.confidenceScore,
    status: "pending",
    createdAt: new Date().toISOString(),
  }));
  enqueueCandidates(review); // 검토 큐로 (일반 화면 미노출)
  return review;
}
