import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-sm text-ink-400">Silmaril</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">회원가입</h1>
      </div>

      <Card>
        <SignupForm />
      </Card>

      <p className="text-sm text-ink-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="text-ink-800 underline">
          로그인
        </Link>
      </p>
    </section>
  );
}
