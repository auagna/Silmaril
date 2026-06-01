import Link from "next/link";
import { ThreadCard } from "@/components/ThreadCard";
import { CollectionCard } from "@/components/CollectionCard";
import {
  bookmarks, collections, currentUser, findThread,
  perspectives, publicThreads, recommendedThreads, threads,
} from "@/lib/dummy";

export default function HomePage() {
  const todays = publicThreads()[0]; // 오늘의 실마리
  const recent = bookmarks
    .filter((b) => b.user_id === currentUser.id)
    .map((b) => findThread(b.thread_id))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .slice(0, 4);
  const recs = recommendedThreads(6);

  const recentPerspectives = [...perspectives]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  return (
    <div className="space-y-16">
      {/* 오늘의 실마리 */}
      <section>
        <SectionHeader title="오늘의 실마리" />
        {todays ? (
          <Link
            href={`/threads/${encodeURIComponent(todays.slug)}`}
            className="block border border-ink-200 rounded-xl2 bg-white p-10 hover:border-ink-300 transition-colors"
          >
            <p className="text-xs text-ink-400 tracking-wide">TODAY</p>
            <h2 className="mt-3 font-serif text-4xl text-ink-900 tracking-tight">{todays.title}</h2>
            {todays.summary && (
              <p className="mt-4 max-w-prose text-ink-700 leading-relaxed">{todays.summary}</p>
            )}
            <p className="mt-6 text-sm text-ink-500">이 실마리에서 시작해 보세요 →</p>
          </Link>
        ) : null}
      </section>

      {/* 이어서 탐험하기 */}
      {recent.length > 0 && (
        <section>
          <SectionHeader title="이어서 탐험하기" hint="최근 저장한 실마리" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((t) => <ThreadCard key={t.id} thread={t} size="sm" />)}
          </div>
        </section>
      )}

      {/* 추천 실마리 */}
      <section>
        <SectionHeader title="추천 실마리" hint="저장과 연결이 많은 순" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recs.map((t) => <ThreadCard key={t.id} thread={t} />)}
        </div>
      </section>

      {/* 큐레이터 활동 */}
      <section>
        <SectionHeader title="큐레이터 활동" hint="최근 작성된 관점과 컬렉션" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {recentPerspectives.map((p) => {
              const t = findThread(p.thread_id);
              return (
                <div key={p.id} className="border border-ink-200 rounded-xl2 bg-white p-5">
                  <p className="text-[11px] text-ink-400">관점</p>
                  <h4 className="mt-1 font-serif text-base text-ink-800">{p.title}</h4>
                  {t && (
                    <Link
                      href={`/threads/${encodeURIComponent(t.slug)}`}
                      className="mt-2 inline-block text-xs text-ink-500 hover:text-ink-800"
                    >
                      ↳ {t.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            {collections.slice(0, 3).map((c) => <CollectionCard key={c.id} collection={c} />)}
          </div>
        </div>
      </section>

      <p className="text-xs text-ink-400 text-center pt-4">
        전체 실마리 {threads.length}개 · 연결 활성화됨
      </p>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <h2 className="font-serif text-2xl text-ink-800">{title}</h2>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
