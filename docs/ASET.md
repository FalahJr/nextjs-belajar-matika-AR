# Panduan Aset AR (Target MindAR, Model 3D, Soal)

Aplikasi memisahkan tiga hal yang bisa diganti secara terpisah tanpa mengubah komponen React:

| Hal | Lokasi | Keterangan |
|---|---|---|
| Materi & soal | `src/data/arCards.ts` | judul, topik, 3 soal per materi, penyesuaian posisi model |
| Model 3D (GLB) | `src/config/models.json` | path + `available` per `cardId` |
| Set target `.mind` | `src/config/targets/temporary.json`, `src/config/targets/wildan.json` | file `.mind` + pemetaan `targetIndex → cardId` |
| Mode target aktif | `src/config/arTargets.ts` (`DEFAULT_TARGET_MODE`) atau env `VITE_AR_TARGET_MODE` | `temporary` atau `wildan` |

`src/config/arTargets.ts` menggabungkan ketiganya menjadi `AR_CARDS` yang dipakai seluruh aplikasi.
**`targetIndex` hanya ditulis di file manifest target** dan tidak tersebar di komponen.

> Status saat ini: **3 kartu target SEMENTARA** (buatan project) sudah dikompilasi dan bisa dipakai menguji AR.
> Kartu sementara **bukan desain final** untuk skripsi. Tiga model GLB lain belum tersedia.

---

## 1. Kondisi aset

| # | `cardId` | Materi | Model GLB | Target sementara |
|---:|---|---|---|---|
| 1 | `pizza-pecahan-biasa` | Pecahan Biasa | ✅ `pizza-pecahan-biasa.glb` | ✅ `targetIndex` 0 |
| 2 | `susu-pecahan-campuran` | Pecahan Campuran | ✅ `susu-pecahan-campuran.glb` | ✅ `targetIndex` 1 |
| 3 | `piring-buah-desimal` | Pecahan Menjadi Desimal | ✅ `piring-buah-desimal.glb` | ✅ `targetIndex` 2 |
| 4 | `jajanan-ubah-persen` | Pecahan Menjadi Persen | ❌ belum ada | — |
| 5 | `pizza-urut-campuran` | Mengurutkan Pecahan | ❌ belum ada | — |
| 6 | `kue-operasi-hitung` | Operasi Hitung Pecahan | ❌ belum ada | — |

Materi 4–6 tetap muncul di landing page dan Mode Demo (soal bisa dicoba), tetapi tidak punya target dan modelnya
tidak pernah dimuat (`available: false`). Nama file di `models.json` untuk materi ini hanyalah **nama rencana**.

## 2. Lokasi file

```
public/assets/targets/
├── temporary/
│   ├── 01-pizza-pecahan-biasa.png      ← gambar target sementara (1000×1400 px)
│   ├── 02-susu-pecahan-campuran.png
│   ├── 03-piring-buah-desimal.png
│   └── kartu-sementara-a4.pdf          ← lembar cetak A4 (3 kartu ukuran 9 × 12,6 cm)
├── temporary-targets.mind              ← hasil kompilasi (3 target)
├── temporary-targets.mind.json         ← catatan kompilasi: urutan, sha256 gambar & .mind, versi mind-ar
└── wildan/                             ← tempat aset final dari Wildan
public/assets/models/*.glb              ← model 3D
scripts/targets/                        ← generator, compiler, verifikasi
```

## 3. Perintah

| Perintah | Fungsi |
|---|---|
| `npm run targets:generate` | Menggambar ulang 3 PNG kartu sementara + PDF A4 (deterministik). |
| `npm run compile:targets` | Mengompilasi gambar set `temporary` menjadi `.mind`, menulis catatan kompilasi, lalu memverifikasi. |
| `npm run compile:targets -- --set wildan` | Sama, untuk gambar kartu final dari Wildan. |
| `npm run verify:targets` (`-- --set wildan`) | Hanya memverifikasi (tanpa kompilasi ulang). |

Compiler memakai **compiler resmi MindAR yang terpasang** (`mind-ar/src/image-target/offline-compiler.js`, versi
yang sama dengan runtime aplikasi, saat ini 1.2.5) dan berjalan lokal dengan `canvas`, tanpa layanan eksternal.
Kompilasi 3 gambar butuh ±40 detik. Kompilasi **tidak** dijalankan otomatis oleh `npm run dev`/`build`; jalankan
hanya ketika gambar target berubah, lalu commit `.mind` dan `.mind.json` yang baru.

`verify:targets` memeriksa:

1. `.mind` ada, berformat MindAR v2, dan terbaca oleh MindAR terpasang (jumlah target, dimensi, jumlah titik fitur).
2. Urutan target di catatan kompilasi sama dengan manifest.
3. Gambar sumber dan `.mind` tidak berubah sejak dikompilasi (sha256). Bila berubah, jalankan ulang compile.
4. **Validasi silang:** tiap gambar dirender ke "frame kamera" simulasi (3 variasi skala/rotasi/kecerahan), lalu
   Detector + Matcher + Estimator MindAR harus mengenalinya **hanya** sebagai `targetIndex`-nya sendiri.
   Ini bukti offline bahwa pemetaan benar dan kartu tidak saling tertukar, tetapi **bukan pengganti uji kartu cetak**.
5. Model GLB yang ditandai tersedia benar-benar ada dan valid (glTF 2.0). Model yang ditandai belum tersedia tetapi
   filenya sudah ada akan diberi peringatan.

## 4. Memastikan `targetIndex` sesuai urutan compiler

MindAR memberi indeks menurut **urutan gambar saat dikompilasi**, bukan menurut nama file atau `cardId`.

- Di project ini urutan kompilasi = urutan `targetIndex` di manifest (`src/config/targets/<set>.json`). File manifest
  yang sama dibaca oleh aplikasi dan oleh compiler, jadi keduanya tidak bisa berbeda.
- Compiler menolak manifest dengan indeks ganda atau loncat (harus 0..n-1) dan target tanpa gambar.
- Catatan `<file>.mind.json` merekam urutan saat kompilasi. Halaman `/scan` (panel **Status aset AR**) dan
  `verify:targets` menandai **"Tidak cocok"** bila manifest diubah tanpa kompilasi ulang.
- Saat scan, engine membandingkan jumlah target di file `.mind` dengan konfigurasi. Pemetaan ke indeks yang tidak ada
  akan menghentikan sesi dengan pesan jelas. Target di file yang belum dipetakan ditandai kotak kuning dan banner
  **"Target #k terdeteksi, tetapi belum dipetakan"**.

## 5. Mengganti kartu sementara dengan desain final (PNG/JPG)

Ada dua pilihan:

**a. Tetap di set `temporary`** (paling cepat, untuk iterasi desain):
ganti PNG di `public/assets/targets/temporary/` dengan nama yang sama, atau ubah path `image` di `temporary.json`,
lalu jalankan `npm run compile:targets`. Jangan jalankan `targets:generate` setelahnya karena akan menimpa gambar.

**b. Set `wildan`** (disarankan untuk aset final): lihat Mode B di bawah.

Tips desain kartu agar mudah dilacak: banyak detail kontras tinggi, hindari area warna rata yang luas dan pola
berulang (kotak-kotak, garis seragam). **Hindari elemen identik di posisi yang sama pada semua kartu** (logo/teks
header yang sama persis). MindAR cukup ±6 titik cocok untuk menyatakan target terdeteksi, sehingga elemen bersama
bisa membuat kartu tertukar. Validasi silang di `verify:targets` mendeteksi masalah ini (hal ini terbukti saat membuat
kartu sementara: versi awal dengan header identik gagal validasi).

## 6. Mode B — target final dari Wildan

1. Letakkan file dari Wildan di `public/assets/targets/wildan/`.
2. Isi `src/config/targets/wildan.json` sesuai kasus di bawah.
3. Aktifkan mode: ubah `DEFAULT_TARGET_MODE` di `src/config/arTargets.ts` menjadi `'wildan'`, atau jalankan dengan
   env `VITE_AR_TARGET_MODE=wildan` (mis. `VITE_AR_TARGET_MODE=wildan npm run dev` atau di pengaturan hosting).
4. Bila model baru tersedia, letakkan GLB di `public/assets/models/` dan ubah `available` menjadi `true` di
   `src/config/models.json`.
5. Jalankan `npm run verify:targets -- --set wildan`, lalu uji dengan kartu cetak.

**Kasus 1 — Wildan memberi gambar kartu (PNG/JPG):**

```json
{
  "id": "wildan",
  "label": "Target final dari Wildan",
  "mindUrl": "/assets/targets/wildan/targets.mind",
  "targets": [
    { "targetIndex": 0, "cardId": "pizza-pecahan-biasa", "image": "/assets/targets/wildan/kartu-1.png" },
    { "targetIndex": 1, "cardId": "susu-pecahan-campuran", "image": "/assets/targets/wildan/kartu-2.png" }
  ]
}
```

Lalu jalankan `npm run compile:targets -- --set wildan`. Urutan ditentukan oleh project, jadi aman.

**Kasus 2 — Wildan memberi `.mind` + gambar sumber + dokumentasi urutan:** salin `.mind` sebagai
`wildan/targets.mind`, isi `targets` persis sesuai dokumentasi urutan Wildan (sertakan path gambar). File `.mind`
dari luar tidak punya catatan kompilasi, jadi `verify:targets` akan memberi peringatan tentang hal itu dan
menjalankan validasi silang memakai gambar sumbernya untuk memastikan urutannya benar. Alternatifnya, kompilasi
ulang dari gambar tersebut (Kasus 1).

**Kasus 3 — Wildan hanya memberi `.mind` (tanpa gambar/urutan):** jangan menebak urutan.

1. Biarkan `"targets": []`, aktifkan mode `wildan`, buka `/scan`. Intro menampilkan "Belum ada target yang
   dipetakan…", tetapi Mulai Scan tetap aktif.
2. Scan tiap kartu fisik dan catat banner **"Target #k terdeteksi…"**.
3. Isi `targets` dengan `{ "targetIndex": k, "cardId": "...", "image": null }` sesuai hasil pencatatan.
4. Scan ulang dan pastikan setiap kartu memunculkan materi & model yang benar.

## 7. Menjalankan dan menguji AR di localhost

```bash
npm install
npm run dev            # buka http://localhost:5173/scan
```

- Cetak `public/assets/targets/temporary/kartu-sementara-a4.pdf` di HVS dengan skala **100% / Actual size**,
  atau tampilkan PNG kartu di layar lain/HP sebagai pengganti sementara.
- Di laptop/desktop, webcam dipakai otomatis. Di HP, kamera belakang dipakai bila tersedia (`facingMode: environment`)
  dan tombol ganti kamera muncul bila ada lebih dari satu kamera.
- Kamera baru diminta setelah menekan **Mulai Scan**, lalu dimatikan saat **Berhenti** atau saat pindah halaman.
- Progres kuis disimpan di state React saja (tidak di localStorage/sessionStorage/IndexedDB/backend). Progres
  tetap ada saat kartu hilang sementara atau berpindah kartu.

**Uji dari HP di jaringan lokal:** `npm run dev -- --host` membuka akses lewat IP LAN, tetapi browser HP **menolak
kamera di HTTP** (selain `localhost`). Gunakan HTTPS, misalnya plugin `@vitejs/plugin-basic-ssl` atau tunnel HTTPS
(ngrok, Cloudflare Tunnel), atau uji lewat hosting.

**Hosting:** kamera hanya berjalan di **HTTPS**. Pastikan file `.mind`, `.mind.json`, dan `.glb` ikut ter-deploy
(semuanya ada di `public/`, disalin ke `dist/` oleh `npm run build`). Hosting SPA yang membalas `index.html` untuk file
yang tidak ada akan terdeteksi sebagai "Belum tersedia", bukan dianggap file valid.

## 8. Mode Demo

Mode Demo (tanpa kamera) selalu tersedia, termasuk saat file `.mind`, kamera, atau model belum siap. Keenam materi bisa
dipilih dan soalnya dikerjakan. Mode Demo tidak menampilkan objek 3D maupun tracking.

## 9. Penyesuaian model dan tracking

- Model otomatis dipusatkan di kartu, dasarnya ditempelkan ke permukaan, dan diskalakan ±80% lebar kartu.
  Penyesuaian per materi ada di `src/data/arCards.ts`: `modelScale`, `modelOffset` (`[x, y, z]` dalam satuan lebar
  kartu), dan `modelRotation` (radian, default `[Math.PI / 2, 0, 0]`).
- Parameter tracking (`filterMinCF`, `filterBeta`, `warmupTolerance`, `missTolerance`) dan `TARGET_LOST_GRACE_MS`
  ada di `src/data/arConfig.ts`.
- Jangan menanamkan soal, tombol, `cardId`, `targetIndex`, atau gambar target ke dalam GLB.

## 10. Checklist verifikasi dengan kartu fisik (wajib sebelum rilis)

- [ ] Setiap kartu cetak memunculkan model dan soal yang benar.
- [ ] Posisi, skala, dan arah model di atas kartu sudah pas.
- [ ] Uji berbagai cahaya, jarak, sudut, dan kertas HVS (tanpa laminasi mengkilap).
- [ ] Uji kehilangan target singkat (progres kuis tetap) dan berpindah antar kartu (soal/skor tidak tercampur).
- [ ] Uji di HP nyata (kamera belakang) dan laptop (webcam) lewat HTTPS.
- [ ] Setelah Berhenti atau pindah halaman, indikator kamera di perangkat padam.

## 11. Mengganti soal

Soal saat ini adalah **konten awal**. Ganti di `src/data/arCards.ts` (tepat 3 soal per materi) dan
`src/data/practiceQuestions.ts` (tepat 5 soal), lalu jalankan `npm test`.

## 12. Batasan saat ini

- Kartu target sementara hanya untuk pengembangan dan bukan desain final.
- Model untuk Pecahan Menjadi Persen, Mengurutkan Pecahan, dan Operasi Hitung Pecahan belum ada. Materi ini hanya bisa
  dicoba di Mode Demo.
- Tracking sudah diuji otomatis di Chromium headless dengan kamera palsu (video sintetis berisi gambar kartu), tetapi
  **belum diuji dengan kartu cetak dan kamera fisik**. Penyesuaian skala/posisi model juga belum dicek di perangkat nyata.
- Gambar dibuat ulang dengan font sistem. Di OS lain, pikselnya bisa sedikit berbeda, jadi jalankan `compile:targets`
  setelah `targets:generate` (`verify:targets` akan mendeteksinya).
