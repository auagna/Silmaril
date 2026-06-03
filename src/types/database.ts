// Silmaril 도메인 타입 — Supabase 스키마(supabase/schema.sql)와 1:1 정렬.
// 정본: docs/erd.md · docs/canonical-knowledge-model.md

import type { Locale } from "@/i18n";
export type { Locale };

export type UserRole = "user" | "partner" | "admin";

// MVP enum (확장 추후: event/company/book/film/music/media)
export type ThreadType =
  | "person"
  | "work"
  | "movement"
  | "place"
  | "concept"
  | "organization";

export type ThreadStatus =
  | "local"
  | "community"
  | "verified"
  | "official"
  | "merged"
  | "archived";

export type Visibility = "private" | "public" | "followers";

// 연결 타입 (relation_type, text). 정본 방향 1개 저장 + 역방향 보강.
export type RelationType =
  | "influenced_by"
  | "influenced"
  | "created"
  | "created_by"
  | "belongs_to"
  | "part_of"
  | "located_in"
  | "contemporary_of"
  | "related_to"
  | "shares_theme";

// 1 = 사실 기반, 2 = 해석 기반
export type ConnectionTier = 1 | 2;

export interface User {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  title: string;
  slug: string;
  type: ThreadType;
  summary: string | null;
  description: string | null;
  cover_image_url: string | null;
  status: ThreadStatus;
  created_by: string | null;
  trust_score: number;
  completion_score: number;
  merged_into_thread_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadConnection {
  id: string;
  from_thread_id: string;
  to_thread_id: string;
  relation_type: RelationType;
  connection_tier: ConnectionTier;
  description: string | null;
  created_by: string | null;
  status: ThreadStatus;
  trust_score: number;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  thread_id: string;
  created_at: string;
}

export interface Record {
  id: string;
  created_by: string;
  thread_id: string | null;
  content: string;
  media_url: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  created_by: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  visibility: Visibility;
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

export interface UserThreadActivity {
  id: string;
  user_id: string;
  thread_id: string;
  viewed: boolean;
  saved: boolean;
  recorded: boolean;
  added_to_collection: boolean;
  last_viewed_at: string | null;
}

export interface Source {
  id: string;
  thread_id: string | null;
  url: string;
  title: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

// ── i18n (Thread + i18n 레이어, D-018/Step 26) ──────────────
// Thread 는 canonical(title/slug/type 등). 표시 텍스트(title/summary/description)는
// thread_translations 에서 locale 별로. (Keyword 모델 = Thread 로 매핑.)
export interface ThreadTranslation {
  id: string;
  thread_id: string;
  locale: Locale;
  title: string;
  summary: string;
  description?: string | null;
}

export type ViewpointAuthor = "user" | "curator" | "system";

export interface Viewpoint {
  id: string;
  thread_id: string;
  locale: Locale;
  author_type: ViewpointAuthor;
  title: string;
  body: string;
  created_at: string;
}

// 사용자 노출 라벨 — Search 타입 필터. concept=개념 포함.
export const THREAD_TYPE_LABEL: { [K in ThreadType]: string } = {
  person: "인물",
  work: "작품",
  movement: "사조",
  place: "장소",
  concept: "개념",
  organization: "조직",
};

export const MVP_THREAD_TYPES: ThreadType[] = [
  "person",
  "work",
  "movement",
  "place",
  "concept",
  "organization",
];

export const RELATION_LABEL: { [K in RelationType]: string } = {
  influenced_by: "영향받음",
  influenced: "영향줌",
  created: "만듦",
  created_by: "만들어짐",
  belongs_to: "속함",
  part_of: "일부",
  located_in: "위치",
  contemporary_of: "동시대",
  related_to: "관련",
  shares_theme: "주제 공유",
};
