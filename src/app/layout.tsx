import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymApp",
  description: "GymApp for your everyGym use.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-x-hidden">{children}</body>
    </html>
  );
}
