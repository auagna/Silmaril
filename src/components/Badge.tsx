import { cn } from "@/utils/cn";
import type { ThreadStatus, ThreadType } from "@/types/domain";
import { THREAD_STATUS_LABEL, THREAD_TYPE_LABEL } from "@/types/domain";

const statusTone: Record<ThreadStatus, string> = {
  local:     "bg-ink-100 text-ink-600 border-ink-200",
  community: "bg-accent-soft/20 text-ink-700 border-accent-soft/40",
  verified:  "bg-accent/10 text-accent border-accent/30",
  official:  "bg-ink-800 text-ink-50 border-ink-800",
  merged:    "bg-ink-100 text-ink-400 border-ink-200 line-through",
  archived:  "bg-ink-100 text-ink-400 border-ink-200",
};

export function StatusBadge({ status }: { status: ThreadStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] tracking-wide",
      statusTone[status],
    )}>
      {status === "official" && <span>✓</span>}
      {THREAD_STATUS_LABEL[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: ThreadType }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-ink-200 bg-ink-50 text-[11px] text-ink-600">
      {THREAD_TYPE_LABEL[type]}
    </span>
  );
}

export function PartnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-accent/30 bg-accent/5 text-[11px] text-accent">
      ✦ 파트너 큐레이터
    </span>
  );
}
