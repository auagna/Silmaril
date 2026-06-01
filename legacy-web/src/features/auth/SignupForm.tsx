"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signUp } from "./authService";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await signUp({ email, password, username, name });

      // 이메일 확인이 꺼져 있으면 세션이 바로 발급됨 → 홈으로.
      // 켜져 있으면 세션이 없음 → 로그인 페이지로 (메일 확인 후 로그인).
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="이름"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <Input
        placeholder="사용자 이름 (handle)"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="비밀번호 (6자 이상)"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
