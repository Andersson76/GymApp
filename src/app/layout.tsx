import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymApp – Din träningsdagbok online",
  description:
    "Följ din träning, håll koll på passen och se din utveckling vecka för vecka.",
  keywords: "träning, träningsdagbok, loggbok, gym, GymApp",
  openGraph: {
    title: "GymApp",
    description: "Logga din träning på ett smidigt och säkert sätt.",
    url: "https://gymapp.website",
    siteName: "GymApp",
    images: [
      {
        url: "/og-image.png", // Skapa denna i public/
        width: 1200,
        height: 630,
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="m-0 p-0 overflow-x-hidden bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
