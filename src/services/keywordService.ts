// Keyword(=Thread) 서비스 — mock-first / supabase-ready (PHASE 23/47).
// supabase 설정+데이터 있으면 사용, 실패/없음 시 더미 fallback. (앱이 안 깨지게)
import { supabase } from "@/lib/supabase";
import {
  threads as dummyThreads,
  connections as dummyConnections,
  getThreadById as dummyGetById,
  searchThreads as dummySearch,
} from "@/lib/dummy";
import type { Thread, ThreadConnection, ThreadType } from "@/types/database";

export async function getKeywords(): Promise<Thread[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("threads").select("*").limit(1000);
      if (!error && data && data.length > 0) return data as Thread[];
    } catch {
      /* fallthrough → dummy */
    }
  }
  return dummyThreads;
}

export async function getKeywordById(id: string): Promise<Thread | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("threads").select("*").or(`id.eq.${id},slug.eq.${id}`).maybeSingle();
      if (!error && data) return data as Thread;
    } catch {
      /* fallthrough */
    }
  }
  return dummyGetById(id) ?? null;
}

export async function getKeywordRelations(): Promise<ThreadConnection[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("thread_connections").select("*").limit(5000);
      if (!error && data && data.length > 0) return data as ThreadConnection[];
    } catch {
      /* fallthrough */
    }
  }
  return dummyConnections;
}

export async function searchKeywords(q: string, type?: ThreadType): Promise<Thread[]> {
  if (supabase && q.trim() !== "") {
    try {
      let query = supabase.from("threads").select("*").ilike("title", `%${q}%`).limit(50);
      if (type) query = query.eq("type", type);
      const { data, error } = await query;
      if (!error && data) return data as Thread[];
    } catch {
      /* fallthrough */
    }
  }
  return dummySearch(q, type);
}
