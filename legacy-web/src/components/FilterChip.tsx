import Link from "next/link";
import { cn } from "@/utils/cn";

export function FilterChip({
  href, label, active, count,
}: { href: string; label: string; active?: boolean; count?: number }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm border transition-colors",
        active
          ? "bg-ink-800 text-ink-50 border-ink-800"
          : "bg-ink-50 text-ink-600 border-ink-200 hover:bg-ink-100",
      )}
    >
      {label}
      {typeof count === "number" && (
        <span className={cn("ml-1.5 text-xs", active ? "text-ink-300" : "text-ink-400")}>
          {count}
        </span>
      )}
    </Link>
  );
}
