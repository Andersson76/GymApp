import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr]">
      <aside className="bg-gray-100 p-4 border-r">
        <nav className="space-y-2">
          <Link href="/dashboard" className="block">
            🏠 Dashboard
          </Link>
          <Link href="/dashboard/logga-pass" className="block">
            ➕ Logga pass
          </Link>
          <Link href="/dashboard/historik" className="block">
            📆 Historik
          </Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
