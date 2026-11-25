import type { PracticeLevel, PracticeQuestion } from '../types/quiz'

/**
 * Latihan Soal di web (tanpa AR). Sumber: docs/Latihan soal di WEB.docx.
 * Level 1 (LOTS) soal isian, Level 2 (MOTS) dan Level 3 (HOTS) pilihan ganda A–D.
 */

export const PRACTICE_LEVEL_INFO: Record<PracticeLevel, { number: number; label: string }> = {
  LOTS: { number: 1, label: 'Soal Cerita Mudah' },
  MOTS: { number: 2, label: 'Soal Pilihan Ganda Sedang' },
  HOTS: { number: 3, label: 'Soal Menantang' },
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ───────────── Level 1: LOTS (isian) ─────────────
  {
    id: 'latihan-1-1',
    kind: 'short',
    level: 'LOTS',
    question:
      'Rafa dan teman-temannya memesan sebuah pizza yang dipotong menjadi 8 bagian sama besar. Rafa makan 1 potong pizza. Tulislah bagian pizza yang dimakan Rafa dalam bentuk pecahan biasa!',
    hint: 'Contoh penulisan pecahan: 3/4',
    answer: '1/8',
    accept: { numbers: [{ value: '1/8', form: 'fraction' }] },
    explanation:
      'Pizza dibagi 8 bagian sama besar, jadi penyebutnya 8. Rafa makan 1 bagian, jadi pembilangnya 1. Jadi, bagian pizza yang dimakan Rafa adalah 1/8.',
  },
  {
    id: 'latihan-1-2',
    kind: 'short',
    level: 'LOTS',
    question:
      'Ibu Guru punya 2 batang cokelat yang sama besar. Cokelat pertama dibagi menjadi 6 bagian sama besar. Cokelat kedua dibagi menjadi 3 bagian sama besar. Putu mendapat 2 potong cokelat pertama. Karel mendapat 1 potong cokelat kedua. Putu berkata, “Bagianku lebih banyak karena aku mendapat 2 potong.” Benarkah pendapat Putu? Jelaskan dengan pecahan biasa!',
    hint: 'Tulis jawabanmu dalam satu kalimat singkat, misalnya: “Pendapat Putu …”',
    answer: 'Pendapat Putu salah. Bagian Putu dan Karel sama banyak.',
    accept: {
      keywords: [['salah'], ['tidak', 'benar'], ['sama', 'banyak']],
      reject: ['tidak sama', 'tidak salah', 'bukan salah'],
    },
    explanation:
      'Bagian Putu adalah 2/6. Bagian Karel adalah 1/3. Bagi pembilang dan penyebut 2/6 dengan 2, hasilnya 1/3. Jadi, 2/6 = 1/3. Bagian cokelat Putu dan Karel sama banyak.',
  },
  {
    id: 'latihan-1-3',
    kind: 'short',
    level: 'LOTS',
    question:
      'Ibu membuat satu loyang kue. Sebanyak 2/8 bagian diberikan kepada tetangga. Sebanyak 3/8 bagian diberikan kepada saudara. Berapa bagian kue yang sudah diberikan Ibu?',
    answer: '5/8 bagian',
    accept: { numbers: [{ value: '5/8' }] },
    explanation:
      'Penyebutnya sama (8), jadi jumlahkan pembilangnya saja. 2/8 + 3/8 = 5/8. Penyebut tetap 8.',
  },
  {
    id: 'latihan-1-4',
    kind: 'short',
    level: 'LOTS',
    question:
      'Raka membeli donat untuk dibagikan di kelas. Donat yang dibawa ada 5 donat utuh dan tiga per empat bagian donat. Tulislah banyak donat yang dibawa Raka dalam bentuk pecahan campuran!',
    hint: 'Contoh penulisan pecahan campuran: 2 1/3',
    answer: '5 3/4',
    accept: { numbers: [{ value: '5 3/4', form: 'mixed' }] },
    explanation:
      'Donat utuh ada 5, ini adalah bilangan bulatnya. Sisanya tiga per empat, ditulis 3/4. Gabungkan: 5 3/4.',
  },
  {
    id: 'latihan-1-5',
    kind: 'short',
    level: 'LOTS',
    question:
      'Yohana adalah atlet lompat jauh. Hasil 3 kali lompatannya adalah 2 3/4 m, 3 1/2 m, dan 2 7/8 m. Dina berkata, “Lompatan terjauh Yohana adalah lompatan ketiga karena 7/8 lebih besar daripada 3/4 dan 1/2.” Lompatan mana yang paling jauh?',
    hint: 'Boleh ditulis panjang lompatannya atau lompatan ke berapa.',
    answer: '3 1/2 m (lompatan kedua)',
    accept: {
      numbers: [{ value: '3 1/2' }],
      keywords: [['kedua'], ['ke 2']],
    },
    explanation:
      'Lihat bilangan bulatnya dulu: 2, 3, dan 2. Bilangan bulat 3 paling besar, jadi 3 1/2 m paling jauh. Pendapat Dina kurang tepat karena ia hanya melihat pecahannya, tidak melihat bilangan bulatnya.',
  },
  {
    id: 'latihan-1-6',
    kind: 'short',
    level: 'LOTS',
    question: 'Ibu punya 2 1/2 kg tepung. Ibu membeli lagi 1 1/4 kg tepung. Berapa kg jumlah tepung Ibu sekarang?',
    answer: '3 3/4 kg',
    accept: { numbers: [{ value: '3 3/4' }] },
    explanation:
      'Tulis soalnya: 2 1/2 + 1 1/4. Samakan penyebut menjadi 4: 2 1/2 = 2 2/4. Jumlahkan: 2 2/4 + 1 1/4 = 3 3/4.',
  },
  {
    id: 'latihan-1-7',
    kind: 'short',
    level: 'LOTS',
    question:
      'Ibu membeli sebatang cokelat yang terbagi menjadi 10 bagian sama besar. Adik makan 3 bagian. Di dalam toples ada 100 biskuit, dan 25 biskuit di antaranya diberi selai cokelat. Tulislah dalam bentuk desimal:\na. Bagian cokelat yang dimakan Adik (3/10)\nb. Bagian biskuit yang diberi selai cokelat (25/100)',
    hint: 'Tulis kedua jawaban, misalnya: a. … b. …',
    answer: 'a. 0,3  b. 0,25',
    accept: {
      numbers: [
        { value: '0,3', form: 'decimal' },
        { value: '0,25', form: 'decimal' },
      ],
    },
    explanation:
      'a. 3/10: penyebutnya 10, jadi ada 1 angka di belakang koma. 3/10 = 0,3. b. 25/100: penyebutnya 100, jadi ada 2 angka di belakang koma. 25/100 = 0,25.',
  },
  {
    id: 'latihan-1-8',
    kind: 'short',
    level: 'LOTS',
    question:
      'Ibu membuat kue dan memerlukan 0,5 kg tepung terigu. Ibu juga memerlukan 0,25 kg gula pasir. Berapa kilogram jumlah tepung dan gula yang Ibu perlukan seluruhnya?',
    answer: '0,75 kg',
    accept: { numbers: [{ value: '0,75' }] },
    explanation:
      'Diketahui: tepung 0,5 kg dan gula 0,25 kg. Jumlah = 0,50 + 0,25 = 0,75 kg. Jadi, tepung dan gula seluruhnya 0,75 kg.',
  },
  {
    id: 'latihan-1-9',
    kind: 'short',
    level: 'LOTS',
    question:
      'Pak Budi punya 6,5 kg pupuk. Sebanyak 2,25 kg dipakai untuk tanaman bayam dan 1,5 kg dipakai untuk tanaman cabai. Berapa kilogram pupuk Pak Budi yang tersisa?',
    answer: '2,75 kg',
    accept: { numbers: [{ value: '2,75' }] },
    explanation:
      'Pupuk yang dipakai = 2,25 + 1,5 = 3,75 kg. Pupuk yang tersisa = 6,5 − 3,75 = 2,75 kg. Jadi, pupuk yang tersisa 2,75 kg.',
  },
  {
    id: 'latihan-1-10',
    kind: 'short',
    level: 'LOTS',
    question:
      'Di sebuah sekolah, ada 100 siswa yang menyukai pelajaran Bahasa Indonesia. Sebanyak 40 siswa di antaranya sedang mengikuti pelajaran olahraga. Tulislah banyak siswa yang mengikuti olahraga dalam bentuk persen!',
    hint: 'Contoh penulisan persen: 25%',
    answer: '40%',
    accept: { numbers: [{ value: '40' }] },
    explanation: '40 dari 100 siswa sama dengan 40/100. Per seratus ditulis persen, jadi 40/100 = 40%.',
  },

  // ───────────── Level 2: MOTS (pilihan ganda) ─────────────
  {
    id: 'latihan-2-1',
    kind: 'choice',
    level: 'MOTS',
    title: 'Pizza Nisa',
    question:
      'Nisa membeli satu pizza yang dipotong menjadi 8 bagian sama besar. Nisa makan 3/8 bagian dan adiknya makan 2/8 bagian. Berapa bagian pizza yang masih tersisa?',
    options: { A: '3/8', B: '5/8', C: '1/8', D: '6/8' },
    correctAnswer: 'A',
    explanation:
      'Yang sudah dimakan = 3/8 + 2/8 = 5/8. Satu pizza utuh = 8/8. Sisanya = 8/8 − 5/8 = 3/8. Penyebutnya sama, jadi hanya pembilang yang dijumlahkan dan dikurangkan.',
  },
  {
    id: 'latihan-2-2',
    kind: 'choice',
    level: 'MOTS',
    title: 'Menyiram Kebun',
    question:
      'Komang menyiram kebun sayur. Pagi hari ia menyiram 1/3 bagian kebun. Sore hari ia menyiram 1/4 bagian kebun. Berapa bagian kebun yang sudah disiram Komang?',
    options: { A: '2/7', B: '2/12', C: '7/12', D: '5/12' },
    correctAnswer: 'C',
    explanation:
      'Penyebutnya berbeda, jadi samakan dulu. KPK dari 3 dan 4 adalah 12. 1/3 = 4/12 dan 1/4 = 3/12. 4/12 + 3/12 = 7/12.',
  },
  {
    id: 'latihan-2-3',
    kind: 'choice',
    level: 'MOTS',
    title: 'Gula Ibu',
    question: 'Ibu punya gula 7/8 kg. Ibu memakai 1/4 kg gula untuk membuat kue. Berapa kg gula Ibu yang masih tersisa?',
    options: { A: '6/4 kg', B: '5/8 kg', C: '6/8 kg', D: '3/8 kg' },
    correctAnswer: 'B',
    explanation:
      'Penyebutnya berbeda. Ubah 1/4 menjadi 2/8 (pembilang dan penyebut dikali 2). 7/8 − 2/8 = 5/8 kg. Hati-hati: jangan ikut mengurangkan penyebutnya (8 − 4). Penyebut tetap.',
  },
  {
    id: 'latihan-2-4',
    kind: 'choice',
    level: 'MOTS',
    title: 'Belanja Bahan Kue',
    question: 'Yohana membeli tepung 2 1/2 kg dan gula 1 3/4 kg. Berapa kg berat seluruh belanjaan Yohana?',
    options: { A: '3 1/4 kg', B: '3 3/4 kg', C: '4 1/4 kg', D: '4 1/2 kg' },
    correctAnswer: 'C',
    explanation:
      'Samakan penyebut menjadi 4: 2 1/2 = 2 2/4. Jumlahkan bilangan bulat: 2 + 1 = 3. Jumlahkan pecahan: 2/4 + 3/4 = 5/4 = 1 1/4. Hasilnya 3 + 1 1/4 = 4 1/4 kg.',
  },
  {
    id: 'latihan-2-5',
    kind: 'choice',
    level: 'MOTS',
    title: 'Pita untuk Kado',
    question: 'Nisa punya pita sepanjang 5 1/3 m. Ia memakai 2 1/2 m untuk membungkus kado. Berapa meter pita Nisa yang tersisa?',
    options: { A: '3 1/6 m', B: '2 5/6 m', C: '2 1/6 m', D: '3 5/6 m' },
    correctAnswer: 'B',
    explanation:
      'Ubah ke pecahan biasa: 5 1/3 = 16/3 dan 2 1/2 = 5/2. KPK dari 3 dan 2 adalah 6: 16/3 = 32/6 dan 5/2 = 15/6. 32/6 − 15/6 = 17/6 = 2 5/6 m.',
  },
  {
    id: 'latihan-2-6',
    kind: 'choice',
    level: 'MOTS',
    title: 'Lompat Jauh Yohana',
    question:
      'Yohana berlatih lompat jauh. Lompatan pertamanya 2 3/4 m dan lompatan keduanya 3 1/2 m. Berapa meter selisih kedua lompatan itu?',
    options: { A: '1 1/4 m', B: '1 3/4 m', C: '3/4 m', D: '6 1/4 m' },
    correctAnswer: 'C',
    explanation:
      'Ubah ke pecahan biasa: 3 1/2 = 14/4 dan 2 3/4 = 11/4. Selisihnya 14/4 − 11/4 = 3/4 m. Hati-hati: 1/2 lebih kecil dari 3/4, jadi pecahannya tidak bisa langsung dikurangkan tanpa diubah bentuknya dulu.',
  },
  {
    id: 'latihan-2-7',
    kind: 'choice',
    level: 'MOTS',
    title: 'Siapa Lebih Tinggi?',
    question: 'Tinggi badan Asep 1,35 m. Tinggi badan Komang 1 3/10 m. Berapa sentimeter selisih tinggi badan mereka?',
    options: { A: '5 cm', B: '50 cm', C: '0,5 cm', D: '15 cm' },
    correctAnswer: 'A',
    explanation:
      '3/10 = 0,3, jadi tinggi Komang 1,30 m. Selisihnya 1,35 − 1,30 = 0,05 m. 1 m = 100 cm, jadi 0,05 m = 5 cm.',
  },
  {
    id: 'latihan-2-8',
    kind: 'choice',
    level: 'MOTS',
    title: 'Bensin Motor Ayah',
    question:
      'Pagi hari Ayah mengisi motor dengan 2,5 liter bensin. Sore hari Ayah menambah 1 3/4 liter bensin. Berapa liter bensin yang Ayah beli hari itu?',
    options: { A: '3,25 liter', B: '4,25 liter', C: '4,75 liter', D: '3,75 liter' },
    correctAnswer: 'B',
    explanation: '3/4 = 0,75, jadi 1 3/4 = 1,75 liter. Jumlahnya 2,5 + 1,75 = 4,25 liter.',
  },
  {
    id: 'latihan-2-9',
    kind: 'choice',
    level: 'MOTS',
    title: 'Lomba Lari',
    question:
      'Lukas berlari sejauh 0,8 km. Nisa berlari sejauh 3/4 km. Asep berlari sejauh 0,65 km. Urutan jarak lari dari yang paling dekat ke yang paling jauh adalah ....',
    options: {
      A: 'Lukas, Nisa, Asep',
      B: 'Asep, Lukas, Nisa',
      C: 'Asep, Nisa, Lukas',
      D: 'Nisa, Asep, Lukas',
    },
    correctAnswer: 'C',
    explanation:
      'Samakan bentuknya menjadi desimal. 3/4 = 0,75 km. Asep 0,65 km, Nisa 0,75 km, Lukas 0,80 km. Urutan dari terdekat: 0,65 < 0,75 < 0,80, yaitu Asep, Nisa, Lukas.',
  },

  // ───────────── Level 3: HOTS (pilihan ganda) ─────────────
  {
    id: 'latihan-3-1',
    kind: 'choice',
    level: 'HOTS',
    title: 'Kue Lapis di Market Day',
    question:
      'Di kegiatan market day sekolah, Siti dan Rina membawa kue lapis yang ukurannya sama besar. Siti memotong kuenya menjadi 8 bagian sama besar dan membagikan 4 potong. Rina memotong kuenya menjadi 4 bagian sama besar dan membagikan 2 potong. Siti berkata, “Kue yang aku bagikan lebih banyak daripada kue yang kamu bagikan, karena 4 lebih besar dari 2.” Tanggapan Rina mana yang paling tepat?',
    options: {
      A: 'Rina setuju, karena 4 potong memang lebih banyak daripada 2 potong.',
      B: 'Rina tidak setuju, karena kue yang dibagikan Siti dan Rina sama banyak, yaitu setengah bagian kue.',
      C: 'Rina tidak setuju, karena 2 potong selalu lebih kecil daripada 4 potong.',
      D: 'Rina setuju, karena penyebut 8 lebih besar daripada penyebut 4.',
    },
    correctAnswer: 'B',
    explanation:
      'Siti membagikan 4/8 bagian kue. Rina membagikan 2/4 bagian kue. Kedua pecahan itu senilai: 4/8 = 2/4 = 1/2. Siti salah karena hanya membandingkan pembilang (4 dan 2) tanpa melihat penyebutnya. Pilihan A, C, dan D salah karena hanya melihat angka pembilang atau penyebut sendiri-sendiri.',
  },
  {
    id: 'latihan-3-2',
    kind: 'choice',
    level: 'HOTS',
    title: 'Sisa Tepung Ibu',
    question:
      'Ibu punya dua wadah tepung terigu yang masing-masing berisi 1 kg. Setelah dipakai untuk membuat kue, sisa tepung di wadah pertama 3/4 kg dan di wadah kedua 5/8 kg. Pernyataan mana yang benar?',
    options: {
      A: 'Sisa tepung wadah pertama lebih banyak, karena 3/4 lebih besar daripada 5/8.',
      B: 'Sisa tepung wadah kedua lebih banyak, karena 5/8 lebih besar daripada 3/4.',
      C: 'Sisa tepung kedua wadah sama banyak, karena pembilang dan penyebutnya berbeda.',
      D: 'Sisa tepung wadah pertama lebih sedikit, karena 3/4 lebih kecil daripada 5/8.',
    },
    correctAnswer: 'A',
    explanation:
      'Penyebutnya berbeda, jadi samakan menjadi 8: 3/4 = 6/8. Bandingkan: 6/8 lebih besar daripada 5/8. Jadi, sisa tepung wadah pertama lebih banyak. Pilihan B dan D salah karena mengira pembilang yang lebih besar (5 lebih besar dari 3) berarti pecahannya lebih besar. Pilihan C salah karena pecahan yang pembilang dan penyebutnya berbeda tetap bisa dibandingkan.',
  },
  {
    id: 'latihan-3-3',
    kind: 'choice',
    level: 'HOTS',
    title: 'Panen Pak Tani',
    question:
      'Hari pertama, Pak Tani memanen 2/5 kuintal jeruk dan 1/2 kuintal apel. Hari kedua, ia memanen 3/10 kuintal jeruk dan 2/5 kuintal apel. Pernyataan mana yang benar tentang total panen jeruk dan apel selama dua hari?',
    options: {
      A: 'Total panen jeruk lebih banyak daripada apel, karena 2/5 + 3/10 lebih besar daripada 1/2 + 2/5.',
      B: 'Total panen apel lebih banyak daripada jeruk, karena 1/2 + 2/5 lebih besar daripada 2/5 + 3/10.',
      C: 'Total panen jeruk dan apel sama banyak, karena 2/5 + 3/10 sama dengan 1/2 + 2/5.',
      D: 'Total panen jeruk lebih sedikit daripada apel, karena 3/10 lebih kecil daripada 2/5.',
    },
    correctAnswer: 'B',
    explanation:
      'Total jeruk: 2/5 + 3/10 = 4/10 + 3/10 = 7/10 kuintal. Total apel: 1/2 + 2/5 = 5/10 + 4/10 = 9/10 kuintal. Karena 9/10 lebih besar daripada 7/10, total panen apel lebih banyak. Pilihan A, C, dan D salah karena salah menyamakan penyebut atau hanya membandingkan pembilang secara langsung.',
  },
  {
    id: 'latihan-3-4',
    kind: 'choice',
    level: 'HOTS',
    title: 'Resep Baru Titi',
    question:
      'Ibu punya 3/4 kg tepung. Titi ingin membuat resep baru yang memakai seluruh tepung tanpa sisa. Rancangan penggunaan tepung mana yang tepat?',
    options: {
      A: '1/8 + 1/4 + 1/4',
      B: '1/2 + 1/8 + 1/8',
      C: '1/4 + 1/8 + 1/8',
      D: '1/2 + 1/4 + 1/8',
    },
    correctAnswer: 'B',
    explanation:
      'Kita cari rancangan yang jumlahnya 3/4 kg. Langkah 1, samakan penyebut: 1/2 = (1 × 4)/(2 × 4) = 4/8. Langkah 2, jumlahkan: 4/8 + 1/8 + 1/8 = 6/8. Langkah 3, sederhanakan dengan membagi 2: 6/8 = 3/4. Jadi, pilihan B tepat karena jumlahnya 3/4 kg.',
  },
  {
    id: 'latihan-3-5',
    kind: 'choice',
    level: 'HOTS',
    title: 'Pizza untuk Tiga Kelompok',
    question:
      'Dalam kegiatan makan bersama, siswa kelas V membagi satu pizza untuk tiga kelompok. Kelompok pertama dapat 1/2 bagian dan kelompok kedua dapat 1/4 bagian. Sisa pizza diberikan kepada kelompok ketiga agar seluruh pizza habis terbagi. Rancangan mana yang tepat?',
    options: {
      A: 'Kelompok ketiga mendapat 1/8 bagian karena jumlah seluruh bagian menjadi 7/8.',
      B: 'Kelompok ketiga mendapat 1/4 bagian karena jumlah seluruh bagian menjadi satu pizza utuh.',
      C: 'Kelompok ketiga mendapat 1/3 bagian karena setiap kelompok harus mendapat bagian yang sama.',
      D: 'Kelompok ketiga mendapat 1/6 bagian karena pecahan itu lebih kecil daripada bagian kelompok pertama.',
    },
    correctAnswer: 'B',
    explanation:
      'Langkah 1, jumlahkan bagian kelompok pertama dan kedua: 1/2 + 1/4 = 2/4 + 1/4 = 3/4. Langkah 2, hitung sisa pizza: 1 − 3/4 = 4/4 − 3/4 = 1/4. Langkah 3, periksa: 1/2 + 1/4 + 1/4 = 1. Jadi, jawaban B benar karena pizza terbagi habis tanpa sisa.',
  },
  {
    id: 'latihan-3-6',
    kind: 'choice',
    level: 'HOTS',
    title: 'Bersepeda Dika',
    question:
      'Pada hari libur, Dika bersepeda bersama kakaknya. Pagi hari mereka menempuh 3 1/2 km. Sore hari mereka bersepeda lagi sejauh 2 3/4 km. Target mereka adalah 7 km dalam sehari. Dika berkata target sudah tercapai karena jumlah jarak pagi dan sore lebih dari 6 km. Apakah jarak yang ditempuh sudah mencapai target?',
    options: {
      A: 'Dika benar karena jarak total mereka 7 1/4 km.',
      B: 'Dika benar karena jarak total mereka 6 1/4 km dan sudah mencapai target.',
      C: 'Dika salah karena jarak total mereka 6 1/4 km sehingga masih kurang 3/4 km.',
      D: 'Dika salah karena total mereka 5 1/4 km sehingga masih kurang 1 3/4 km.',
    },
    correctAnswer: 'C',
    explanation:
      'Penyebutnya berbeda, jadi samakan dulu: 3 1/2 + 2 3/4 = 3 2/4 + 2 3/4 = 5 5/4 = 6 1/4. Total jarak = 6 1/4 km. Target 7 km, jadi kurangnya 7 − 6 1/4 = 3/4 km. Walaupun sudah lebih dari 6 km, target 7 km belum tercapai. Mereka masih perlu bersepeda 3/4 km.',
  },
  {
    id: 'latihan-3-7',
    kind: 'choice',
    level: 'HOTS',
    title: 'Pita Kelompok Sari',
    question:
      'Kelompok Sari mendapat pita sepanjang 5 1/2 meter untuk menghias kelas. Pita dipakai untuk hiasan jendela sepanjang 1 3/4 meter dan hiasan papan tulis sepanjang 2 1/4 meter. Kelompok Sari ingin membuat satu hiasan tambahan yang butuh pita 1 1/2 meter. Apakah hiasan tambahan dapat dibuat?',
    options: {
      A: 'Hiasan tambahan dapat dibuat karena pita tersisa 1 1/2 meter.',
      B: 'Hiasan tambahan tidak dapat dibuat karena pita tersisa 1 1/4 meter.',
      C: 'Hiasan tambahan dapat dibuat karena pita tersisa 2 1/2 meter.',
      D: 'Hiasan tambahan tidak dapat dibuat karena pita tersisa 3/4 meter.',
    },
    correctAnswer: 'A',
    explanation:
      'Pita yang sudah dipakai: 1 3/4 + 2 1/4 = 4 meter. Pita awal 5 1/2 meter, jadi sisanya 5 1/2 − 4 = 1 1/2 meter. Hiasan tambahan butuh 1 1/2 meter, sama dengan pita yang tersisa, jadi bisa dibuat. Setelah itu, pita habis tanpa sisa.',
  },
  {
    id: 'latihan-3-8',
    kind: 'choice',
    level: 'HOTS',
    title: 'Air Minum Pramuka',
    question:
      'Dalam kegiatan pramuka, tersedia 8 1/2 liter air minum. Pagi hari peserta memakai 2 3/4 liter. Siang hari mereka memakai lagi 3 1/2 liter. Ketua kelompok memperkirakan sisa air masih lebih dari 3 liter, sehingga cukup untuk kegiatan sore. Seorang anggota ingin memeriksa perkiraan itu dulu. Apakah perkiraan ketua benar?',
    options: {
      A: 'Perkiraan ketua benar karena sisa air 3 1/4 liter.',
      B: 'Perkiraan ketua benar karena sisa air 3 3/4 liter.',
      C: 'Perkiraan ketua salah karena sisa air 2 1/4 liter.',
      D: 'Perkiraan ketua salah karena sisa air 2 3/4 liter.',
    },
    correctAnswer: 'C',
    explanation:
      'Jumlahkan air yang sudah dipakai: 2 3/4 + 3 1/2 = 2 3/4 + 3 2/4 = 6 1/4 liter. Hitung sisa air: 8 1/2 − 6 1/4 = 8 2/4 − 6 1/4 = 2 1/4 liter. Sisa air 2 1/4 liter, kurang dari 3 liter, jadi perkiraan ketua salah. Sebaiknya kelompok memeriksa kebutuhan air untuk kegiatan sore dan mengambil air tambahan jika perlu.',
  },
  {
    id: 'latihan-3-9',
    kind: 'choice',
    level: 'HOTS',
    title: 'Adonan Bazar',
    question:
      'Panitia bazar sekolah membuat adonan sebanyak 5 1/2 kg dari tiga bahan: tepung, gula, dan mentega. Ketentuannya: tepung harus 2 1/2 kg; gula lebih dari 1/2 kg tetapi kurang dari 1 kg; mentega melengkapi adonan sampai 5 1/2 kg. Rancangan mana yang memenuhi semua ketentuan?',
    options: {
      A: 'Tepung 2 1/2 kg, gula 3/4 kg, dan mentega 2 1/4 kg.',
      B: 'Tepung 2 1/2 kg, gula 1 1/4 kg, dan mentega 1 3/4 kg.',
      C: 'Tepung 2 1/4 kg, gula 3/4 kg, dan mentega 2 1/2 kg.',
      D: 'Tepung 2 1/2 kg, gula 1/2 kg, dan mentega 2 1/2 kg.',
    },
    correctAnswer: 'A',
    explanation:
      'Jumlahkan bahan pilihan A: 2 1/2 + 3/4 + 2 1/4. Ubah ke pecahan biasa: 5/2 + 3/4 + 9/4. Samakan penyebut menjadi 4: 10/4 + 3/4 + 9/4 = 22/4 = 11/2 = 5 1/2 kg. Sesuai target. Pilihan B salah karena gula 1 1/4 kg, lebih dari 1 kg. Pilihan C salah karena tepungnya 2 1/4 kg, padahal harus 2 1/2 kg. Pilihan D salah karena gula hanya 1/2 kg, padahal harus lebih dari 1/2 kg.',
  },
  {
    id: 'latihan-3-10',
    kind: 'choice',
    level: 'HOTS',
    title: 'Campuran Jus Buah',
    question:
      'Di bazar sekolah, siswa kelas V membuat campuran jus buah sebanyak 5 1/2 liter dari jus mangga, jus jeruk, dan air. Ketentuannya: jus mangga 1 1/2 liter; jus jeruk lebih dari 1 liter tetapi kurang dari 2 liter; air melengkapi campuran sampai 5 1/2 liter. Campuran mana yang paling tepat?',
    options: {
      A: 'Jus mangga 1 1/2 liter, jus jeruk 1 1/4 liter, dan air 2 3/4 liter.',
      B: 'Jus mangga 1 1/2 liter, jus jeruk 2 1/4 liter, dan air 1 3/4 liter.',
      C: 'Jus mangga 1 3/4 liter, jus jeruk 1 1/4 liter, dan air 2 1/2 liter.',
      D: 'Jus mangga 1 1/2 liter, jus jeruk 1 3/4 liter, dan air 2 1/2 liter.',
    },
    correctAnswer: 'A',
    explanation:
      'Jumlahkan bahan pilihan A: 1 1/2 + 1 1/4 + 2 3/4. Ubah ke pecahan biasa: 3/2 + 5/4 + 11/4. Samakan penyebut menjadi 4: 6/4 + 5/4 + 11/4 = 22/4 = 11/2 = 5 1/2 liter. Sesuai target. Pilihan B salah karena jus jeruk 2 1/4 liter, lebih dari 2 liter. Pilihan C salah karena jus mangga 1 3/4 liter, padahal harus 1 1/2 liter. Pilihan D salah karena jumlahnya 1 1/2 + 1 3/4 + 2 1/2 = 5 3/4 liter, lebih dari 5 1/2 liter.',
  },
]
