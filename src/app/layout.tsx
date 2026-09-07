import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SWP | Smart Wallet Platform",
  description:
    "Plataforma financiera todo-en-uno para Latinoamérica. Pagos, ecommerce y herramientas financieras en una sola plataforma.",
  keywords: [
    "fintech",
    "pagos digitales",
    "ecommerce",
    "billetera digital",
    "emprendedores",
    "Latinoamérica",
    "SWP",
    "Smart Wallet Platform",
  ],
  authors: [{ name: "SWP" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased">
        {children}
        {cookiebotId ? (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
