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
  title: "KGR-I | Krishnagar-I Development Block",
  description: "Official website of Krishnagar-I Development Block, Nadia District, West Bengal. Serving the community with transparency, efficiency, and digital governance.",
  keywords: "Krishnagar-I, Development Block, Nadia District, West Bengal, Government Services, Digital India, BDO, Block Development Office",
  authors: [{ name: "Krishnagar-I Development Block" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "KGR-I | Krishnagar-I Development Block",
    description: "Official website of Krishnagar-I Development Block, Nadia District, West Bengal.",
    type: "website",
    locale: "en_IN",
    siteName: "KGR-I",
  },
  twitter: {
    card: "summary_large_image",
    title: "KGR-I | Krishnagar-I Development Block",
    description: "Official website of Krishnagar-I Development Block, Nadia District, West Bengal.",
  },
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
        {children}
      </body>
    </html>
  );
}
