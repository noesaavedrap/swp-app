import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import MaintenanceBanner from "@/components/MaintenanceBanner";
import Providers from "./providers";

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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-595S5ZF5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <MaintenanceBanner />
        <Providers>{children}</Providers>
        {cookiebotId ? (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        ) : null}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-595S5ZF5');`}
        </Script>
      </body>
    </html>
  );
}
