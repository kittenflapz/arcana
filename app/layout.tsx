import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Marcellus } from "next/font/google";
import "./globals.css";
import { Navigation } from '@/components/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titleSerif = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

const bodySerif = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Arcana - A Year of Reflective Tarot",
  description: "A 365-day practice of daily tarot reflection, guided by an AI Oracle that evolves with you over the course of a year.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titleSerif.variable} ${bodySerif.variable} antialiased`}
      >
        <Navigation />
        <main className="pt-16"> {/* Account for fixed nav */}
          {children}
        </main>
      </body>
    </html>
  );
}
