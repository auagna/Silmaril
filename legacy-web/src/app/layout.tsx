import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silmaril",
  description: "연결된 실마리를 따라 탐구하며 자신만의 지도를 만드는 아카이빙 플랫폼.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ink-50 text-ink-800">
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl px-6 py-12 text-xs text-ink-400">
          Silmaril — 연결된 실마리를 따라.
        </footer>
      </body>
    </html>
  );
}
