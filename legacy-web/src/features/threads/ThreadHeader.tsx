import type { Thread } from "@/types/domain";
import { StatusBadge, TypeBadge } from "@/components/Badge";
import { signalFor } from "@/lib/dummy";

export function ThreadHeader({ thread }: { thread: Thread }) {
  const s = signalFor(thread.id);
  return (
    <header className="border-b border-ink-200 pb-8">
      <div className="flex items-center gap-2">
        <TypeBadge type={thread.type} />
        <StatusBadge status={thread.status} />
      </div>
      <h1 className="mt-4 font-serif text-4xl text-ink-900 tracking-tight">{thread.title}</h1>
      {thread.aliases.length > 0 && (
        <p className="mt-1 text-sm text-ink-400">{thread.aliases.join(" · ")}</p>
      )}
      {thread.summary && (
        <p className="mt-5 max-w-prose text-ink-700 leading-relaxed">{thread.summary}</p>
      )}

      <div className="mt-6 flex items-center gap-2">
        <button className="px-4 py-2 rounded-full text-sm bg-ink-800 text-ink-50 hover:bg-ink-700">저장</button>
        <button className="px-4 py-2 rounded-full text-sm border border-ink-200 text-ink-700 hover:bg-ink-100">연결</button>
        <button className="px-4 py-2 rounded-full text-sm border border-ink-200 text-ink-700 hover:bg-ink-100">좋아요</button>
        <button className="px-4 py-2 rounded-full text-sm border border-ink-200 text-ink-700 hover:bg-ink-100">공유</button>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
        <Stat label="저장"   value={s.bookmarks_count} />
        <Stat label="연결"   value={s.connections_count} />
        <Stat label="관점"   value={s.perspectives_count} />
        <Stat label="기록"   value={s.records_count} />
        <Stat label="컬렉션" value={s.collection_inclusions} />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink-200 rounded-lg px-3 py-2 bg-ink-50">
      <div className="text-[11px] text-ink-400">{label}</div>
      <div className="font-serif text-lg text-ink-800">{value}</div>
    </div>
  );
}
