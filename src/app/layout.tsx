import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Manrope,
  Noto_Sans_Devanagari,
} from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { copy } from "@/lib/copy";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${manrope.variable} ${ibmPlexMono.variable} ${notoDevanagari.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
