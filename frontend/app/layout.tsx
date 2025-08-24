import type { Metadata } from "next";
import Link from 'next/link';
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
  title: "Affiliate Postback System",
  description: "Manage affiliate clicks and conversions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-6`}
      >
        <h1>Affiliate Postback MVP</h1>
        <nav style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/postback">Postback URL</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
