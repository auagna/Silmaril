"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getCurrentUser } from "@/features/auth/authService";
import {
  THREAD_TYPES,
  THREAD_TYPE_LABEL,
  type ThreadStatus,
  type ThreadType,
} from "@/types/domain";
import { createSlug } from "./slug";
import { createThread } from "./threadService";

const fieldClass =
  "mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-ink-400";

export function ThreadCreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ThreadType>("person");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] =
    useState<Extract<ThreadStatus, "local" | "community">>("local");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const slug = createSlug(title);
      if (!slug) {
        throw new Error("실마리 제목을 다시 확인해주세요.");
      }

      const thread = await createThread({
        title,
        slug,
        type,
        summary,
        body,
        status,
        createdBy: user.id,
      });

      router.push(`/threads/${encodeURIComponent(thread.slug)}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "실마리 생성에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700">실마리 이름</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 디터 람스, 바우하우스, 브라운"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">유형</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ThreadType)}
            className={fieldClass}
          >
            {THREAD_TYPES.map((value) => (
              <option key={value} value={value}>
                {THREAD_TYPE_LABEL[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">한 줄 요약</label>
          <Input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="이 실마리를 한 문장으로 설명해주세요."
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">설명</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="아직 완벽하지 않아도 됩니다. 먼저 기록하세요."
            className={`${fieldClass} min-h-32 leading-6`}
          />
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="text-sm font-medium text-ink-700">공개 상태</p>

        <label className="flex items-start gap-3 rounded-xl border border-ink-200 p-4">
          <input
            type="radio"
            name="status"
            value="local"
            checked={status === "local"}
            onChange={() => setStatus("local")}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium text-ink-800">Local</span>
            <span className="block text-sm leading-6 text-ink-500">
              내 지도와 기록에서만 사용합니다.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-ink-200 p-4">
          <input
            type="radio"
            name="status"
            value="community"
            checked={status === "community"}
            onChange={() => setStatus("community")}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium text-ink-800">Community</span>
            <span className="block text-sm leading-6 text-ink-500">
              다른 탐험자도 볼 수 있게 공개합니다.
            </span>
          </span>
        </label>
      </Card>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "생성 중..." : "실마리 생성"}
      </Button>
    </form>
  );
}
