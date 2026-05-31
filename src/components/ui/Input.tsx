import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800",
        "placeholder:text-ink-400 focus:outline-none focus:border-ink-400",
        className,
      )}
      {...props}
    />
  );
}
