import { FilterChip } from "@/components/FilterChip";
import { GraphView } from "@/features/map/GraphView";
import {
  bookmarks, collectionItems, currentUser, records, threads,
} from "@/lib/dummy";

type MapFilter = "all" | "bookmarks" | "records" | "collections" | "likes";

export default function MapPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const filter = (searchParams?.filter ?? "all") as MapFilter;

  const visibleIds = computeVisible(filter);
  const visibleCount = visibleIds.size;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink-900">내 지도</h1>
        <p className="mt-2 text-sm text-ink-500">
          좋아한 / 저장한 / 기록한 / 컬렉션에 담은 실마리가 노드로 나타납니다.
          노드를 끌어 옮길 수 있고, 연결은 관계 종류와 함께 표시됩니다.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/map"                       label="전체"     active={filter === "all"}        count={threads.length} />
        <FilterChip href="/map?filter=bookmarks"      label="저장"     active={filter === "bookmarks"}  count={bookmarks.filter(b => b.user_id === currentUser.id).length} />
        <FilterChip href="/map?filter=records"        label="기록"     active={filter === "records"}    count={records.filter(r => r.created_by === currentUser.id && r.thread_id).length} />
        <FilterChip href="/map?filter=collections"    label="컬렉션"   active={filter === "collections"} count={collectionItems.length} />
        <FilterChip href="/map?filter=likes"          label="좋아요"   active={filter === "likes"}      count={0} />
      </div>

      <GraphView visibleIds={visibleIds} />

      <p className="text-xs text-ink-400">
        지도 위 노드 {visibleCount}개. 더블클릭 → Thread 상세 (M2에서 연결).
      </p>
    </div>
  );
}

function computeVisible(filter: MapFilter): Set<string> {
  const me = "u-001";
  switch (filter) {
    case "bookmarks":
      return new Set(bookmarks.filter((b) => b.user_id === me).map((b) => b.thread_id));
    case "records": {
      const ids = records.filter((r) => r.created_by === me && r.thread_id).map((r) => r.thread_id!) ;
      return new Set(ids);
    }
    case "collections":
      return new Set(collectionItems.map((i) => i.thread_id));
    case "likes":
      return new Set();
    case "all":
    default:
      return new Set(threads.map((t) => t.id));
  }
}
