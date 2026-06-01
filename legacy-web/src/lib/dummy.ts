// ============================================================================
// Dummy seed data — used until Supabase wiring lands.
// Shape exactly matches src/types/domain.ts.
// ============================================================================

import type {
  User, Thread, Connection, Perspective, Record as RecordEntity,
  Collection, CollectionItem, Bookmark, ThreadSignal,
} from "@/types/domain";

// ---- users -----------------------------------------------------------------

export const users: User[] = [
  {
    id: "u-001",
    handle: "yujin",
    display_name: "Yujin Choi",
    avatar_url: null,
    bio: "디자인과 도시, 그리고 그 사이의 사람들.",
    role: "partner",
    created_at: "2025-04-12T10:00:00Z",
  },
  {
    id: "u-002",
    handle: "editor_y",
    display_name: "에디터 Y",
    avatar_url: null,
    bio: "모더니즘과 그 잔향.",
    role: "partner",
    created_at: "2025-03-02T10:00:00Z",
  },
  {
    id: "u-003",
    handle: "wanderer",
    display_name: "느린 산책자",
    avatar_url: null,
    bio: "도시와 건축, 그리고 빛.",
    role: "member",
    created_at: "2025-05-21T10:00:00Z",
  },
];

export const currentUser: User = users[0];

// ---- threads ---------------------------------------------------------------

export const threads: Thread[] = [
  {
    id: "t-rams",
    slug: "디터-람스",
    title: "디터 람스",
    aliases: ["Dieter Rams", "디이터 람스"],
    type: "person",
    summary:
      "독일 산업 디자이너. 브라운의 디자인 언어를 정립하고, ‘좋은 디자인의 10원칙’을 남겼다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-05-10T09:00:00Z",
    updated_at: "2026-01-12T09:00:00Z",
  },
  {
    id: "t-bauhaus",
    slug: "바우하우스",
    title: "바우하우스",
    aliases: ["Bauhaus", "Staatliches Bauhaus"],
    type: "movement",
    summary:
      "1919년 바이마르에서 시작된 종합 예술 학교이자 운동. 공예와 산업, 예술과 생활의 통합을 추구했다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-05-11T09:00:00Z",
    updated_at: "2026-02-01T09:00:00Z",
  },
  {
    id: "t-braun",
    slug: "브라운",
    title: "브라운",
    aliases: ["Braun"],
    type: "company",
    summary: "독일의 가전 브랜드. 1950–70년대 산업 디자인의 기준을 세웠다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-05-12T09:00:00Z",
    updated_at: "2025-12-01T09:00:00Z",
  },
  {
    id: "t-sk4",
    slug: "sk4",
    title: "SK4",
    aliases: ["Snow White's Coffin", "백설공주의 관"],
    type: "work",
    summary: "브라운의 라디오-포노그라프. 디터 람스 + 한스 구겔로트, 1956.",
    body: null,
    cover_url: null,
    status: "verified",
    merged_into: null,
    created_by: "u-001",
    created_at: "2025-06-01T09:00:00Z",
    updated_at: "2025-11-21T09:00:00Z",
  },
  {
    id: "t-tadao",
    slug: "안도-타다오",
    title: "안도 타다오",
    aliases: ["Tadao Ando", "安藤忠雄"],
    type: "person",
    summary:
      "일본 건축가. 노출 콘크리트와 빛의 다룸으로 알려졌으며, 빛의 교회를 설계했다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-003",
    created_at: "2025-07-04T09:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "t-light-church",
    slug: "빛의-교회",
    title: "빛의 교회",
    aliases: ["Church of the Light", "光の教会"],
    type: "work",
    summary:
      "1989년 오사카 이바라키에 완성된 안도 타다오의 교회 건축. 콘크리트 벽의 십자가 절개에서 빛이 들어온다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-003",
    created_at: "2025-07-05T09:00:00Z",
    updated_at: "2025-12-30T09:00:00Z",
  },
  {
    id: "t-modernism",
    slug: "모더니즘",
    title: "모더니즘",
    aliases: ["Modernism"],
    type: "movement",
    summary:
      "19세기 말~20세기 중반의 광범위한 예술·건축·디자인 운동. 장식의 거부와 형태-기능의 일치를 강조했다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-04-22T09:00:00Z",
    updated_at: "2026-02-14T09:00:00Z",
  },
  {
    id: "t-berlin",
    slug: "베를린",
    title: "베를린",
    aliases: ["Berlin"],
    type: "place",
    summary: "독일의 수도. 분단과 통일, 그리고 그 잔향이 거리마다 남아 있다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-003",
    created_at: "2025-03-30T09:00:00Z",
    updated_at: "2026-02-02T09:00:00Z",
  },
  {
    id: "t-bowie",
    slug: "데이비드-보위",
    title: "데이비드 보위",
    aliases: ["David Bowie"],
    type: "person",
    summary:
      "영국의 음악가. 베를린 시기 3부작(Low, Heroes, Lodger)으로 음악과 도시 정서를 연결시켰다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-09-09T09:00:00Z",
    updated_at: "2026-01-04T09:00:00Z",
  },
  {
    id: "t-wallfall",
    slug: "베를린-장벽-붕괴",
    title: "베를린 장벽 붕괴",
    aliases: ["Fall of the Berlin Wall", "Mauerfall"],
    type: "event",
    summary: "1989년 11월 9일. 도시가 다시 이어진 밤.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-003",
    created_at: "2025-10-12T09:00:00Z",
    updated_at: "2025-12-01T09:00:00Z",
  },
  {
    id: "t-dessau",
    slug: "데사우",
    title: "데사우",
    aliases: ["Dessau"],
    type: "place",
    summary: "바우하우스가 1925년 옮겨 간 도시. 그로피우스의 학교 건물이 여전히 남아 있다.",
    body: null,
    cover_url: null,
    status: "community",
    merged_into: null,
    created_by: "u-001",
    created_at: "2025-11-03T09:00:00Z",
    updated_at: "2025-11-03T09:00:00Z",
  },
  {
    id: "t-ive",
    slug: "조너선-아이브",
    title: "조너선 아이브",
    aliases: ["Jony Ive", "Jonathan Ive"],
    type: "person",
    summary: "영국의 디자이너. 애플의 산업 디자인을 정립했다.",
    body: null,
    cover_url: null,
    status: "official",
    merged_into: null,
    created_by: "u-002",
    created_at: "2025-08-22T09:00:00Z",
    updated_at: "2026-01-17T09:00:00Z",
  },
];

// ---- connections -----------------------------------------------------------

export const connections: Connection[] = [
  { id: "c-1", from_thread: "t-rams",   to_thread: "t-braun",       relation: "member_of",       note: "1955–1995 수석 디자이너.", created_by: "u-002", created_at: "2025-05-13T09:00:00Z" },
  { id: "c-2", from_thread: "t-rams",   to_thread: "t-sk4",         relation: "created",         note: "한스 구겔로트와 공동.", created_by: "u-002", created_at: "2025-05-13T09:00:00Z" },
  { id: "c-3", from_thread: "t-rams",   to_thread: "t-bauhaus",     relation: "influenced_by",   note: "바우하우스 후예 — 울름 조형대학을 통해.", created_by: "u-002", created_at: "2025-05-14T09:00:00Z" },
  { id: "c-4", from_thread: "t-ive",    to_thread: "t-rams",        relation: "influenced_by",   note: "공공연히 인정.", created_by: "u-002", created_at: "2025-08-24T09:00:00Z" },
  { id: "c-5", from_thread: "t-bauhaus",to_thread: "t-dessau",      relation: "located_in",      note: "1925–1932.", created_by: "u-001", created_at: "2025-11-04T09:00:00Z" },
  { id: "c-6", from_thread: "t-bauhaus",to_thread: "t-modernism",   relation: "belongs_to",      note: null, created_by: "u-002", created_at: "2025-05-11T10:00:00Z" },
  { id: "c-7", from_thread: "t-tadao",  to_thread: "t-light-church",relation: "created",         note: null, created_by: "u-003", created_at: "2025-07-06T09:00:00Z" },
  { id: "c-8", from_thread: "t-bowie",  to_thread: "t-berlin",      relation: "located_in",      note: "베를린 시기 3부작.", created_by: "u-002", created_at: "2025-09-10T09:00:00Z" },
  { id: "c-9", from_thread: "t-wallfall",to_thread: "t-berlin",     relation: "located_in",      note: null, created_by: "u-003", created_at: "2025-10-13T09:00:00Z" },
  { id: "c-10",from_thread: "t-braun",  to_thread: "t-modernism",   relation: "belongs_to",      note: "산업 디자인 모더니즘.", created_by: "u-002", created_at: "2025-05-12T10:00:00Z" },
];

// ---- perspectives ----------------------------------------------------------

export const perspectives: Perspective[] = [
  {
    id: "p-1",
    thread_id: "t-bauhaus",
    title: "바우하우스는 교육 혁명이다.",
    body:
      "공예와 예술을 분리하지 않은 교육 과정 그 자체가 바우하우스의 본체였다. 결과물보다 커리큘럼이 더 오래 살아남았다.",
    stance: "intro",
    visibility: "public",
    created_by: "u-002",
    created_at: "2025-05-11T11:00:00Z",
    updated_at: "2025-05-11T11:00:00Z",
  },
  {
    id: "p-2",
    thread_id: "t-bauhaus",
    title: "바우하우스는 산업화의 산물이다.",
    body:
      "낭만이 아니라 대량 생산에 응답한 학교였다. 표준화·생산성·재료의 정직함은 모두 공장의 언어다.",
    stance: "critique",
    visibility: "public",
    created_by: "u-001",
    created_at: "2025-09-22T11:00:00Z",
    updated_at: "2025-09-22T11:00:00Z",
  },
  {
    id: "p-3",
    thread_id: "t-bauhaus",
    title: "바우하우스는 정치적 망명사의 일부다.",
    body:
      "1933년 폐교 이후 교수진과 학생들이 흩어진 경로가 곧 20세기 모더니즘의 세계 지도다.",
    stance: "context",
    visibility: "public",
    created_by: "u-003",
    created_at: "2025-11-30T11:00:00Z",
    updated_at: "2025-11-30T11:00:00Z",
  },
  {
    id: "p-4",
    thread_id: "t-rams",
    title: "10원칙은 모더니즘의 마지막 윤리 강령이다.",
    body:
      "‘좋은 디자인은 가능한 한 적은 디자인’ — 이 문장은 미학이 아니라 윤리다. 디자이너의 책임을 정의한다.",
    stance: "legacy",
    visibility: "public",
    created_by: "u-002",
    created_at: "2025-12-04T11:00:00Z",
    updated_at: "2025-12-04T11:00:00Z",
  },
  {
    id: "p-5",
    thread_id: "t-light-church",
    title: "빛은 재료다.",
    body:
      "안도의 건축에서 콘크리트는 그릇이고, 빛은 부어 넣는 재료다. 빛의 교회는 그 가장 단순한 증명.",
    stance: "personal",
    visibility: "public",
    created_by: "u-003",
    created_at: "2025-12-22T11:00:00Z",
    updated_at: "2025-12-22T11:00:00Z",
  },
];

// ---- records ---------------------------------------------------------------

export const records: RecordEntity[] = [
  {
    id: "r-1",
    thread_id: "t-light-church",
    body:
      "이바라키행 열차. 작은 마을의 골목에 콘크리트 벽이 갑자기 나타났다. 안에는 빛만 있었다.",
    media_url: null,
    visibility: "public",
    created_by: "u-001",
    created_at: "2026-04-12T13:30:00Z",
  },
  {
    id: "r-2",
    thread_id: "t-rams",
    body: "오늘 SK4를 실물로 봤다. 조작계의 무게가 정확히 검지의 무게다.",
    media_url: null,
    visibility: "public",
    created_by: "u-001",
    created_at: "2026-05-03T10:10:00Z",
  },
  {
    id: "r-3",
    thread_id: null,
    body: "도시는 이어진 실마리다. 따로 떨어진 페이지가 아니라.",
    media_url: null,
    visibility: "private",
    created_by: "u-001",
    created_at: "2026-05-20T22:00:00Z",
  },
];

// ---- collections -----------------------------------------------------------

export const collections: Collection[] = [
  {
    id: "col-1",
    slug: "바우하우스-입문",
    title: "바우하우스 입문",
    description: "처음 듣는 사람을 위한 7개의 실마리.",
    cover_url: null,
    visibility: "public",
    created_by: "u-002",
    created_at: "2025-12-01T09:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "col-2",
    slug: "디터-람스와-애플",
    title: "디터 람스와 애플",
    description: "10원칙이 어떻게 캘리포니아로 건너갔는가.",
    cover_url: null,
    visibility: "public",
    created_by: "u-001",
    created_at: "2026-02-09T09:00:00Z",
    updated_at: "2026-02-09T09:00:00Z",
  },
  {
    id: "col-3",
    slug: "일본-건축-순례",
    title: "일본 건축 순례",
    description: "안도, 쿠마, 이토 — 빛과 그림자의 계보.",
    cover_url: null,
    visibility: "public",
    created_by: "u-003",
    created_at: "2026-03-15T09:00:00Z",
    updated_at: "2026-03-15T09:00:00Z",
  },
];

export const collectionItems: CollectionItem[] = [
  { collection_id: "col-1", thread_id: "t-bauhaus",   position: 0, note: null, added_at: "2025-12-01T09:00:00Z" },
  { collection_id: "col-1", thread_id: "t-dessau",    position: 1, note: null, added_at: "2025-12-01T09:00:00Z" },
  { collection_id: "col-1", thread_id: "t-modernism", position: 2, note: null, added_at: "2025-12-01T09:00:00Z" },
  { collection_id: "col-2", thread_id: "t-rams",      position: 0, note: null, added_at: "2026-02-09T09:00:00Z" },
  { collection_id: "col-2", thread_id: "t-braun",     position: 1, note: null, added_at: "2026-02-09T09:00:00Z" },
  { collection_id: "col-2", thread_id: "t-sk4",       position: 2, note: null, added_at: "2026-02-09T09:00:00Z" },
  { collection_id: "col-2", thread_id: "t-ive",       position: 3, note: null, added_at: "2026-02-09T09:00:00Z" },
  { collection_id: "col-3", thread_id: "t-tadao",     position: 0, note: null, added_at: "2026-03-15T09:00:00Z" },
  { collection_id: "col-3", thread_id: "t-light-church", position: 1, note: null, added_at: "2026-03-15T09:00:00Z" },
];

// ---- bookmarks -------------------------------------------------------------

export const bookmarks: Bookmark[] = [
  { user_id: "u-001", thread_id: "t-rams",         created_at: "2026-01-08T09:00:00Z" },
  { user_id: "u-001", thread_id: "t-bauhaus",      created_at: "2026-01-12T09:00:00Z" },
  { user_id: "u-001", thread_id: "t-light-church", created_at: "2026-04-12T09:00:00Z" },
  { user_id: "u-001", thread_id: "t-tadao",        created_at: "2026-04-12T09:00:00Z" },
  { user_id: "u-001", thread_id: "t-sk4",          created_at: "2026-05-03T09:00:00Z" },
];

// ---- derived helpers -------------------------------------------------------

function countBy<T>(arr: T[], pred: (x: T) => boolean): number {
  let n = 0;
  for (const x of arr) if (pred(x)) n++;
  return n;
}

export function signalFor(threadId: string): ThreadSignal {
  return {
    thread_id: threadId,
    bookmarks_count:       countBy(bookmarks,        (b) => b.thread_id === threadId),
    connections_count:     countBy(connections,      (c) => c.from_thread === threadId || c.to_thread === threadId),
    collection_inclusions: countBy(collectionItems,  (i) => i.thread_id === threadId),
    records_count:         countBy(records,          (r) => r.thread_id === threadId),
    perspectives_count:    countBy(perspectives,     (p) => p.thread_id === threadId),
    likes_count:           0,
  };
}

export function score(threadId: string): number {
  const s = signalFor(threadId);
  return (
    s.bookmarks_count       * 3.0 +
    s.connections_count     * 4.0 +
    s.collection_inclusions * 4.0 +
    s.records_count         * 5.0 +
    s.perspectives_count    * 5.0 +
    s.likes_count           * 0.5
  );
}

export function findThread(idOrSlug: string): Thread | undefined {
  return threads.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

export function findUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function threadsByType(type: Thread["type"]): Thread[] {
  return threads.filter((t) => t.type === type && t.status !== "merged" && t.status !== "archived");
}

export function publicThreads(): Thread[] {
  return threads.filter((t) => t.status === "community" || t.status === "verified" || t.status === "official");
}

export function recommendedThreads(limit = 6): Thread[] {
  return [...publicThreads()]
    .map((t) => ({ t, s: score(t.id) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.t);
}

export function perspectivesOf(threadId: string): Perspective[] {
  return perspectives.filter((p) => p.thread_id === threadId);
}

export function connectionsOf(threadId: string): Connection[] {
  return connections.filter((c) => c.from_thread === threadId || c.to_thread === threadId);
}

export function recordsOf(threadId: string): RecordEntity[] {
  return records.filter((r) => r.thread_id === threadId);
}

export function collectionsContaining(threadId: string): Collection[] {
  const ids = new Set(collectionItems.filter((i) => i.thread_id === threadId).map((i) => i.collection_id));
  return collections.filter((c) => ids.has(c.id));
}

export function userStats(userId: string): {
  records: number; collections: number; discovered: number; connected: number;
} {
  return {
    records:     countBy(records,     (r) => r.created_by === userId),
    collections: countBy(collections, (c) => c.created_by === userId),
    discovered:  countBy(threads,     (t) => t.created_by === userId),
    connected:   countBy(connections, (c) => c.created_by === userId),
  };
}
