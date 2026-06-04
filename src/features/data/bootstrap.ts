// PHASE 47: 앱 시작 시 Supabase 데이터를 로드해 더미를 hydrate. 실패/미설정/빈DB → 더미 유지.
import { supabase } from "@/lib/supabase";
import { hydrate } from "@/lib/dummy";
import type { Thread, ThreadConnection, ThreadTranslation, Viewpoint } from "@/types/database";

let started = false;

export async function loadRealData(): Promise<void> {
  if (started || !supabase) return;
  started = true;
  try {
    const { data: threads, error } = await supabase.from("threads").select("*");
    if (error || !threads || threads.length === 0) return; // seed 미적용 → 더미 유지
    const [tr, cn, vp] = await Promise.all([
      supabase.from("thread_translations").select("*"),
      supabase.from("thread_connections").select("*"),
      supabase.from("viewpoints").select("*"),
    ]);
    hydrate({
      threads: threads as Thread[],
      translations: (tr.data ?? []) as ThreadTranslation[],
      connections: (cn.data ?? []) as ThreadConnection[],
      viewpoints: (vp.data ?? []) as Viewpoint[],
      source: "supabase",
    });
  } catch {
    /* 네트워크/권한 문제 → 더미 유지 (앱 안 깨짐) */
  }
}
