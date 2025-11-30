import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undangan Pernikahan Eka & Triyan",
  description:
    "Undangan pernikahan Eka Yanuar Ramadhani & Mohamad Triyanto. Minggu, 07 Desember 2025 di Rumah Mempelai Wanita, Desa Penyarang RT 04 RW 05, Sidareja.",
  openGraph: {
    title: "Undangan Pernikahan Eka & Triyan",
    description:
      "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami. Klik untuk melihat detail acara dan konfirmasi kehadiran.",
    url: "https://eka-triyan.vercel.app", // GANTI ke domain kamu kalau sudah custom
    siteName: "Undangan Pernikahan Eka & Triyan",
    images: [
      {
        url: "/og-undangan.png", // pastikan file ini ada di folder /public
        width: 1200,
        height: 630,
        alt: "Undangan Pernikahan Eka & Triyan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Undangan Pernikahan Eka & Triyan",
    description:
      "Undangan pernikahan Eka Yanuar Ramadhani & Mohamad Triyanto. Klik untuk melihat detail acara.",
    images: ["/og-undangan.png"],
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <head>
        {/* FONT IMPORT */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
