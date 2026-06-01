import Link from "next/link";

export function EmptyState({
  title, hint, cta,
}: { title: string; hint?: string; cta?: { href: string; label: string } }) {
  return (
    <div className="border border-dashed border-ink-200 rounded-xl2 p-10 text-center">
      <p className="font-serif text-lg text-ink-700">{title}</p>
      {hint && <p className="mt-2 text-sm text-ink-500">{hint}</p>}
      {cta && (
        <Link
          href={cta.href}
          className="inline-block mt-5 px-4 py-2 rounded-full text-sm bg-ink-800 text-ink-50 hover:bg-ink-700 transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
