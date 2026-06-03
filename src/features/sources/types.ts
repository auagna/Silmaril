// 외부 지식 소스 어댑터 구조 (PHASE 36/40). 구조/타입만 — 실제 수집은 추후·법무 검토 후.
import type { Locale } from "@/i18n";
import type { ThreadType } from "@/types/database";

export type SourceName = "mock" | "wikidata" | "wikipedia" | "namuwiki" | "official" | "museum_archive" | "curator" | "user_submission";
export type SourceUsedAs = "citation" | "reference" | "candidate_only";

export interface SourceSearchResult {
  sourceName: SourceName;
  externalId: string; // entityId / pageId / title
  title: string;
  description?: string;
  sourceUrl?: string;
  locale?: Locale;
}

export interface SourceDocument {
  id: string;
  sourceName: SourceName;
  sourceUrl?: string;
  title: string;
  locale?: Locale;
  license?: string;
  fetchedAt: string;
  usedAs: SourceUsedAs; // 원문 저장 지양 — 출처/후보 기록 중심
}

export interface ExtractedCandidate {
  id: string;
  candidateType: "keyword" | "relation";
  title: string; // keyword title 또는 "A→B"
  type?: ThreadType; // keyword 후보의 타입(추정)
  summary?: string;
  sourceName: SourceName;
  sourceUrl?: string;
  locale?: Locale;
  confidenceScore: number;
  // relation 후보
  fromTitle?: string;
  toTitle?: string;
  relationType?: string;
}

export interface SourceClaim {
  id: string;
  sourceDocumentId: string;
  keywordId?: string;
  relationId?: string;
  claimType: string;
  claimText?: string; // 짧은 사실 단위만
  confidenceScore: number;
  createdAt: string;
}

export interface CandidateSourceLink {
  id: string;
  candidateId: string;
  sourceDocumentId: string;
  confidenceScore: number;
}

// 검토 큐 (PHASE 42)
export type ReviewStatus = "pending" | "approved" | "rejected" | "merged";
export interface ReviewCandidate {
  id: string;
  candidateType: "keyword" | "relation" | "translation" | "source" | "ai_draft";
  title: string;
  summary?: string;
  description?: string;
  sourceName: SourceName;
  sourceUrl?: string;
  confidenceScore: number;
  status: ReviewStatus;
  createdAt: string;
  reviewedAt?: string;
}

// AI 초안 (PHASE 44)
export interface AIDraft {
  id: string;
  draftType: "keyword_summary" | "relation_description" | "viewpoint_seed";
  locale: Locale;
  title: string;
  body: string;
  usedSourceIds: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// 모든 어댑터가 따르는 인터페이스 (PHASE 36)
export interface SourceAdapter {
  sourceName: SourceName;
  search(query: string, locale: Locale): Promise<SourceSearchResult[]>;
  fetchPage(externalId: string, locale: Locale): Promise<SourceDocument | null>;
  extractCandidates(doc: SourceDocument): Promise<ExtractedCandidate[]>;
}
