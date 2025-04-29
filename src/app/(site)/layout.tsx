"use client";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
