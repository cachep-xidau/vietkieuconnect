import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";

// Validate environment variables at startup
validateEnv();

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "VietKieuConnect",
  description: "Quality dental care in Vietnam for Việt Kiều",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "VietKieuConnect — Quality Dental Care in Vietnam",
    description: "Connect with verified clinics, get transparent quotes, and save 60-80% on dental care. Trusted by thousands of Việt Kiều.",
    siteName: "VietKieuConnect",
    type: "website",
    locale: "en_US",
    alternateLocale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "VietKieuConnect",
    description: "Save 60-80% on dental care in Vietnam with verified clinics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
