// ============================================================================
// Supabase client
// ----------------------------------------------------------------------------
// MVP note: lazy + tolerant of missing env vars so the dummy UI still builds.
// Real auth / SSR client wiring lands in M2 with @supabase/ssr.
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _browser: SupabaseClient | null = null;

/**
 * Browser-side Supabase client. Returns null if env vars are not set so the
 * UI can fall back to dummy data during early development.
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  if (_browser) return _browser;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  _browser = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _browser;
}

/**
 * Server-side Supabase client. Use only in server components, route handlers,
 * or server actions. Falls back to anon key if service role is not provided.
 *
 * IMPORTANT: do not expose service role key to the client.
 */
export function getSupabaseServer(opts?: { admin?: boolean }): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return null;

  const key = opts?.admin && service ? service : anon;
  if (!key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** 브라우저 클라이언트를 반환하되, 미설정이면 친절한 에러를 던진다. (쓰기 작업용) */
export function requireSupabaseBrowser(): SupabaseClient {
  const client = getSupabaseBrowser();
  if (!client) {
    throw new Error(
      "Supabase가 설정되지 않았습니다. .env.local 의 URL / anon key 를 확인하세요.",
    );
  }
  return client;
}
