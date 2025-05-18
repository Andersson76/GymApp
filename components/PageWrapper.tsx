"use client";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {children}
    </main>
  );
}
