export function About() {
  return (
    <section id="tentang" aria-labelledby="judul-tentang" className="scroll-mt-20 bg-indigo-600 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
        <div>
          <h2 id="judul-tentang" className="text-3xl font-black">Tentang BelajarMatika AR</h2>
          <p className="mt-3 font-medium leading-relaxed text-indigo-100">
            BelajarMatika AR adalah website belajar matematika untuk siswa Sekolah Dasar. Website ini
            menghubungkan kartu cetak dengan objek 3D melalui Augmented Reality (AR), lalu mengajak
            siswa menjawab soal pilihan ganda tentang materi pada kartu tersebut.
          </p>
          <p className="mt-3 font-medium leading-relaxed text-indigo-100">
            Visualisasi 3D dimaksudkan sebagai alat bantu agar siswa lebih mudah membayangkan konsep.
            Website ini tidak mengklaim hasil belajar tertentu.
          </p>
        </div>
        <div className="rounded-3xl bg-white/10 p-6">
          <h3 className="text-lg font-extrabold text-amber-300">Hal yang perlu diketahui</h3>
          <ul className="mt-3 grid list-disc gap-2 pl-5 font-medium text-indigo-50">
            <li>Kamera hanya dinyalakan setelah kamu menekan <strong>Mulai Scan</strong>.</li>
            <li>Tidak ada login dan tidak ada data nilai yang disimpan; memuat ulang halaman mengulang dari awal.</li>
            <li>Kuis kartu berisi 3 soal; latihan biasa berisi 5 soal tanpa kamera.</li>
            <li>Didampingi guru atau orang tua akan lebih menyenangkan.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
