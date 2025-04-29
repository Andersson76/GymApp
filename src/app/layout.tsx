import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
//import Header from "@/components/Header";

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
      <body>
        {/* <Header /> */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
