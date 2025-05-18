"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";
import Header from "@/components/Header";

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar under header, vänster på desktop */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6 text-black dark:text-white bg-white dark:bg-gradient-to-b dark:from-black dark:to-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
