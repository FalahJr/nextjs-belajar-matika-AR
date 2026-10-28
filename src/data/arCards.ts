import type { ARCardConfig } from "../types/ar";

/**
 * Konfigurasi enam kartu AR.
 *
 * PENTING — `targetIndex`:
 * Nilai di bawah ini adalah urutan YANG DIRENCANAKAN (0–5). MindAR memberi indeks berdasarkan
 * urutan gambar saat dikompilasi menjadi `cards.mind`, BUKAN berdasarkan nama file atau `cardId`.
 * Setelah file .mind dibuat, uji tiap kartu fisik lalu sesuaikan `targetIndex` di sini bila perlu.
 *
 * PENTING — soal:
 * Seluruh soal di bawah adalah KONTEN AWAL (placeholder untuk pengembangan), bukan soal final.
 * Ganti sesuai materi final; struktur (3 soal, opsi A–D, kunci) divalidasi oleh unit test.
 */
export const AR_CARDS: ARCardConfig[] = [
  {
    cardId: "pizza-pecahan-biasa",
    targetIndex: 0,
    title: "Pecahan Biasa",
    type: "PIZZA",
    topic: "Mengenal pembilang, penyebut, dan konsep dasar pecahan.",
    modelUrl: "/assets/models/pizza-pecahan-biasa.glb",
    questions: [
      {
        id: "pizza-pecahan-biasa-1",
        question:
          "Sebuah pizza dibagi menjadi 8 potong sama besar. Rina memakan 3 potong. Pecahan yang menunjukkan bagian yang dimakan Rina adalah …",
        options: { A: "3/8", B: "8/3", C: "5/8", D: "3/5" },
        correctAnswer: "A",
        explanation:
          "Rina makan 3 dari 8 potong, jadi bagiannya 3/8 (pembilang 3, penyebut 8).",
      },
      {
        id: "pizza-pecahan-biasa-2",
        question: "Pada pecahan 5/6, angka 6 disebut …",
        options: {
          A: "pembilang",
          B: "bilangan bulat",
          C: "penyebut",
          D: "hasil bagi",
        },
        correctAnswer: "C",
        explanation:
          "Angka di bawah garis pecahan adalah penyebut. Ia menunjukkan pizza dibagi menjadi berapa bagian sama besar.",
      },
      {
        id: "pizza-pecahan-biasa-3",
        question:
          "Sebuah pizza dibagi menjadi 4 potong sama besar. Jika 2 potong dimakan, bagian itu dapat ditulis dengan pecahan paling sederhana …",
        options: { A: "1/4", B: "1/2", C: "3/4", D: "2/3" },
        correctAnswer: "B",
        explanation:
          "2/4 sama dengan 1/2, karena pembilang dan penyebut sama-sama dibagi 2.",
      },
    ],
  },
  {
    cardId: "susu-pecahan-campuran",
    targetIndex: 1,
    title: "Pecahan Campuran",
    type: "SUSU",

    topic: "Mengubah pecahan biasa menjadi pecahan campuran dan sebaliknya.",
    modelUrl: "/assets/models/susu-pecahan-campuran.glb",
    questions: [
      {
        id: "susu-pecahan-campuran-1",
        question: "Pecahan 7/3 jika diubah menjadi pecahan campuran adalah …",
        options: { A: "1 1/3", B: "2 1/3", C: "3 1/3", D: "2 2/3" },
        correctAnswer: "B",
        explanation: "7 dibagi 3 = 2 sisa 1. Jadi 7/3 = 2 1/3.",
      },
      {
        id: "susu-pecahan-campuran-2",
        question:
          "Ibu membeli 3 1/2 liter susu. Jika ditulis sebagai pecahan biasa, hasilnya adalah …",
        options: { A: "4/2", B: "5/2", C: "6/2", D: "7/2" },
        correctAnswer: "D",
        explanation: "3 1/2 = (3 × 2 + 1)/2 = 7/2.",
      },
      {
        id: "susu-pecahan-campuran-3",
        question: "Manakah yang merupakan pecahan campuran?",
        options: { A: "1 3/4", B: "3/4", C: "5/4", D: "4/4" },
        correctAnswer: "A",
        explanation:
          "Pecahan campuran terdiri dari bilangan bulat dan pecahan, yaitu 1 3/4.",
      },
    ],
  },
  {
    cardId: "piring-buah-desimal",
    targetIndex: 2,
    title: "Pecahan Menjadi Desimal",
    type: "BUAH SAYUR",
    topic: "Mengubah pecahan menjadi bentuk desimal.",
    modelUrl: "/assets/models/piring-buah-desimal.glb",
    questions: [
      {
        id: "piring-buah-desimal-1",
        question:
          "Setengah piring buah ditulis 1/2. Dalam bentuk desimal, 1/2 sama dengan …",
        options: { A: "0,2", B: "0,5", C: "1,2", D: "0,12" },
        correctAnswer: "B",
        explanation: "1/2 = 5/10 = 0,5.",
      },
      {
        id: "piring-buah-desimal-2",
        question: "Pecahan 3/4 jika diubah menjadi desimal adalah …",
        options: { A: "0,34", B: "3,4", C: "0,43", D: "0,75" },
        correctAnswer: "D",
        explanation: "3/4 = 75/100 = 0,75.",
      },
      {
        id: "piring-buah-desimal-3",
        question:
          "Bilangan desimal 0,6 jika diubah menjadi pecahan biasa paling sederhana adalah …",
        options: { A: "3/5", B: "6/100", C: "1/6", D: "6/5" },
        correctAnswer: "A",
        explanation:
          "0,6 = 6/10. Pembilang dan penyebut dibagi 2, hasilnya 3/5.",
      },
    ],
  },
  {
    cardId: "jajanan-ubah-persen",
    targetIndex: 3,
    title: "Pecahan Menjadi Persen",
    type: "JAJANAN PASAR",
    topic: "Mengubah pecahan menjadi bentuk persen.",
    modelUrl: "/assets/models/jajanan-ubah-persen.glb",
    questions: [
      {
        id: "jajanan-ubah-persen-1",
        question:
          "Separuh jajanan di piring sudah habis, yaitu 50%. Pecahan yang sama nilainya dengan 50% adalah …",
        options: { A: "1/5", B: "1/4", C: "1/2", D: "1/10" },
        correctAnswer: "C",
        explanation: "50% = 50/100 = 1/2.",
      },
      {
        id: "jajanan-ubah-persen-2",
        question: "Pecahan 1/4 jika diubah menjadi persen adalah …",
        options: { A: "14%", B: "25%", C: "40%", D: "4%" },
        correctAnswer: "B",
        explanation: "1/4 = 25/100 = 25%.",
      },
      {
        id: "jajanan-ubah-persen-3",
        question:
          "Dari 10 permen, 3 permen berwarna merah. Persentase permen merah adalah …",
        options: { A: "3%", B: "13%", C: "7%", D: "30%" },
        correctAnswer: "D",
        explanation: "3/10 = 30/100 = 30%.",
      },
    ],
  },
  {
    cardId: "pizza-urut-campuran",
    targetIndex: 4,
    title: "Mengurutkan Pecahan",
    type: "KUE",
    topic: "Memahami dan mengurutkan nilai pecahan.",
    modelUrl: "/assets/models/pizza-urut-campuran.glb",
    questions: [
      {
        id: "pizza-urut-campuran-1",
        question: "Urutkan dari yang terkecil ke terbesar: 1 1/2, 1 3/4, 1 1/4",
        options: {
          A: "1 3/4, 1 1/2, 1 1/4",
          B: "1 1/2, 1 1/4, 1 3/4",
          C: "1 1/4, 1 1/2, 1 3/4",
          D: "1 1/4, 1 3/4, 1 1/2",
        },
        correctAnswer: "C",
        explanation:
          "Bilangan bulatnya sama (1), jadi bandingkan pecahannya: 1/4 < 2/4 (=1/2) < 3/4.",
      },
      {
        id: "pizza-urut-campuran-2",
        question: "Bilangan campuran yang paling besar adalah …",
        options: { A: "2 1/2", B: "2 1/4", C: "1 3/4", D: "1 1/2" },
        correctAnswer: "A",
        explanation:
          "Bilangan bulat terbesar adalah 2. Di antara 2 1/2 dan 2 1/4, pecahan 1/2 lebih besar dari 1/4.",
      },
      {
        id: "pizza-urut-campuran-3",
        question: "Urutkan dari yang terbesar ke terkecil: 3 1/2, 2 3/4, 3 1/4",
        options: {
          A: "3 1/4, 3 1/2, 2 3/4",
          B: "3 1/2, 3 1/4, 2 3/4",
          C: "2 3/4, 3 1/4, 3 1/2",
          D: "3 1/2, 2 3/4, 3 1/4",
        },
        correctAnswer: "B",
        explanation:
          "Bilangan bulat 3 lebih besar dari 2. Untuk yang sama-sama 3: 1/2 lebih besar dari 1/4.",
      },
    ],
  },
  {
    cardId: "kue-operasi-hitung",
    targetIndex: 5,
    title: "Operasi Hitung Pecahan",
    type: "MOCHI",
    topic:
      "Melakukan operasi hitung pecahan penjumlahan, pengurangan, perkalian, dan pembagian.",
    modelUrl: "/assets/models/kue-operasi-hitung.glb",
    questions: [
      {
        id: "kue-operasi-hitung-1",
        question:
          "Ada 24 kue yang dibagi rata ke dalam 6 kotak. Setiap kotak berisi … kue.",
        options: { A: "3", B: "6", C: "18", D: "4" },
        correctAnswer: "D",
        explanation: "24 ÷ 6 = 4.",
      },
      {
        id: "kue-operasi-hitung-2",
        question:
          "Satu kotak berisi 8 kue. Ayah membeli 5 kotak. Jumlah kue seluruhnya adalah …",
        options: { A: "13", B: "40", C: "45", D: "35" },
        correctAnswer: "B",
        explanation: "5 × 8 = 40.",
      },
      {
        id: "kue-operasi-hitung-3",
        question: "Hasil dari 6 + 4 × 2 adalah …",
        options: { A: "20", B: "12", C: "14", D: "16" },
        correctAnswer: "C",
        explanation:
          "Perkalian dikerjakan lebih dulu: 4 × 2 = 8, lalu 6 + 8 = 14.",
      },
    ],
  },
];
