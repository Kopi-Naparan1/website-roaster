import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Heading from "@/components/layout/Heading";
import Footer from "@/components/layout/Footer";
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
  metadataBase: new URL("https://website-roaster-weld.vercel.app/"),
  title: {
    default: "Vex — Brutally Honest AI Website Roasts",
    template: "%s | Vex",
  },
  description:
    "Paste your URL. Get roasted. AI scores your site on Clarity, Copy, CTA, Trust, and Mobile — no sugarcoating.",
  openGraph: {
    type: "website",
    siteName: "Vex",
    title: "Vex — Brutally Honest AI Website Roasts",
    description:
      "Paste your URL. Get roasted. AI scores your site on Clarity, Copy, CTA, Trust, and Mobile — no sugarcoating.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vex — Brutally Honest AI Website Roasts",
    description:
      "Paste your URL. Get roasted. AI scores your site on Clarity, Copy, CTA, Trust, and Mobile — no sugarcoating.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}   h-full antialiased custom-scroll`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Flp1Jy15LvS3B/05BAFARw"
          strategy="afterInteractive"
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
    try {
      const t = localStorage.getItem('theme');
      const dark = t
        ? t === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

      document.documentElement.classList.toggle('dark', dark);
    } catch {}
  `,
          }}
        />
        <Heading></Heading>
        <main> {children}</main>

        <Footer></Footer>
      </body>
    </html>
  );
}
