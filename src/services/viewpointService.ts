// Viewpoint 서비스 — mock-first / supabase-ready (PHASE 47).
import { supabase } from "@/lib/supabase";
import { getViewpoints as dummyViewpoints } from "@/lib/dummy";
import type { Viewpoint, Locale } from "@/types/database";

export async function getViewpoints(threadId: string, locale: Locale): Promise<Viewpoint[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("viewpoints").select("*").eq("thread_id", threadId);
      if (!error && data && data.length > 0) {
        // locale 우선 정렬 (현재 locale 먼저)
        return (data as Viewpoint[]).sort((a, b) => (a.locale === locale ? -1 : 0) - (b.locale === locale ? -1 : 0));
      }
    } catch {
      /* fallthrough */
    }
  }
  return dummyViewpoints(threadId, locale);
}
