"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loadingRSVP, setLoadingRSVP] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
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
  const audioRef = useRef(null);
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
  const eventDate = new Date("2025-12-07T09:00:00+07:00");

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
        if (res.ok && data.success) {
          setRsvpList(Array.isArray(data.data) ? data.data : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;

    const payload = {
      nama: f.nama.value,
      hadir: f.hadir.value,
      jumlah: f.jumlah.value || "1",
      pesan: f.pesan.value || "-",
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

      alert(
        `Terima kasih, ${payload.nama}!\n\n` +
          `Status: ${payload.hadir}\n` +
          `Jumlah tamu: ${payload.jumlah}\n` +
          `Pesan: ${payload.pesan}\n\n` +
          "RSVP kamu sudah tersimpan di file rsvp.json ✅"
      );

      f.reset();

      // Tambah ke list lokal tanpa reload
      setRsvpList((prev) => [
        ...prev,
        { ...payload, created_at: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim RSVP.");
    } finally {
      setLoadingRSVP(false);
    }
  };

  // URL Google Maps lokasi (punya kamu)
  const mapsUrl = "https://maps.app.goo.gl/ZiGdtLa5AkV5SNSY9";

  return (
    <main className="page">
      {/* Glow background blobs */}
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="bg-orb orb3" />

      {/* INTRO OVERLAY */}
      {showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at top, rgba(0,0,0,0.72), rgba(0,0,0,0.9))",
            color: "#fff",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              borderRadius: 24,
              padding: "1.8rem 1.5rem 1.6rem",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "0.7rem",
                opacity: 0.9,
              }}
            >
              Undangan Pernikahan
            </p>

            <h2
              style={{
                fontSize: "1.7rem",
                marginBottom: "0.2rem",
                fontWeight: 600,
              }}
            >
              Eka &amp; Triyan
            </h2>
            <p style={{ fontSize: "0.85rem", marginBottom: "1.2rem" }}>
              Kepada Yth:
              <br />
              <span style={{ fontWeight: 600 }}>{guestName}</span>
            </p>

            <p
              style={{
                fontSize: "0.8rem",
                marginBottom: "1.4rem",
                opacity: 0.9,
              }}
            >
              Mohon maaf apabila ada kesalahan dalam penulisan nama dan gelar.
              Klik tombol di bawah ini untuk membuka undangan.
            </p>

            <button
              onClick={handleOpenInvitation}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Buka Undangan ✨
            </button>

            <p
              style={{
                fontSize: "0.7rem",
                marginTop: "0.75rem",
                opacity: 0.8,
              }}
            >
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
            <span className="tagline">Undangan Khusus Untuk Anda</span>

            <h1 className="title">
              Dengan Hormat,
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
              Kami mengundang Anda untuk hadir dan menjadi bagian dari momen
              istimewa yang penuh cerita, tawa, dan doa baik.
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
            Dengan segala kerendahan hati, kami mempersembahkan kisah dua insan.
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
              Pria sederhana yang selalu percaya bahwa cinta adalah perjalanan
              jauh, bukan tujuan akhir. Kini ia berani melangkah bersama
              pendamping hidupnya.
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
              Sosok lembut dan penuh senyum, yang percaya bahwa setiap pertemuan
              adalah takdir yang sudah tertulis indah dari Sang Maha Kuasa.
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
          <p>Catat waktunya agar tidak berhalangan hadir.</p>
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
            Mohon bantu kami menyiapkan yang terbaik dengan mengisi form ini.
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
              <label htmlFor="nama">Nama Lengkap</label>
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
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="jumlah">Jumlah Tamu (termasuk Anda)</label>
              <input
                id="jumlah"
                name="jumlah"
                type="number"
                min="1"
                max="10"
                placeholder="Contoh: 2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pesan">Pesan / Ucapan</label>
              <textarea
                id="pesan"
                name="pesan"
                placeholder="Tulis ucapan atau pesan singkat..."
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

          {/* LIST RSVP DI SEBELAH KANAN - FORMAT KOMENTAR */}
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
              <p className="no-comment">Belum ada RSVP masuk.</p>
            ) : (
              <div className="comment-scroll">
                {rsvpList.map((item, index) => (
                  <div key={index} className="rsvp-comment">
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
        Terima kasih telah menjadi bagian dari hari bahagia kami 💛
        <br />
        <b>Eka &amp; Triyan</b>
      </footer>
    </main>
  );
}
