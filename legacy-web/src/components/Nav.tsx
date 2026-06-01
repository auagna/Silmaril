import Link from "next/link";
import { AuthMenu } from "@/features/auth/AuthMenu";

const items = [
  { href: "/",        label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/create",  label: "Create" },
  { href: "/map",     label: "Map" },
  { href: "/profile", label: "Profile" },
];

export function Nav() {
  return (
    <header className="border-b border-ink-200 bg-ink-50/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight text-ink-800">
          Silmaril
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-600">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="hover:text-ink-900 transition-colors"
            >
              {it.label}
            </Link>
          ))}
          <AuthMenu />
        </nav>
      </div>
    </header>
  );
}
