import Link from "next/link";
import type { Record as RecordEntity } from "@/types/domain";
import { findThread, findUser } from "@/lib/dummy";

export function RecordCard({ record }: { record: RecordEntity }) {
  const thread = record.thread_id ? findThread(record.thread_id) : null;
  const author = findUser(record.created_by);
  return (
    <article className="border border-ink-200 rounded-xl2 bg-white p-5">
      <p className="text-sm text-ink-700 whitespace-pre-line">{record.body}</p>
      <footer className="mt-3 flex items-center gap-2 text-xs text-ink-400">
        <span>@{author?.handle ?? "unknown"}</span>
        <span>·</span>
        <time>{new Date(record.created_at).toISOString().slice(0, 10)}</time>
        {thread && (
          <>
            <span>·</span>
            <Link href={`/threads/${encodeURIComponent(thread.slug)}`} className="text-ink-500 hover:text-ink-800">
              ↳ {thread.title}
            </Link>
          </>
        )}
      </footer>
    </article>
  );
}
