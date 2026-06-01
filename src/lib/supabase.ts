// Supabase 클라이언트 (React Native). 세션은 AsyncStorage 에 저장.
// env 미설정 시 null → 앱은 더미 데이터로 동작 (생성 흐름을 막지 않는다).
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** 쓰기 작업용 — 미설정 시 친절한 에러. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase가 설정되지 않았습니다. .env.local 의 EXPO_PUBLIC_SUPABASE_URL / ANON_KEY 를 확인하세요.",
    );
  }
  return supabase;
}
