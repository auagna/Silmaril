// ============================================================================
// Silmaril — Domain types
// Mirrors supabase/schema.sql 1:1. Keep them in sync.
// ============================================================================

export type ThreadType =
  | "person"
  | "work"
  | "movement"
  | "place"
  | "event"
  | "organization"
  | "company"
  | "media"
  | "book"
  | "film"
  | "music";

export const THREAD_TYPES: ThreadType[] = [
  "person", "work", "movement", "place", "event",
  "organization", "company", "media", "book", "film", "music",
];

export const THREAD_TYPE_LABEL: { [K in ThreadType]: string } = {
  person:       "인물",
  work:         "작품",
  movement:     "사조",
  place:        "장소",
  event:        "사건",
  organization: "기관",
  company:      "기업",
  media:        "미디어",
  book:         "책",
  film:         "영화",
  music:        "음악",
};

export type ThreadStatus =
  | "local"
  | "community"
  | "verified"
  | "official"
  | "merged"
  | "archived";

export const THREAD_STATUS_LABEL: { [K in ThreadStatus]: string } = {
  local:     "로컬",
  community: "커뮤니티",
  verified:  "검증됨",
  official:  "공식",
  merged:    "병합됨",
  archived:  "보관",
};

export type Visibility = "private" | "followers" | "public";

export type UserRole = "member" | "partner" | "admin";

export type RelationKind =
  | "influenced_by"
  | "created"
  | "member_of"
  | "located_in"
  | "contemporary_of"
  | "related_to"
  | "derived_from"
  | "belongs_to";

export const RELATION_LABEL: { [K in RelationKind]: string } = {
  influenced_by:   "영향을 받음",
  created:         "만듦",
  member_of:       "소속",
  located_in:      "위치",
  contemporary_of: "동시대",
  related_to:      "관련",
  derived_from:    "파생",
  belongs_to:      "속함",
};

export type PerspectiveStance =
  | "intro"
  | "critique"
  | "context"
  | "legacy"
  | "personal"
  | "comparison";

export type SourceKind =
  | "article" | "book" | "video" | "audio" | "image" | "other";

export type TargetKind = "thread" | "perspective" | "record";

export type ReactionKind = "like";

export type ActivityKind =
  | "view" | "like" | "bookmark" | "record" | "connect" | "collect" | "perspective";

// ----------------------------------------------------------------------------
// Entities
// ----------------------------------------------------------------------------

export interface User {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
}

export interface Thread {
  id: string;
  slug: string;
  title: string;
  aliases: string[];
  type: ThreadType;
  summary: string | null;
  body: string | null;
  cover_url: string | null;
  status: ThreadStatus;
  merged_into: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  from_thread: string;
  to_thread: string;
  relation: RelationKind;
  note: string | null;
  created_by: string;
  created_at: string;
}

export interface Perspective {
  id: string;
  thread_id: string;
  title: string;
  body: string;
  stance: PerspectiveStance;
  visibility: Visibility;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Record {
  id: string;
  thread_id: string | null;
  body: string;
  media_url: string | null;
  visibility: Visibility;
  created_by: string;
  created_at: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  visibility: Visibility;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  collection_id: string;
  thread_id: string;
  position: number;
  note: string | null;
  added_at: string;
}

export interface Bookmark {
  user_id: string;
  thread_id: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  user_id: string;
  target_kind: TargetKind;
  target_id: string;
  kind: ReactionKind;
  created_at: string;
}

export interface Source {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  kind: SourceKind;
  attached_to_kind: TargetKind;
  attached_to_id: string;
  created_by: string;
  created_at: string;
}

export interface UserThreadActivity {
  user_id: string;
  thread_id: string;
  kind: ActivityKind;
  weight: number;
  last_at: string;
}

// ----------------------------------------------------------------------------
// Derived / view-only
// ----------------------------------------------------------------------------

export interface ThreadSignal {
  thread_id: string;
  bookmarks_count: number;
  connections_count: number;
  collection_inclusions: number;
  records_count: number;
  perspectives_count: number;
  likes_count: number;
}

export interface ThreadWithSignal extends Thread {
  signal?: ThreadSignal;
}
