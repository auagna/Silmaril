import type { Perspective } from "@/types/domain";
import { findUser } from "@/lib/dummy";

export function PerspectiveCard({ p }: { p: Perspective }) {
  const author = findUser(p.created_by);
  return (
    <article className="border border-ink-200 rounded-xl2 bg-white p-6">
      <h4 className="font-serif text-lg text-ink-800 leading-snug">{p.title}</h4>
      <p className="mt-3 text-sm text-ink-600 whitespace-pre-line">{p.body}</p>
      <footer className="mt-4 text-xs text-ink-400">
        — by @{author?.handle ?? "unknown"} · {new Date(p.created_at).toISOString().slice(0, 10)}
      </footer>
    </article>
  );
}
