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
  title: "VoidCraft — Full-Stack Developer & AI Tools",
  description:
    "Full-stack developer specializing in AI tools, automation, and modern web applications. Building things from the void.",
  keywords: [
    "full-stack developer",
    "AI tools",
    "automation",
    "MCP",
    "Claude Code",
    "freelance developer",
  ],
  openGraph: {
    title: "VoidCraft — Full-Stack Developer & AI Tools",
    description:
      "Full-stack developer specializing in AI tools, automation, and modern web applications.",
    type: "website",
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
