import Link from "next/link";
import { redirect } from "next/navigation";
import { ThreadHeader } from "@/features/threads/ThreadHeader";
import { ThreadLiveView } from "@/features/threads/ThreadLiveView";
import { ThreadCard } from "@/components/ThreadCard";
import { PerspectiveCard } from "@/components/PerspectiveCard";
import { RecordCard } from "@/components/RecordCard";
import { CollectionCard } from "@/components/CollectionCard";
import { EmptyState } from "@/components/EmptyState";
import {
  collectionsContaining, connectionsOf, findThread, perspectivesOf, recordsOf,
} from "@/lib/dummy";
import { RELATION_LABEL } from "@/types/domain";

export default function ThreadDetailPage({ params }: { params: { id: string } }) {
  const idOrSlug = decodeURIComponent(params.id);
  const thread = findThread(idOrSlug);
  // 더미에 없으면 = 방금 만든 실데이터일 수 있음 → 브라우저 클라이언트로 조회 (N3에서 통합).
  if (!thread) return <ThreadLiveView slug={idOrSlug} />;

  // merged → redirect to canonical
  if (thread.status === "merged" && thread.merged_into) {
    const target = findThread(thread.merged_into);
    if (target) redirect(`/threads/${encodeURIComponent(target.slug)}`);
  }

  const persp = perspectivesOf(thread.id);
  const conns = connectionsOf(thread.id);
  const recs  = recordsOf(thread.id);
  const cols  = collectionsContaining(thread.id);

  return (
    <article className="space-y-12">
      <ThreadHeader thread={thread} />

      {/* 관점 */}
      <section>
        <SectionHeader title={`관점 (${persp.length})`} hint="같은 실마리, 여러 해석" />
        {persp.length > 0 ? (
          <div className="space-y-4">
            {persp.map((p) => <PerspectiveCard key={p.id} p={p} />)}
          </div>
        ) : (
          <EmptyState
            title="이 실마리에 대한 첫 관점을 작성해 보세요."
            hint="공식화된 페이지가 아니라, 당신의 해석부터 시작합니다."
            cta={{ href: `/create/perspective?thread=${thread.id}`, label: "관점 작성" }}
          />
        )}
      </section>

      {/* 연결 */}
      <section>
        <SectionHeader title={`연결 (${conns.length})`} hint="다른 실마리와의 관계" />
        {conns.length > 0 ? (
          <ul className="divide-y divide-ink-200 border border-ink-200 rounded-xl2 bg-white">
            {conns.map((c) => {
              const isOutgoing = c.from_thread === thread.id;
              const otherId = isOutgoing ? c.to_thread : c.from_thread;
              const other = findThread(otherId);
              if (!other) return null;
              return (
                <li key={c.id} className="px-5 py-4 flex items-center gap-3">
                  <span className="text-xs text-ink-400 w-24">
                    {isOutgoing ? "→ " : "← "} {RELATION_LABEL[c.relation]}
                  </span>
                  <Link
                    href={`/threads/${encodeURIComponent(other.slug)}`}
                    className="font-serif text-ink-800 hover:text-ink-900"
                  >
                    {other.title}
                  </Link>
                  {c.note && (
                    <span className="ml-auto text-xs text-ink-500 max-w-md truncate">
                      {c.note}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title="아직 연결된 실마리가 없어요."
            hint="관련 실마리를 연결해 지도를 키워 보세요."
          />
        )}
      </section>

      {/* 기록 */}
      <section>
        <SectionHeader title={`기록 (${recs.length})`} hint="이 실마리에 묶인 개인 기록" />
        {recs.length > 0 ? (
          <div className="space-y-3">
            {recs.map((r) => <RecordCard key={r.id} record={r} />)}
          </div>
        ) : (
          <EmptyState
            title="첫 기록을 남겨 보세요."
            hint="형식은 자유롭게. 짧은 메모도 좋습니다."
            cta={{ href: `/create/record?thread=${thread.id}`, label: "기록 작성" }}
          />
        )}
      </section>

      {/* 컬렉션 */}
      <section>
        <SectionHeader title={`컬렉션 (${cols.length})`} hint="이 실마리가 담긴 큐레이션" />
        {cols.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cols.map((c) => <CollectionCard key={c.id} collection={c} />)}
          </div>
        ) : (
          <p className="text-sm text-ink-500">아직 어떤 컬렉션에도 담기지 않았어요.</p>
        )}
      </section>

      {/* 인접 실마리 — 1-hop neighbors */}
      <section>
        <SectionHeader title="이어서 탐험하기" hint="1-홉 거리에 있는 실마리" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conns
            .map((c) => (c.from_thread === thread.id ? c.to_thread : c.from_thread))
            .map((id) => findThread(id))
            .filter((t): t is NonNullable<typeof t> => !!t)
            .slice(0, 6)
            .map((t) => <ThreadCard key={t.id} thread={t} size="sm" />)}
        </div>
      </section>
    </article>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="font-serif text-xl text-ink-800">{title}</h2>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
