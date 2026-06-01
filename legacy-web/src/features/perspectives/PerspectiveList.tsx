import { PerspectiveCard } from "@/components/PerspectiveCard";
import { EmptyState } from "@/components/EmptyState";
import type { Perspective } from "@/types/domain";

export function PerspectiveList({
  perspectives, threadId,
}: { perspectives: Perspective[]; threadId?: string }) {
  if (perspectives.length === 0) {
    return (
      <EmptyState
        title="아직 관점이 없어요."
        hint="첫 관점을 작성해 다른 사람의 탐험을 도와주세요."
        cta={threadId
          ? { href: `/create/perspective?thread=${threadId}`, label: "관점 작성" }
          : undefined}
      />
    );
  }
  return (
    <div className="space-y-4">
      {perspectives.map((p) => <PerspectiveCard key={p.id} p={p} />)}
    </div>
  );
}
