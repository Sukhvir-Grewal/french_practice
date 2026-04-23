import type { Metadata } from "next";
import { Sora, Lora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "French Flashcards",
  description: "Interactive French flashcard study app with spaced review and pronunciation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${lora.variable}`}>{children}</body>
    </html>
  );
}
