import Link from "next/link";
import type { Thread } from "@/types/domain";
import { StatusBadge, TypeBadge } from "./Badge";
import { signalFor } from "@/lib/dummy";

export function ThreadCard({ thread, size = "md" }: { thread: Thread; size?: "sm" | "md" | "lg" }) {
  const s = signalFor(thread.id);
  return (
    <Link
      href={`/threads/${encodeURIComponent(thread.slug)}`}
      className="group block border border-ink-200 rounded-xl2 bg-white hover:border-ink-300 transition-colors"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <TypeBadge type={thread.type} />
          <StatusBadge status={thread.status} />
        </div>
        <h3 className={
          size === "lg" ? "font-serif text-2xl text-ink-800"
          : size === "sm" ? "font-serif text-base text-ink-800"
          : "font-serif text-lg text-ink-800"
        }>
          {thread.title}
        </h3>
        {thread.aliases.length > 0 && (
          <p className="mt-1 text-xs text-ink-400">{thread.aliases.join(" · ")}</p>
        )}
        {thread.summary && (
          <p className="mt-3 text-sm text-ink-600 line-clamp-3">{thread.summary}</p>
        )}
        <div className="mt-4 flex items-center gap-3 text-[11px] text-ink-400">
          <span>저장 {s.bookmarks_count}</span>
          <span>연결 {s.connections_count}</span>
          <span>관점 {s.perspectives_count}</span>
          <span>기록 {s.records_count}</span>
        </div>
      </div>
    </Link>
  );
}
