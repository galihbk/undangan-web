"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, Suspense } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type RSVPItem = {
  _id?: string;
  nama: string;
  hadir: string;
  jumlah: string;
  pesan: string;
  created_at?: string;
};

const eventDate = new Date("2025-12-07T09:00:00+07:00");

function HomeInner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loadingRSVP, setLoadingRSVP] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Ambil nama tamu dari URL: ?to=Nama%20Tamu
  const searchParams = useSearchParams();
  const rawName = searchParams.get("to");
  const guestName =
    rawName && rawName.trim() !== ""
      ? decodeURIComponent(rawName)
      : "Nama Tamu Spesial";

  // ====== MUSIC ======
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Inisialisasi audio
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const playMusic = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Gagal play music:", err);
    }
  };

  const stopMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleOpenInvitation = async () => {
    await playMusic();
    setShowIntro(false);
  };

  // ========== COUNTDOWN ==========
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date().getTime();
      const diff = eventDate.getTime() - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: days >= 0 ? days : 0,
        hours: hours >= 0 ? hours : 0,
        minutes: minutes >= 0 ? minutes : 0,
        seconds: seconds >= 0 ? seconds : 0,
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  // ========== AMBIL LIST RSVP ==========
  useEffect(() => {
    const fetchRSVP = async () => {
      try {
        const res = await fetch("/api/rsvp");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setRsvpList(data.data as RSVPItem[]);
        } else {
          setRsvpList([]);
        }
      } catch (err) {
        console.error("Gagal ambil list RSVP:", err);
        setRsvpList([]);
      } finally {
        setLoadingList(false);
      }
    };

    fetchRSVP();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const formData = new FormData(f);

    const payload: RSVPItem = {
      nama: String(formData.get("nama") || ""),
      hadir: String(formData.get("hadir") || ""),
      jumlah: String(formData.get("jumlah") || "1"),
      pesan: String(formData.get("pesan") || "-"),
    };

    try {
      setLoadingRSVP(true);
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert("Maaf, RSVP gagal disimpan. Coba lagi nanti ya.");
        return;
      }

      const saved: RSVPItem = data.data;

      alert(
        `Terima kasih, ${saved.nama}!\n\n` +
          `Status: ${saved.hadir}\n` +
          `Jumlah tamu: ${saved.jumlah}\n` +
          `Pesan: ${saved.pesan}\n\n` +
          "RSVP kamu sudah tersimpan ✅"
      );

      f.reset();

      setRsvpList((prev) => [...prev, saved]);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim RSVP.");
    } finally {
      setLoadingRSVP(false);
    }
  };

  const mapsUrl = "https://maps.app.goo.gl/ZiGdtLa5AkV5SNSY9";

  return (
    <main className="page">
      {/* Glow background blobs */}
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="bg-orb orb3" />

      {/* Falling petals */}
      <div className="petal-container">
        <span className="petal petal-1" />
        <span className="petal petal-2" />
        <span className="petal petal-3" />
        <span className="petal petal-4" />
        <span className="petal petal-5" />
        <span className="petal petal-6" />
        <span className="petal petal-7" />
        <span className="petal petal-8" />
        <span className="petal petal-9" />
        <span className="petal petal-10" />
        <span className="petal petal-11" />
        <span className="petal petal-12" />
      </div>

      {/* INTRO OVERLAY */}
      {showIntro && (
        <div className="intro-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="intro-card"
          >
            <p className="intro-label">Undangan Pernikahan</p>

            <h2 className="intro-names">Eka &amp; Triyan</h2>

            <p className="intro-to">
              Kepada Yth. Bapak/Ibu/Saudara/i
              <br />
              <span>{guestName}</span>
            </p>

            <p className="intro-text">
              Tanpa mengurangi rasa hormat, dengan ini kami mengundang Anda
              untuk hadir dan memberi doa restu pada hari bahagia kami.
            </p>

            <button
              onClick={handleOpenInvitation}
              className="btn btn-primary intro-btn"
            >
              Buka Undangan ✨
            </button>

            <p className="intro-note">
              *Pastikan suara perangkat Anda tidak dalam keadaan mute
            </p>
          </motion.div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-inner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {/* TEKS KIRI */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="tagline">Bismillahirrahmanirrahim</span>

            <h1 className="title">
              Kepada Yth.
              <motion.span
                className="highlight"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {guestName} 🌿
              </motion.span>
            </h1>

            <p className="lead">
              Dengan penuh rasa syukur, kami mengundang Anda untuk hadir dan
              menyaksikan hari di mana dua doa baik dipertemukan dalam satu
              ikatan bernama pernikahan.
            </p>

            <div className="hero-buttons">
              <a href="#detail" className="btn btn-primary">
                Lihat Detail Acara
              </a>
              <a href="#rsvp" className="btn btn-outline">
                Konfirmasi Kehadiran
              </a>
            </div>
          </motion.div>

          {/* KARTU KANAN */}
          <motion.div
            className="hero-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="date-badge">Minggu, 07 Desember 2025</div>
            <h2>Eka &amp; Triyan</h2>
            <p className="sub">Pernikahan Bahagia</p>
            <div className="line"></div>
            <p className="place">
              Di Rumah Mempelai Wanita
              <br />
              Sidareja
            </p>

            <div className="countdown">
              {["Hari", "Jam", "Menit", "Detik"].map((label, i) => {
                const values = [
                  timeLeft.days,
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds,
                ];
                return (
                  <motion.div
                    key={label}
                    className="count-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                  >
                    <span className="count-number">{values[i]}</span>
                    <span className="count-label">{label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* DETAIL MEMPELAI */}
      <section id="mempelai">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="fancy-title">Profil Mempelai 💍</h2>
          <p>
            Dengan segala kerendahan hati, kami mempersembahkan kisah dua insan
            yang dipertemukan dalam satu niat baik.
          </p>
        </motion.div>

        <div className="mempelai-wrap">
          {/* MEMPELAI PRIA */}
          <motion.div
            className="card-mempelai"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="nama-mempelai">Mohamad Triyanto</h3>
            <p className="ortu">
              Putra dari Bapak <b>Amirudin</b> & Ibu <b>Manisah</b>
            </p>
            <p className="desc">
              Pria yang tumbuh dengan kesederhanaan dan kerja keras, yang
              percaya bahwa setiap langkah kecil akan terasa lengkap ketika
              dijalani bersama pasangan yang tepat.
            </p>
          </motion.div>

          {/* MEMPELAI WANITA */}
          <motion.div
            className="card-mempelai"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="nama-mempelai">Eka Yanuar Ramadhani</h3>
            <p className="ortu">
              Putri dari Bapak <b>Dody Cahyono</b> & Ibu <b>Ratinah</b>
            </p>
            <p className="desc">
              Sosok lembut yang selalu menyimpan senyum di setiap cerita, yakin
              bahwa pertemuan ini bukan kebetulan, melainkan jawaban dari
              doa-doa yang diam-diam dipanjatkan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DETAIL ACARA */}
      <section id="detail">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="fancy-title">Detail Acara ✦</h2>
          <p>
            Berikut adalah waktu dan tempat di mana cerita kami akan resmi
            dimulai. Kami sangat berharap Anda dapat hadir.
          </p>
        </motion.div>

        <div className="details-grid details-grid-2">
          {/* TANGGAL & WAKTU */}
          <motion.div
            className="detail-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="detail-icon">📅</div>
            <h3>Tanggal & Waktu</h3>
            <p>Minggu, 07 Desember 2025</p>
            <p>Pukul 09.00 – 13.00 WIB</p>
          </motion.div>

          {/* LOKASI + TOMBOL MAPS */}
          <motion.div
            className="detail-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div className="detail-icon">📍</div>
            <h3>Lokasi Acara</h3>
            <p>Rumah Mempelai Wanita</p>
            <p>Desa Penyarang Rt 4 Rw 5</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-small"
              style={{ marginTop: "0.8rem" }}
            >
              Buka di Google Maps
            </a>
          </motion.div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="fancy-title">Konfirmasi Kehadiran</h2>
          <p>
            Kehadiran dan doa Anda merupakan hadiah paling berharga bagi kami.
            Mohon isi form berikut sebagai bentuk konfirmasi kehadiran.
          </p>
        </motion.div>

        <div className="rsvp-wrapper-two">
          {/* FORM LEFT */}
          <motion.form
            className="rsvp-card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap Tamu Undangan</label>
              <input
                id="nama"
                name="nama"
                placeholder="Tuliskan nama Anda"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hadir">Status Kehadiran</label>
              <select id="hadir" name="hadir" required>
                <option value="">Pilih salah satu</option>
                <option value="Hadir">InsyaAllah Hadir</option>
                <option value="Tidak Hadir">Belum Bisa Hadir</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="jumlah">Jumlah Tamu (termasuk Anda)</label>
              <input
                id="jumlah"
                name="jumlah"
                type="number"
                min={1}
                max={10}
                placeholder="Contoh: 2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pesan">Pesan / Ucapan</label>
              <textarea
                id="pesan"
                name="pesan"
                placeholder="Tulis ucapan atau pesan singkat untuk mempelai..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loadingRSVP}
            >
              {loadingRSVP ? "Mengirim..." : "Kirim RSVP ✨"}
            </button>
          </motion.form>

          {/* LIST RSVP */}
          <motion.div
            className="rsvp-comment-list"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="rsvp-title">Daftar Pesan Tamu 💬</h3>

            {loadingList ? (
              <p className="no-comment">Memuat data tamu...</p>
            ) : rsvpList.length === 0 ? (
              <p className="no-comment">
                Belum ada RSVP masuk. Jadilah yang pertama mengirimkan doa
                terbaik Anda. 🤍
              </p>
            ) : (
              <div className="comment-scroll">
                {rsvpList.map((item, index) => (
                  <div
                    key={item._id ?? index.toString()}
                    className="rsvp-comment"
                  >
                    <div className="comment-head">
                      <span className="comment-name">{item.nama}</span>
                      <span
                        className={`comment-status ${
                          item.hadir === "Hadir" ? "yes" : "no"
                        }`}
                      >
                        {item.hadir}
                      </span>
                    </div>
                    <p className="comment-text">{item.pesan}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <footer>
        Terima kasih telah bersedia menjadi bagian dari hari yang kami impikan
        selama ini 💛
        <br />
        <b>Eka &amp; Triyan</b>
      </footer>

      {/* Tombol Musik */}
      <div
        className="music-btn"
        onClick={isPlaying ? stopMusic : playMusic}
        title={isPlaying ? "Matikan musik" : "Putar musik"}
      >
        {isPlaying ? "🔊" : "🔈"}
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            Memuat undangan...
          </div>
        </main>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
