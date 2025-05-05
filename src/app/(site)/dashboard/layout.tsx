"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect om inte inloggad
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  //Visa inget medans auth kontrolleras
  if (user === null) return null;

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
