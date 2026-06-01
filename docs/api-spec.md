# API Spec (MVP)

> 클라이언트(Expo)에서 Supabase 를 직접 호출하는 서비스 함수. 위치: `src/features/*/*Service.ts`.
> 모든 함수는 RLS 범위 안에서 동작. 정본: [erd.md](./erd.md).

## Threads

```ts
getThreads(opts?: { type?: ThreadType; limit?: number; cursor?: string }): Promise<Thread[]>
// status in (community, official) 또는 본인 것. Home/피드용.

getThreadById(id: string): Promise<Thread | null>
// 단건. slug 또는 uuid. 상세 화면.

searchThreads(q: string, opts?: { type?: ThreadType }): Promise<Thread[]>
// title/aliases ilike + 타입 필터. Search 탭.
```

## Save (저장 — 1초 안에)

```ts
saveThread(threadId: string): Promise<void>
// bookmarks upsert + user_thread_activity(kind='bookmark'). 낙관적 UI 권장.

unsaveThread(threadId: string): Promise<void>

getSavedThreads(opts?: { limit?: number; cursor?: string }): Promise<Thread[]>
// Records 탭 '저장' 섹션.
```

## Records (기록 — 선택)

```ts
createRecord(input: { threadId?: string; body: string; mediaUrl?: string; visibility?: Visibility }): Promise<Record>
// threadId 없어도 됨 (자유 기록). 가볍게.

getUserRecords(opts?: { threadId?: string }): Promise<Record[]>
```

## Collections

```ts
createCollection(input: { title: string; description?: string; visibility?: Visibility }): Promise<Collection>

addThreadToCollection(collectionId: string, threadId: string, note?: string): Promise<void>
// collection_items insert (+ position).

getUserCollections(): Promise<Collection[]>
getCollectionItems(collectionId: string): Promise<Thread[]>
```

## Connections

```ts
getThreadConnections(threadId: string): Promise<Connection[]>
// from/to 양방향. 상세의 '연결' 리스트.
```

## Explore / Atlas

```ts
getUndiscoveredThreads(opts?: { limit?: number }): Promise<Thread[]>
// 저장 thread 들의 연결 이웃 − (이미 저장/조회한 것). 사용자 용어 '미발견'.

getUserExploreMap(): Promise<ExploreMap>
// Atlas 데이터: 저장 노드 + 연결 + 진행률(예: 일본 건축 32%, 기능주의 18%, 미발견 6개).
// type ExploreMap = { nodes: AtlasNode[]; edges: AtlasEdge[]; progress: { label: string; pct: number }[]; undiscoveredCount: number }
```

## 규칙 / 메모

- **저장은 1초 안에**: 낙관적 업데이트(로컬 상태 먼저, 실패 시 롤백).
- `getUndiscoveredThreads` 결과를 UI에 `???`/`Fog`/`Locked` 로 절대 표기하지 않음 → **미발견 / 미확인 실마리 / 새로운 흔적**.
- AI Wiki(v0.2)는 Edge Function: `seedThreadWiki(topic) → threads(origin='ai') + thread_connections(origin='ai')`. MVP 클라이언트엔 없음.
- 페이지네이션은 cursor 기반(생성시각/슬러그) 권장.
- 타입(`Thread`, `Connection`, `Record`, `Collection`, `Visibility`, `ThreadType`)은 `src/types/database.ts`.
