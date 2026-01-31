import type { Metadata } from "next";
import { Inter, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Assistly AI - The Digital Foreman",
  description: "AI-powered call handling and scheduling for contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased bg-deep-slate text-white`}>{children}</body>
    </html>
  );
}
