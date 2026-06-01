import { RecordCard } from "@/components/RecordCard";
import { EmptyState } from "@/components/EmptyState";
import type { Record as RecordEntity } from "@/types/domain";

export function RecordFeed({
  records, emptyHint,
}: { records: RecordEntity[]; emptyHint?: string }) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="아직 기록이 없어요."
        hint={emptyHint ?? "첫 기록을 자유롭게 남겨 보세요."}
        cta={{ href: "/create/record", label: "기록 작성" }}
      />
    );
  }
  return (
    <div className="space-y-3">
      {records.map((r) => <RecordCard key={r.id} record={r} />)}
    </div>
  );
}
