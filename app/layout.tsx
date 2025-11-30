import "./globals.css";

export const metadata = {
  title: "Undangan Pernikahan Eka & Triyan",
  description:
    "Undangan pernikahan Eka Yanuar Ramadhani & Mohamad Triyanto. Minggu, 07 Desember 2025 di Rumah Mempelai Wanita, Desa Penyarang RT 04 RW 05, Sidareja.",
  openGraph: {
    title: "Undangan Pernikahan Eka & Triyan",
    description:
      "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami. Klik untuk melihat detail acara dan konfirmasi kehadiran.",
    // url: "https://nama-domain-undanganmu.com", // ganti dengan domain kamu
    siteName: "Undangan Pernikahan Eka & Triyan",
    images: [
      {
        url: "/og-undangan.png", // gambar preview (lihat poin 2)
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

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
