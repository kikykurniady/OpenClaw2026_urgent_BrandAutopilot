import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandAutopilot — Build your brand in 60 seconds",
  description:
    "Four autonomous AI agents — Research, Strategy, Brand, and Content — generate a complete brand strategy in under a minute. Built for OpenClaw Agenthon 2026.",
  openGraph: {
    title: "BrandAutopilot",
    description: "Build your brand in 60 seconds with 4 AI Agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
