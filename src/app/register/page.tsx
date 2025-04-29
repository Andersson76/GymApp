"use client";

import { useState } from "react";
import { RegisterSchema } from "@/lib/schemas/auth";
import { extractZodError } from "@/lib/utils/zodErrors";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const toValidate = { name, email, password };
    const result = RegisterSchema.safeParse(toValidate);

    if (!result.success) {
      const firstError = Object.values(result.error.format())[0];
      const errorMessage = extractZodError(firstError);

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Felaktigt ifylld registreringsdata");
      }
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrering misslyckades");
        return;
      }

      // Spara token och visa success
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");

      // Vänta 1-2 sekunder innan redirect, så man hinner se success-meddelandet
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setError("Kunde inte kommunicera med servern.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-semibold mb-4">Registrera dig</h1>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          autoComplete="off"
        />
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          autoComplete="new-password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">Registrering lyckades! 🎉</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Registrera
        </button>
      </form>
    </div>
  );
}
