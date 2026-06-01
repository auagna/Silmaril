"use client";

import { useEffect, useState } from "react";
import type { Thread } from "@/types/domain";
import { EmptyState } from "@/components/EmptyState";
import { ThreadHeader } from "./ThreadHeader";
import { getThreadBySlug } from "./threadService";

/**
 * 더미에 없는 실마리(= 방금 생성한 실데이터)를 브라우저 클라이언트로 읽어 렌더한다.
 * 브라우저 세션을 쓰므로 본인의 local 실마리도 RLS 안에서 보인다.
 * 관점/연결/기록의 실데이터 연결은 N3 에서 이 뷰를 확장한다.
 */
export function ThreadLiveView({ slug }: { slug: string }) {
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    let active = true;
    getThreadBySlug(slug)
      .then((data) => {
        if (!active) return;
        if (data) {
          setThread(data);
          setState("found");
        } else {
          setState("missing");
        }
      })
      .catch(() => active && setState("missing"));
    return () => {
      active = false;
    };
  }, [slug]);

  if (state === "loading") {
    return <p className="py-16 text-center text-sm text-ink-400">불러오는 중…</p>;
  }

  if (state === "missing" || !thread) {
    return (
      <EmptyState
        title="실마리를 찾을 수 없습니다."
        hint="삭제되었거나, 다른 사용자의 비공개(local) 실마리일 수 있어요."
        cta={{ href: "/explore", label: "탐색으로 돌아가기" }}
      />
    );
  }

  return (
    <article className="space-y-10">
      <ThreadHeader thread={thread} />
      {thread.body && (
        <section className="max-w-prose whitespace-pre-line leading-relaxed text-ink-700">
          {thread.body}
        </section>
      )}
      <p className="text-sm text-ink-400">
        관점 · 연결 · 기록은 다음 단계에서 이 실마리에 연결됩니다.
      </p>
    </article>
  );
}
