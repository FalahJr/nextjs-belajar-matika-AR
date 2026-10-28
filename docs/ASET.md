# Panduan Integrasi Aset AR Final

Aplikasi sudah berjalan tanpa aset AR (landing, latihan, dan Mode Demo). Dokumen ini menjelaskan cara
menghubungkan aset final agar scan kamera nyata aktif. **Integrasi AR nyata belum diuji dengan kartu fisik
dan model final** — lakukan langkah verifikasi di bagian 5.

## 1. Model 3D (`.glb`)

Letakkan enam file di `public/assets/models/` dengan nama persis:

| Kartu | File |
|---|---|
| Pizza Pecahan Biasa | `pizza-pecahan-biasa.glb` |
| Susu Pecahan Campuran | `susu-pecahan-campuran.glb` |
| Piring Buah Ubah Desimal | `piring-buah-desimal.glb` |
| Jajanan Ubah Persen | `jajanan-ubah-persen.glb` |
| Pizza Mengurutkan Campuran | `pizza-urut-campuran.glb` |
| Kue Operasi Hitung | `kue-operasi-hitung.glb` |

Jangan menanamkan soal, tombol, `cardId`, atau `targetIndex` ke dalam GLB.

Model otomatis dipusatkan di kartu, dasarnya ditempelkan ke permukaan kartu, dan diskalakan agar muat
(±80% lebar kartu). Bila posisi/ukuran/arah perlu disesuaikan, atur per kartu di `src/data/arCards.ts`:

- `modelScale` — pengali ukuran (default 1)
- `modelOffset` — `[x, y, z]` dalam satuan lebar kartu (z positif = menjauh dari kartu)
- `modelRotation` — `[x, y, z]` radian (default `[Math.PI / 2, 0, 0]`, agar sumbu atas glTF menghadap keluar dari kartu)

Animasi yang ada di GLB otomatis diputar.

## 2. Gambar kartu

Letakkan enam gambar desain kartu final (yang sama dengan yang dicetak) di `public/assets/cards/`.
Gambar harus kaya detail visual (hindari warna rata/pola berulang) agar mudah dilacak.

## 3. Mengompilasi file `.mind`

File `.mind` dibuat dari enam gambar kartu dengan **compiler MindAR di browser** (resmi, dari README MindAR):

1. Buka <https://hiukim.github.io/mind-ar-js-doc/tools/compile>.
2. Unggah keenam gambar **sesuai urutan yang diinginkan** (gambar pertama = target 0, kedua = target 1, dst.).
3. Klik *Start*, lalu unduh `targets.mind`.
4. Ganti nama menjadi `cards.mind` dan simpan di `public/assets/targets/cards.mind`.

Urutan rencana awal (sesuai `src/data/arCards.ts`):

| `targetIndex` | `cardId` |
|---:|---|
| 0 | `pizza-pecahan-biasa` |
| 1 | `susu-pecahan-campuran` |
| 2 | `piring-buah-desimal` |
| 3 | `jajanan-ubah-persen` |
| 4 | `pizza-urut-campuran` |
| 5 | `kue-operasi-hitung` |

`targetIndex` ditentukan oleh urutan unggah saat kompilasi — **bukan** oleh nama file atau `cardId`.

## 4. Mengaktifkan AR nyata

Tidak ada komponen UI yang perlu diedit. Cukup:

1. Pastikan path di `src/data/arConfig.ts` benar (`MIND_TARGET_URL`) dan `ENABLE_REAL_AR = true`.
2. Jalankan `npm run dev`, buka `/scan`. Panel **Status aset AR** menunjukkan file mana yang sudah terdeteksi.
   Tombol **Mulai Scan** aktif setelah `cards.mind` ada.
3. Bila model belum ada untuk sebuah kartu, tracking tetap berjalan dan sebuah kotak kawat kuning
   ditampilkan sebagai penanda beserta pesan "Model 3D kartu ini belum tersedia".

Parameter tracking (`filterMinCF`, `filterBeta`, `warmupTolerance`, `missTolerance`) dan jeda status
"kartu hilang sementara" (`TARGET_LOST_GRACE_MS`) ada di `arConfig.ts`.

## 5. Verifikasi dengan kartu fisik (wajib sebelum rilis)

- [ ] Setiap kartu cetak memunculkan model yang benar dan soal kartu yang benar (cocokkan `targetIndex`).
- [ ] Posisi, skala, dan arah model di atas kartu sudah pas (atur `modelScale/Offset/Rotation`).
- [ ] Uji berbagai cahaya, jarak, dan sudut; uji kehilangan target singkat (progres kuis harus tetap).
- [ ] Uji berpindah antar kartu (soal dan skor tidak tercampur).
- [ ] Uji di HP nyata (kamera belakang) dan laptop (webcam) lewat HTTPS.
- [ ] Setelah menekan Berhenti / pindah halaman, indikator kamera di perangkat padam.
- [ ] Ukuran GLB wajar dan performa di HP menengah lancar.

## 6. Mengganti soal

Soal saat ini adalah **konten awal** (placeholder pengembangan). Ganti di:

- `src/data/arCards.ts` — tepat 3 soal per kartu
- `src/data/practiceQuestions.ts` — tepat 5 soal

Jalankan `npm test`: tes memvalidasi jumlah soal, opsi A–D, kunci jawaban, dan ID unik.
