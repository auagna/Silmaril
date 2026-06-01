import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border border-ink-200 rounded-xl2 bg-white p-6", className)}>
      {children}
    </div>
  );
}
