import Link from "next/link";
import { AuthGuard } from "@/features/auth/AuthGuard";

const items = [
  {
    href: "/create/thread",
    title: "실마리 생성",
    body: "인물, 작품, 사조, 장소, 사건 — 새 실마리를 시작하세요. 초안은 즉시 본인 지도에 반영됩니다.",
  },
  {
    href: "/create/perspective",
    title: "관점 작성",
    body: "기존 실마리에 새 관점을 더하세요. 같은 대상에 여러 해석이 공존할 수 있습니다.",
  },
  {
    href: "/create/record",
    title: "개인 기록 작성",
    body: "오늘 본 것, 생각한 것을 짧게 남기세요. 특정 실마리에 묶거나, 자유롭게 둘 수 있습니다.",
  },
  {
    href: "/create/collection",
    title: "컬렉션 생성",
    body: "실마리들을 묶어 자신만의 큐레이션을 만드세요.",
  },
  {
    href: "/create/link",
    title: "링크 저장",
    body: "URL을 저장하고 어느 실마리에 붙일지 고르세요. 출처가 곧 단서입니다.",
  },
];

export default function CreatePage() {
  return (
    <AuthGuard>
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl text-ink-900">무엇을 만들까요?</h1>
        <p className="mt-2 text-sm text-ink-500">
          공식 승인 없이도 본인 지도에는 즉시 반영됩니다. 시작이 결과를 막지 않게.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block border border-ink-200 rounded-xl2 bg-white p-6 hover:border-ink-300 transition-colors"
          >
            <h2 className="font-serif text-xl text-ink-800">{it.title}</h2>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">{it.body}</p>
            <p className="mt-4 text-xs text-ink-400">시작하기 →</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-ink-400">
        ※ 로그인한 사용자만 이 페이지에 들어올 수 있습니다. 각 생성 폼은 이후 작업에서 연결됩니다.
      </p>
    </div>
    </AuthGuard>
  );
}
