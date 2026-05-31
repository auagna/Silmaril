import { PartnerBadge } from "@/components/Badge";
import { RecordCard } from "@/components/RecordCard";
import { CollectionCard } from "@/components/CollectionCard";
import { ThreadCard } from "@/components/ThreadCard";
import {
  bookmarks, collections, currentUser, findThread, records, userStats,
} from "@/lib/dummy";

export default function ProfilePage() {
  const stats = userStats(currentUser.id);
  const myRecords = records.filter((r) => r.created_by === currentUser.id);
  const myCollections = collections.filter((c) => c.created_by === currentUser.id);
  const myBookmarked = bookmarks
    .filter((b) => b.user_id === currentUser.id)
    .map((b) => findThread(b.thread_id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="space-y-12">
      <header className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-ink-200 flex items-center justify-center font-serif text-2xl text-ink-700">
          {(currentUser.display_name ?? currentUser.handle)[0]}
        </div>
        <div>
          <h1 className="font-serif text-3xl text-ink-900">
            {currentUser.display_name ?? currentUser.handle}
          </h1>
          <p className="text-sm text-ink-500">@{currentUser.handle}</p>
          {currentUser.bio && (
            <p className="mt-2 text-sm text-ink-700 max-w-prose">{currentUser.bio}</p>
          )}
          {currentUser.role === "partner" && (
            <div className="mt-3">
              <PartnerBadge />
            </div>
          )}
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="기록"             value={stats.records} />
        <Stat label="컬렉션"           value={stats.collections} />
        <Stat label="발견한 실마리"     value={stats.discovered} />
        <Stat label="연결한 실마리"     value={stats.connected} />
      </section>

      <section>
        <SectionHeader title="최근 기록" />
        {myRecords.length > 0 ? (
          <div className="space-y-3">
            {myRecords.map((r) => <RecordCard key={r.id} record={r} />)}
          </div>
        ) : (
          <p className="text-sm text-ink-500">아직 기록이 없어요.</p>
        )}
      </section>

      <section>
        <SectionHeader title="내 컬렉션" />
        {myCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myCollections.map((c) => <CollectionCard key={c.id} collection={c} />)}
          </div>
        ) : (
          <p className="text-sm text-ink-500">아직 컬렉션이 없어요.</p>
        )}
      </section>

      <section>
        <SectionHeader title="저장한 실마리" />
        {myBookmarked.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBookmarked.map((t) => <ThreadCard key={t.id} thread={t} size="sm" />)}
          </div>
        ) : (
          <p className="text-sm text-ink-500">아직 저장한 실마리가 없어요.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink-200 rounded-xl2 bg-white p-4">
      <div className="text-[11px] text-ink-400 tracking-wide">{label}</div>
      <div className="mt-1 font-serif text-2xl text-ink-800">{value}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="font-serif text-xl text-ink-800 mb-4">{title}</h2>;
}
