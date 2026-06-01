import { CollectionCard } from "@/components/CollectionCard";
import { EmptyState } from "@/components/EmptyState";
import type { Collection } from "@/types/domain";

export function CollectionGrid({
  collections,
}: { collections: Collection[] }) {
  if (collections.length === 0) {
    return (
      <EmptyState
        title="아직 컬렉션이 없어요."
        hint="실마리를 묶어 자신만의 큐레이션을 만들어 보세요."
        cta={{ href: "/create/collection", label: "컬렉션 생성" }}
      />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {collections.map((c) => <CollectionCard key={c.id} collection={c} />)}
    </div>
  );
}
