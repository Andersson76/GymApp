"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Fel vid inloggning");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Något gick fel. Försök igen.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-semibold mb-4">Logga in</h1>
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="flex flex-col space-y-4"
      >
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
