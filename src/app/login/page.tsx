import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-sm text-ink-400">Silmaril</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">로그인</h1>
      </div>

      <Card>
        <LoginForm />
      </Card>

      <p className="text-sm text-ink-500">
        아직 계정이 없나요?{" "}
        <Link href="/signup" className="text-ink-800 underline">
          회원가입
        </Link>
      </p>
    </section>
  );
}
