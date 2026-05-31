import { AuthGuard } from "@/features/auth/AuthGuard";
import { ThreadCreateForm } from "@/features/threads/ThreadCreateForm";

export default function CreateThreadPage() {
  return (
    <AuthGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-sm text-ink-400">Create</p>
          <h1 className="mt-2 font-serif text-3xl text-ink-900">새 실마리 만들기</h1>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            완벽한 페이지를 만들 필요는 없습니다. 먼저 실마리를 남기고,
            나중에 관점과 자료를 더해가세요.
          </p>
        </div>

        <ThreadCreateForm />
      </section>
    </AuthGuard>
  );
}
