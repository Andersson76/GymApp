"use client";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">GymApp</h1>
      {user ? (
        <p>Välkommen tillbaka, {user.email}!</p>
      ) : (
        <p>
          Vänligen{" "}
          <a href="/login" className="underline">
            logga in
          </a>{" "}
          för att använda tjänsten.
        </p>
      )}
    </main>
  );
}
