import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Okay — Бодоод, урамшууллаа аваарай",
  description: "3–5-р ангийн хүүхдэд зориулсан бодлого, урамшуулал, эцэг эхийн хяналт.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
