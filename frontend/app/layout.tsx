import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import PasswordProtection from "./components/PasswordProtection";
import Feedback from "./components/Feedback";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HUVTSP 2025 Alumni Network (Unofficial, NOT affiliated, student-led)",
  description:
    "Unofficial, NOT affiliated, student-led. Connect with HUVTSP alumni, find collaborators, and discover opportunities through intelligent semantic search.",
  // openGraph: {
  //   images: [
  //     {
  //       url: "https://www.huvtsp2025alumni.com/ogi.png",
  //       alt: "HUVTSP 2025 Alumni Network",
  //     },
  //   ],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PasswordProtection>
          <Navigation />
          {children}
          <Feedback variant="floating" />
          <Analytics />
        </PasswordProtection>
      </body>
    </html>
  );
}
