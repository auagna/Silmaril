// 인증 컨텍스트 (PHASE 45). Supabase 세션 구독 + 비로그인 guest fallback.
// 비로그인 상태에서도 Map 탐험은 동작(local store). 저장/작성 시 로그인 유도.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthValue {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  handle: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        /* no-op */
      }
    }
    setUser(null);
  }

  const handle =
    (user?.user_metadata?.username as string | undefined) ?? user?.email ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, isGuest: !user, handle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) return { user: null, loading: false, isGuest: true, handle: null, signOut: async () => {} };
  return ctx;
}
