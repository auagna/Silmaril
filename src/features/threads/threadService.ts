// ============================================================================
// Thread service — Supabase 쓰기/읽기.
// ----------------------------------------------------------------------------
// 주의:
//  - 우리 스키마 컬럼은 summary / body (스펙의 description 은 body 로 매핑).
//  - slug 는 전역 UNIQUE. 같은 제목이 이미 있으면 -2, -3 … 접미사로 자동 회피한다.
//    (D-005: 사용자가 생성을 망설이지 않게. 중복 정리는 이후 큐레이터가 merged 로.)
//  - status 는 local | community 만 클라이언트에서 생성 가능.
//    verified/official 은 검증/관리 흐름에서만.
// ============================================================================

import { requireSupabaseBrowser } from "@/lib/supabase";
import type { Thread, ThreadStatus, ThreadType } from "@/types/domain";

export async function createThread(input: {
  title: string;
  slug: string;
  type: ThreadType;
  summary: string;
  body?: string;
  status: Extract<ThreadStatus, "local" | "community">;
  createdBy: string;
}): Promise<Thread> {
  const supabase = requireSupabaseBrowser();

  // slug 충돌 시 접미사 회피 (최대 6회).
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = attempt === 0 ? input.slug : `${input.slug}-${attempt + 1}`;

    const { data, error } = await supabase
      .from("threads")
      .insert({
        title: input.title,
        slug: candidate,
        type: input.type,
        summary: input.summary,
        body: input.body ?? null,
        status: input.status,
        created_by: input.createdBy,
      })
      .select("*")
      .single();

    if (!error) return data as Thread;

    // 23505 = unique_violation (slug 중복) → 다음 접미사로 재시도.
    if (error.code === "23505") continue;

    throw new Error(error.message);
  }

  throw new Error("같은 이름의 실마리가 너무 많습니다. 제목을 조금 바꿔보세요.");
}

/** slug 로 실마리 단건 조회. RLS 범위 안에서만 보인다 (local 은 본인만). */
export async function getThreadBySlug(slug: string): Promise<Thread | null> {
  const supabase = requireSupabaseBrowser();
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Thread) ?? null;
}
