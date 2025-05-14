"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // justera sökväg om nödvändigt

export default function Home() {
  const { user } = useAuth();

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

        {user ? (
          <>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Välkommen tillbaka, {user.name}!
            </p>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="px-6 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform"
              >
                Gå till din Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Din personliga träningsloggare online
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform"
              >
                Logga in
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-xl border border-black text-black dark:border-white dark:text-white hover:scale-105 transition-transform"
              >
                Registrera
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
