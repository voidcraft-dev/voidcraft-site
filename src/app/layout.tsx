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
  title: "VoidCraft — AI Creation Universe",
  description:
    "Building an interconnected AI creation ecosystem — where music, stories, art, and worlds converge. Open-source tools & products.",
  keywords: [
    "AI tools",
    "full-stack developer",
    "Tauri",
    "Rust",
    "Claude Code",
    "MCP",
    "AI music",
    "world simulator",
    "indie developer",
  ],
  openGraph: {
    title: "VoidCraft — AI Creation Universe",
    description:
      "An interconnected AI creation ecosystem — music, stories, art, and worlds converge.",
    type: "website",
    url: "https://voidcraft-site.vercel.app",
    images: [
      {
        url: "https://voidcraft-site.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "VoidCraft — Full-Stack Developer & AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoidCraft — AI Creation Universe",
    description:
      "An interconnected AI creation ecosystem — music, stories, art, and worlds converge.",
    images: ["https://voidcraft-site.vercel.app/api/og"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
