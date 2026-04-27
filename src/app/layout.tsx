import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valra.gg",
  description: "O hub definitivo para jogadores de Valorant — stats, esports e pro settings em um só lugar.",
  icons: {
    icon: [
      { url: "/images/logo/logo-v.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo/logo-v.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/images/logo/logo-v.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
