// 인증 서비스 (RN). 프로필 행은 handle_new_user 트리거가 생성 (username→handle, name→display_name).
import { requireSupabase, supabase } from "@/lib/supabase";

export async function signUp(input: { email: string; password: string; username: string; name: string }) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { username: input.username, name: input.name } },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signIn(input: { email: string; password: string }) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const sb = requireSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
