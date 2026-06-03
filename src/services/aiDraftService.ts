// AI 초안 서비스 (PHASE 44) — mock. 실제 API 미연결.
// 원칙: 원문 복사 금지 · 출처 없는 단정 금지 · 생성물은 바로 공개 금지(review queue) · ko/en 각각.
import type { Locale } from "@/i18n";
import type { AIDraft, ExtractedCandidate, SourceDocument } from "@/features/sources/types";

function draftId(prefix: string) {
  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
}

export async function generateKeywordSummaryDraft(
  candidate: ExtractedCandidate,
  sources: SourceDocument[],
  locale: Locale,
): Promise<AIDraft> {
  // TODO(실 API): sources 를 근거로 Silmaril 톤 요약 생성. 지금은 mock.
  const body =
    locale === "en"
      ? `(AI draft) A short, exploratory summary of "${candidate.title}", grounded in cited sources.`
      : `(AI 초안) "${candidate.title}"에 대한 짧은 탐험형 요약. 출처 근거 기반.`;
  return {
    id: draftId("aidraft-kw"),
    draftType: "keyword_summary",
    locale,
    title: candidate.title,
    body,
    usedSourceIds: sources.map((s) => s.id),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export async function generateRelationDraft(
  fromTitle: string,
  toTitle: string,
  sources: SourceDocument[],
  locale: Locale,
): Promise<AIDraft> {
  const body =
    locale === "en"
      ? `(AI draft) How "${fromTitle}" relates to "${toTitle}" — attitudinal, not overstated.`
      : `(AI 초안) "${fromTitle}"와 "${toTitle}"의 관계 — 단정이 아니라 태도적 연결로.`;
  return {
    id: draftId("aidraft-rel"),
    draftType: "relation_description",
    locale,
    title: `${fromTitle} → ${toTitle}`,
    body,
    usedSourceIds: sources.map((s) => s.id),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
