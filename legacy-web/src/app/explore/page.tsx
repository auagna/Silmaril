import { ThreadCard } from "@/components/ThreadCard";
import { FilterChip } from "@/components/FilterChip";
import { EmptyState } from "@/components/EmptyState";
import {
  publicThreads, recommendedThreads, threadsByType,
} from "@/lib/dummy";
import { THREAD_TYPE_LABEL, THREAD_TYPES, type ThreadType } from "@/types/domain";

const TABS: Array<{ key: "recommended" | ThreadType; label: string }> = [
  { key: "recommended", label: "추천" },
  ...THREAD_TYPES.map((t) => ({ key: t, label: THREAD_TYPE_LABEL[t] })),
];

export default function ExplorePage({
  searchParams,
}: {
  searchParams?: { type?: string; q?: string };
}) {
  const tab = (searchParams?.type ?? "recommended") as "recommended" | ThreadType;
  const q = (searchParams?.q ?? "").trim();

  let list = tab === "recommended"
    ? recommendedThreads(24)
    : threadsByType(tab as ThreadType);

  if (q) {
    const ql = q.toLowerCase();
    list = list.filter((t) =>
      t.title.toLowerCase().includes(ql) ||
      t.aliases.some((a) => a.toLowerCase().includes(ql)) ||
      (t.summary?.toLowerCase().includes(ql) ?? false),
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-serif text-3xl text-ink-900">Explore</h1>
        <p className="mt-2 text-sm text-ink-500">
          이름, 별칭, 요약으로 검색하고 타입별로 둘러보세요.
        </p>
      </section>

      <form action="/explore" method="get" className="flex gap-2">
        {tab !== "recommended" && (
          <input type="hidden" name="type" value={tab as string} />
        )}
        <input
          name="q"
          defaultValue={q}
          placeholder="디터 람스, 바우하우스, 베를린…"
          className="flex-1 px-4 py-2.5 rounded-full border border-ink-200 bg-white text-sm placeholder:text-ink-400 focus:outline-none focus:border-ink-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full bg-ink-800 text-ink-50 text-sm hover:bg-ink-700"
        >
          검색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const href =
            t.key === "recommended"
              ? (q ? `/explore?q=${encodeURIComponent(q)}` : "/explore")
              : `/explore?type=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          const count =
            t.key === "recommended"
              ? publicThreads().length
              : threadsByType(t.key as ThreadType).length;
          return (
            <FilterChip
              key={t.key}
              href={href}
              label={t.label}
              active={tab === t.key}
              count={count}
            />
          );
        })}
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t) => <ThreadCard key={t.id} thread={t} />)}
        </div>
      ) : (
        <EmptyState
          title="검색 결과가 없어요."
          hint="다른 키워드로 시도하거나, 직접 새 실마리를 만들어 보세요."
          cta={{ href: "/create", label: "실마리 만들기" }}
        />
      )}
    </div>
  );
}
