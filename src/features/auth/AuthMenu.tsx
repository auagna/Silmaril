"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./authService";
import { LogoutButton } from "./LogoutButton";

/** Nav 우측 메뉴 — 로그인 상태에 따라 로그인 링크 / 로그아웃 버튼. */
export function AuthMenu() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => {
      if (active) setAuthed(!!user);
    });
    return () => {
      active = false;
    };
  }, []);

  if (authed === null) return null; // 깜빡임 방지

  if (authed) return <LogoutButton />;

  return (
    <Link href="/login" className="hover:text-ink-900 transition-colors">
      로그인
    </Link>
  );
}
