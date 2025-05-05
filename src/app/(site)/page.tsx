"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">GymApp</h1>
      {user ? (
        <p>Välkommen tillbaka, {user.email}!</p>
      ) : (
        <p>
          <Link href="/login" className="underline">
            Logga in
          </Link>{" "}
          eller{" "}
          <Link href="/register" className="underline">
            registrera dig
          </Link>{" "}
          för att börja logga dina pass.
        </p>
      )}
    </main>
  );
}
