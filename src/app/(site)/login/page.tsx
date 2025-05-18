"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Image from "next/image";
import ToggleDarkMode from "@/components/ToggleDarkMode";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Inloggning misslyckades");
        return;
      }

      const { token } = await res.json();
      login(token);
      router.push("/dashboard");
    } catch (err) {
      console.log("Error: ", err);
      setError("Kunde inte kontakta servern:");
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            autoComplete="off"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="autofill:bg-black w-full rounded border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300
             dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
          />
          <input
            type="password"
            autoComplete="off"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="autofill:bg-black w-full mt-4 rounded border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-gray-300
             dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
          />
          <button
            type="submit"
            className="px-6 py-2 mt-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform"
          >
            Logga in
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </motion.div>
      <ToggleDarkMode />
    </main>
  );
}
