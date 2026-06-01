import Link from "next/link";
import type { Collection } from "@/types/domain";
import { collectionItems, findUser } from "@/lib/dummy";

export function CollectionCard({ collection }: { collection: Collection }) {
  const itemCount = collectionItems.filter((i) => i.collection_id === collection.id).length;
  const author = findUser(collection.created_by);
  return (
    <Link
      href={`/collections/${encodeURIComponent(collection.slug)}`}
      className="block border border-ink-200 rounded-xl2 bg-white p-5 hover:border-ink-300 transition-colors"
    >
      <p className="text-[11px] tracking-wide text-ink-400">컬렉션 · {itemCount}개</p>
      <h3 className="mt-1 font-serif text-lg text-ink-800">{collection.title}</h3>
      {collection.description && (
        <p className="mt-2 text-sm text-ink-600 line-clamp-2">{collection.description}</p>
      )}
      <p className="mt-3 text-xs text-ink-400">@{author?.handle ?? "unknown"}</p>
    </Link>
  );
}
