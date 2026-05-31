"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "./authService";

/**
 * 로그인한 사용자만 children 을 본다. 미로그인 시 /login 으로 보낸다.
 * 클라이언트 세션(localStorage) 기준. 서버 가드는 N1(@supabase/ssr) 이후 도입.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed">("checking");

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => {
      if (!active) return;
      if (!user) {
        router.replace("/login");
      } else {
        setStatus("authed");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (status === "checking") {
    return <p className="py-16 text-center text-sm text-ink-400">확인 중…</p>;
  }

  return <>{children}</>;
}
