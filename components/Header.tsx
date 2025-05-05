"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        GymApp
      </Link>
      <nav className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm">Inloggad som {user.email}</span>
            <button onClick={logout} className="text-blue-600 underline">
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-600 underline">
              Logga in
            </Link>
            <Link href="/register" className="text-blue-600 underline">
              Registrera
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
