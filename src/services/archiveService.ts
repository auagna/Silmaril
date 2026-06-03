// Archive 서비스 (PHASE 47). 로그인 시 Supabase bookmarks, 비로그인 시 화면이 local saves store 사용.
// 여기서는 Supabase 경로만 제공 — 호출 측이 userId 유무로 분기.
import { supabase } from "@/lib/supabase";

export async function getUserArchives(userId: string): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from("bookmarks").select("thread_id").eq("user_id", userId);
    if (error || !data) return [];
    return data.map((r: { thread_id: string }) => r.thread_id);
  } catch {
    return [];
  }
}

export async function addArchive(userId: string, threadId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("bookmarks").upsert({ user_id: userId, thread_id: threadId }, { onConflict: "user_id,thread_id" });
  } catch {
    /* no-op (offline) */
  }
}

export async function removeArchive(userId: string, threadId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("bookmarks").delete().eq("user_id", userId).eq("thread_id", threadId);
  } catch {
    /* no-op */
  }
}
