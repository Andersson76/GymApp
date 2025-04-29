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
      <body>{children}</body>
    </html>
  );
}
