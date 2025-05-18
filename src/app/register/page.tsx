"use client";

import { useState } from "react";
import { RegisterSchema } from "@/lib/schemas/auth";
import { extractZodError } from "@/lib/utils/zodErrors";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/gymappTransparent.png"
          alt="GymApp logotyp"
          width={200}
          height={200}
          className="mx-auto mb-6"
          priority
        />
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="autofill:bg-black w-full rounded border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300
             dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
            autoComplete="off"
          />
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="autofill:bg-black w-full mt-4 rounded border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-gray-300
             dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="autofill:bg-black w-full mt-4 rounded border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-gray-300
             dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
            autoComplete="new-password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm">Registrering lyckades! 🎉</p>
          )}
          <button
            type="submit"
            className="px-6 py-2 mt-4 rounded-xl border border-black text-black dark:border-white dark:text-white hover:scale-105 transition-transform"
          >
            Registrera
          </button>
        </form>
      </motion.div>
    </main>
  );
}
