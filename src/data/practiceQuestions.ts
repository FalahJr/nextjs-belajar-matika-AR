import type { Question } from '../types/quiz'

/** Latihan biasa (tanpa AR). Konten awal untuk pengembangan — ganti sesuai materi final. */
export const PRACTICE_QUESTIONS: Question[] = [
  {
    id: 'latihan-1',
    question: 'Hasil dari 1/3 + 1/3 adalah …',
    options: { A: '2/6', B: '1/3', C: '2/3', D: '3/3' },
    correctAnswer: 'C',
    explanation: 'Penyebutnya sama, jadi cukup jumlahkan pembilangnya: 1 + 1 = 2. Hasilnya 2/3.',
  },
  {
    id: 'latihan-2',
    question: 'Bilangan desimal 0,25 jika ditulis sebagai pecahan biasa paling sederhana adalah …',
    options: { A: '1/4', B: '2/5', C: '25/10', D: '1/25' },
    correctAnswer: 'A',
    explanation: '0,25 = 25/100. Dibagi 25 pada pembilang dan penyebut, hasilnya 1/4.',
  },
  {
    id: 'latihan-3',
    question: 'Persen 75% jika ditulis sebagai desimal adalah …',
    options: { A: '7,5', B: '0,075', C: '0,57', D: '0,75' },
    correctAnswer: 'D',
    explanation: '75% = 75/100 = 0,75.',
  },
  {
    id: 'latihan-4',
    question: 'Pecahan campuran 2 3/5 jika diubah menjadi pecahan biasa adalah …',
    options: { A: '6/5', B: '13/5', C: '10/5', D: '23/5' },
    correctAnswer: 'B',
    explanation: '2 3/5 = (2 × 5 + 3)/5 = 13/5.',
  },
  {
    id: 'latihan-5',
    question: 'Hasil dari 12 × 5 − 10 adalah …',
    options: { A: '70', B: '55', C: '50', D: '60' },
    correctAnswer: 'C',
    explanation: '12 × 5 = 60, lalu 60 − 10 = 50.',
  },
]
