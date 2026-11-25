export type AnswerKey = 'A' | 'B' | 'C' | 'D'

export const ANSWER_KEYS: readonly AnswerKey[] = ['A', 'B', 'C', 'D']

/** Opsi pilihan ganda: minimal A–C, opsi D boleh tidak ada (mis. soal bergambar Card 1 hanya punya 3 opsi). */
export type ChoiceOptions = { A: string; B: string; C: string; D?: string }

/** Gambar pendukung soal; `src` berupa URL publik (mis. /assets/quiz/card-1-soal-1.png). */
export type QuestionImage = { src: string; alt: string }

export type Question = {
  id: string
  question: string
  /** Gambar yang tampil di bawah teks soal (opsional). */
  image?: QuestionImage
  options: ChoiceOptions
  correctAnswer: AnswerKey
  explanation?: string
}

/** Tingkat kesulitan Latihan Soal: LOTS (mudah), MOTS (sedang), HOTS (menantang). */
export type PracticeLevel = 'LOTS' | 'MOTS' | 'HOTS'

type PracticeQuestionBase = {
  id: string
  level: PracticeLevel
  /** Judul pendek soal cerita (opsional), mis. "Pizza Nisa". */
  title?: string
  question: string
  explanation: string
}

/** Soal pilihan ganda A–D (Level 2 dan 3). */
export type PracticeChoiceQuestion = PracticeQuestionBase & {
  kind: 'choice'
  options: Record<AnswerKey, string>
  correctAnswer: AnswerKey
}

/**
 * Bentuk bilangan yang dituntut soal isian. Tanpa `form`, nilai yang sama dengan bentuk apa pun diterima
 * (mis. 3/4 dan 0,75). Dengan `form`, bentuk tulisan murid harus sama.
 */
export type NumberAnswerForm = 'fraction' | 'mixed' | 'decimal'

export type NumberAnswerSpec = {
  /** Nilai benar, ditulis seperti murid menulisnya: "5 3/4", "1/8", "0,25". */
  value: string
  form?: NumberAnswerForm
}

/** Soal isian singkat (Level 1). Jawaban diketik murid dan dicocokkan otomatis. */
export type PracticeShortQuestion = PracticeQuestionBase & {
  kind: 'short'
  /** Petunjuk cara menulis jawaban, tampil di bawah kolom isian. */
  hint?: string
  /** Jawaban yang ditampilkan sebagai kunci (sama dengan docx). */
  answer: string
  accept: {
    /** Bilangan yang harus muncul, berurutan, dan jumlahnya harus sama persis dengan yang diketik. */
    numbers?: NumberAnswerSpec[]
    /** Alternatif jawaban berupa kata: benar bila salah satu kelompok kata muncul semuanya. */
    keywords?: string[][]
    /** Frasa yang membatalkan jawaban, mis. "tidak salah". */
    reject?: string[]
  }
}

export type PracticeQuestion = PracticeChoiceQuestion | PracticeShortQuestion

export type QuizScore = {
  correct: number
  total: number
  /** Nilai 0–100, dibulatkan ke bilangan bulat terdekat. */
  score: number
}
