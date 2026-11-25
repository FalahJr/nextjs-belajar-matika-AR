import type { ARCardContent } from "../types/ar";

/**
 * MATERI & SOAL enam kartu AR (urutan tampilan di landing page dan Mode Demo).
 *
 * File ini sengaja TIDAK berisi `targetIndex` atau path model. Pemetaan target (.mind) dan
 * ketersediaan model GLB dikelola di `src/config/arTargets.ts` + `src/config/targets/*.json`.
 *
 * Soal: sumber docs/quiz di AR card.docx (6 kartu x 3 soal). Struktur (3 soal per kartu, opsi A–C atau A–D, kunci)
 * divalidasi oleh unit test. Card 1 bergambar dan hanya punya 3 opsi; gambar ada di public/assets/quiz/.
 */
export const AR_CARD_CONTENT: ARCardContent[] = [
  {
    cardId: "pizza-pecahan-biasa",
    title: "Pecahan Biasa",
    type: "PIZZA",
    topic: "Mengenal pembilang, penyebut, dan konsep dasar pecahan.",
    questions: [
      {
        id: "pizza-pecahan-biasa-1",
        question: "Gambar di bawah bernilai berapa?",
        image: {
          src: "/assets/quiz/card-1-soal-1.png",
          alt: "Segitiga dibagi dua sama besar, satu bagian berwarna kuning.",
        },
        options: {
          A: "2/1",
          B: "1/2",
          C: "1/3",
        },
        correctAnswer: "B",
        explanation: "Segitiga dibagi menjadi 2 bagian sama besar dan 1 bagian berwarna, jadi nilainya 1/2.",
      },
      {
        id: "pizza-pecahan-biasa-2",
        question: "Gambar di bawah bernilai berapa?",
        image: {
          src: "/assets/quiz/card-1-soal-2.png",
          alt: "Segitiga dibagi tiga sama besar, satu bagian berwarna kuning.",
        },
        options: {
          A: "2/3",
          B: "1/2",
          C: "1/3",
        },
        correctAnswer: "C",
        explanation: "Segitiga dibagi menjadi 3 bagian sama besar dan 1 bagian berwarna, jadi nilainya 1/3.",
      },
      {
        id: "pizza-pecahan-biasa-3",
        question: "Gambar di bawah bernilai berapa?",
        image: {
          src: "/assets/quiz/card-1-soal-3.png",
          alt: "Segilima dibagi lima sama besar, dua bagian berwarna kuning.",
        },
        options: {
          A: "2/5",
          B: "3/5",
          C: "4/5",
        },
        correctAnswer: "A",
        explanation: "Segilima dibagi menjadi 5 bagian sama besar dan 2 bagian berwarna, jadi nilainya 2/5.",
      },
    ],
  },
  {
    cardId: "susu-pecahan-campuran",
    title: "Pecahan Campuran",
    type: "SUSU",
    topic: "Menjumlahkan, mengurangkan, dan mengubah pecahan campuran menjadi pecahan biasa.",
    questions: [
      {
        id: "susu-pecahan-campuran-1",
        question: "Hitunglah 1 1/2 + 2 1/2!",
        options: {
          A: "1",
          B: "1/2",
          C: "4",
          D: "2/4",
        },
        correctAnswer: "C",
        explanation: "Jumlahkan bilangan bulatnya: 1 + 2 = 3. Jumlahkan pecahannya: 1/2 + 1/2 = 1. Jadi 3 + 1 = 4.",
      },
      {
        id: "susu-pecahan-campuran-2",
        question: "Hitunglah 3 3/4 − 1 1/4!",
        options: {
          A: "2 1/2",
          B: "4 1/2",
          C: "3",
          D: "4",
        },
        correctAnswer: "A",
        explanation: "Kurangkan bilangan bulatnya: 3 − 1 = 2. Kurangkan pecahannya: 3/4 − 1/4 = 2/4 = 1/2. Jadi hasilnya 2 1/2.",
      },
      {
        id: "susu-pecahan-campuran-3",
        question: "Ubahlah pecahan campuran 2 1/3 menjadi pecahan biasa!",
        options: {
          A: "6",
          B: "4",
          C: "3/2",
          D: "7/3",
        },
        correctAnswer: "D",
        explanation: "2 1/3 = (2 × 3 + 1)/3 = 7/3.",
      },
    ],
  },
  {
    cardId: "piring-buah-desimal",
    title: "Pecahan Menjadi Desimal",
    type: "BUAH SAYUR",
    topic: "Mengubah pecahan menjadi bentuk desimal.",
    questions: [
      {
        id: "piring-buah-desimal-1",
        question: "Pecahan 3/10 jika ditulis dalam bentuk desimal menjadi …",
        options: {
          A: "0,03",
          B: "0,3",
          C: "3,10",
          D: "30",
        },
        correctAnswer: "B",
        explanation: "Penyebutnya 10, jadi ada 1 angka di belakang koma. 3/10 = 0,3.",
      },
      {
        id: "piring-buah-desimal-2",
        question: "Pada bilangan 4,275, angka 7 menempati nilai tempat …",
        options: {
          A: "satuan",
          B: "persepuluhan",
          C: "perseratusan",
          D: "perseribuan",
        },
        correctAnswer: "C",
        explanation: "Setelah koma: 2 persepuluhan, 7 perseratusan, 5 perseribuan. Jadi angka 7 menempati nilai tempat perseratusan.",
      },
      {
        id: "piring-buah-desimal-3",
        question: "Bilangan 0,25 dibaca …",
        options: {
          A: "nol koma dua lima",
          B: "nol koma satu",
          C: "dua koma lima",
          D: "nol koma dua puluh lima ratus",
        },
        correctAnswer: "A",
        explanation: "Angka di belakang koma dibaca satu per satu, jadi 0,25 dibaca nol koma dua lima.",
      },
    ],
  },
  {
    cardId: "jajanan-ubah-persen",
    title: "Pecahan Menjadi Persen",
    type: "JAJANAN PASAR",
    topic: "Mengubah pecahan menjadi bentuk persen.",
    questions: [
      {
        id: "jajanan-ubah-persen-1",
        question: "Tanda % dibaca persen. Persen artinya …",
        options: {
          A: "per sepuluh",
          B: "per seratus",
          C: "per seribu",
          D: "per satu",
        },
        correctAnswer: "B",
        explanation: "Persen berarti per seratus. Jadi 40% sama dengan 40/100.",
      },
      {
        id: "jajanan-ubah-persen-2",
        question: "Pecahan 3/5 jika diubah menjadi persen adalah …",
        options: {
          A: "35%",
          B: "53%",
          C: "60%",
          D: "80%",
        },
        correctAnswer: "C",
        explanation: "3/5 = 60/100 = 60%.",
      },
      {
        id: "jajanan-ubah-persen-3",
        question: "Berapa 20% dari 150?",
        options: {
          A: "3",
          B: "20",
          C: "130",
          D: "30",
        },
        correctAnswer: "D",
        explanation: "20% = 20/100. Jadi 20/100 × 150 = 30.",
      },
    ],
  },
  {
    cardId: "pizza-urut-campuran",
    title: "Mengurutkan Pecahan",
    type: "KUE",
    topic: "Mengurutkan, membandingkan, dan mengubah pecahan menjadi persen.",
    questions: [
      {
        id: "pizza-urut-campuran-1",
        question: "Urutan pecahan 1/2, 1/4, dan 3/4 dari yang terkecil adalah …",
        options: {
          A: "1/2, 1/4, 3/4",
          B: "1/4, 1/2, 3/4",
          C: "3/4, 1/2, 1/4",
          D: "1/4, 3/4, 1/2",
        },
        correctAnswer: "B",
        explanation: "Samakan penyebut menjadi 4: 1/2 = 2/4. Urutannya 1/4 < 2/4 < 3/4, yaitu 1/4, 1/2, 3/4.",
      },
      {
        id: "pizza-urut-campuran-2",
        question: "Perbandingan yang benar antara 2/3 dan 1/2 adalah …",
        options: {
          A: "2/3 < 1/2",
          B: "2/3 = 1/2",
          C: "2/3 > 1/2",
          D: "tidak bisa dibandingkan",
        },
        correctAnswer: "C",
        explanation: "Samakan penyebut menjadi 6: 2/3 = 4/6 dan 1/2 = 3/6. Karena 4/6 lebih besar dari 3/6, maka 2/3 > 1/2.",
      },
      {
        id: "pizza-urut-campuran-3",
        question: "Pecahan 3/4 jika diubah ke bentuk persen menjadi …",
        options: {
          A: "34%",
          B: "0,75%",
          C: "25%",
          D: "75%",
        },
        correctAnswer: "D",
        explanation: "3/4 = 75/100 = 75%.",
      },
    ],
  },
  {
    cardId: "kue-operasi-hitung",
    title: "Operasi Hitung Pecahan",
    type: "MOCHI",
    topic: "Membandingkan, mengalikan, dan membagi pecahan.",
    questions: [
      {
        id: "kue-operasi-hitung-1",
        question: "Bandingkan 2/3 dan 3/4. Pernyataan yang benar adalah …",
        options: {
          A: "2/3 > 3/4",
          B: "2/3 = 3/4",
          C: "2/3 < 3/4",
          D: "8/12 > 9/12",
        },
        correctAnswer: "C",
        explanation: "Samakan penyebut menjadi 12: 2/3 = 8/12 dan 3/4 = 9/12. Karena 8/12 lebih kecil dari 9/12, maka 2/3 < 3/4.",
      },
      {
        id: "kue-operasi-hitung-2",
        question: "Hasil dari 2/3 × 1/4 dalam bentuk paling sederhana adalah …",
        options: {
          A: "3/7",
          B: "2/7",
          C: "1/6",
          D: "8/3",
        },
        correctAnswer: "C",
        explanation: "Kalikan pembilang dengan pembilang dan penyebut dengan penyebut: 2/12. Sederhanakan dengan membagi 2: 1/6.",
      },
      {
        id: "kue-operasi-hitung-3",
        question: "Cara menghitung a/b ÷ c/d adalah …",
        options: {
          A: "a/b × c/d",
          B: "b/a × d/c",
          C: "a/b + d/c",
          D: "a/b × d/c",
        },
        correctAnswer: "D",
        explanation: "Membagi dengan pecahan sama dengan mengalikan dengan kebalikannya: a/b ÷ c/d = a/b × d/c.",
      },
    ],
  },
];
