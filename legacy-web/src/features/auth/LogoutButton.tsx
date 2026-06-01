"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signOut } from "./authService";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5">
      로그아웃
    </Button>
  );
}
