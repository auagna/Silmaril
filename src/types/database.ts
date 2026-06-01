// Silmaril 도메인 타입 — Supabase 스키마(ERD)와 1:1. 정본: docs/erd.md.

export type ThreadType =
  | "person"
  | "work"
  | "movement"
  | "place"
  | "concept"
  | "organization"
  // 확장(추후): event/company/book/film/music/media
  | "event"
  | "company"
  | "book"
  | "film"
  | "music"
  | "media";

export type ThreadStatus =
  | "local"
  | "community"
  | "verified"
  | "official"
  | "merged"
  | "archived";

export type Origin = "ai" | "user" | "curator";

export type Visibility = "private" | "followers" | "public";

export type RelationKind =
  | "influenced_by"
  | "created"
  | "member_of"
  | "located_in"
  | "contemporary_of"
  | "related_to"
  | "derived_from"
  | "belongs_to";

export interface User {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
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
  origin: Origin;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ThreadConnection {
  id: string;
  from_thread: string;
  to_thread: string;
  relation: RelationKind;
  note: string | null;
  origin: Origin;
  created_by: string;
  created_at: string;
}

export interface Bookmark {
  user_id: string;
  thread_id: string;
  created_at: string;
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

// 사용자 노출 라벨 (Search 타입 필터 등). `concept`=개념 포함.
export const THREAD_TYPE_LABEL: { [K in ThreadType]: string } = {
  person: "인물",
  work: "작품",
  movement: "사조",
  place: "장소",
  concept: "개념",
  organization: "조직",
  event: "사건",
  company: "기업",
  book: "책",
  film: "영화",
  music: "음악",
  media: "매체",
};

// MVP 검색/필터에 노출할 타입 순서.
export const MVP_THREAD_TYPES: ThreadType[] = [
  "person",
  "work",
  "movement",
  "place",
  "concept",
  "organization",
];

export const RELATION_LABEL: { [K in RelationKind]: string } = {
  influenced_by: "영향받음",
  created: "만듦",
  member_of: "소속",
  located_in: "위치",
  contemporary_of: "동시대",
  related_to: "관련",
  derived_from: "파생",
  belongs_to: "속함",
};
