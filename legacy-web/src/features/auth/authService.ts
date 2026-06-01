// ============================================================================
// Auth service — Supabase 인증 래퍼.
// ----------------------------------------------------------------------------
// 주의:
//  - public.users 프로필 행은 DB 트리거 handle_new_user() 가 자동 생성한다.
//    (가입 시 username → handle, name → display_name 으로 메타데이터에서 채움.)
//    => 클라이언트에서 users 에 직접 insert 하지 않는다. (트리거와 중복키 충돌 방지)
//  - role 은 컬럼 기본값 'member'. enum 은 member|partner|admin (= 'user' 없음).
//  - 클라이언트 전용 세션(localStorage). 서버 컴포넌트 세션 읽기는 N1(@supabase/ssr) 과제.
// ============================================================================

import { getSupabaseBrowser } from "@/lib/supabase";

function requireClient() {
  const client = getSupabaseBrowser();
  if (!client) {
    throw new Error(
      "Supabase가 설정되지 않았습니다. .env.local 의 URL / anon key 를 확인하세요.",
    );
  }
  return client;
}

export async function signUp(input: {
  email: string;
  password: string;
  username: string;
  name: string;
}) {
  const supabase = requireClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        username: input.username,
        name: input.name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // public.users 프로필은 handle_new_user 트리거가 생성한다. (위 메타데이터 사용)
  return data;
}

export async function signIn(input: { email: string; password: string }) {
  const supabase = requireClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const supabase = requireClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/** 현재 로그인 사용자(auth.users). 미설정/미로그인 시 null. */
export async function getCurrentUser() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}
