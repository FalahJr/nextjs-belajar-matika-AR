import type { PracticeQuestion, QuizScore } from '../types/quiz'
import { validateQuestions } from './cards'
import { calculateScore } from './scoring'
import { isShortAnswerCorrect, parseNumbers } from './shortAnswer'

/**
 * Sesi Latihan Soal (tanpa React). Jawaban disimpan sebagai teks per ID soal:
 * huruf A–D untuk pilihan ganda, ketikan murid untuk soal isian.
 */
export type PracticeState = {
  /** Indeks soal aktif. Bernilai `total` ketika latihan selesai. */
  currentIndex: number
  /** Satu soal hanya dapat dijawab sekali. */
  answers: Record<string, string>
}

export const INITIAL_PRACTICE_STATE: PracticeState = { currentIndex: 0, answers: {} }

export function isPracticeFinished(state: PracticeState, questions: readonly PracticeQuestion[]): boolean {
  return state.currentIndex >= questions.length
}

export function isPracticeCorrect(question: PracticeQuestion, answer: string | undefined): boolean {
  if (answer === undefined) return false
  return question.kind === 'choice' ? answer === question.correctAnswer : isShortAnswerCorrect(question, answer)
}

/** Kunci jawaban yang ditampilkan setelah murid menjawab. */
export function correctAnswerLabel(question: PracticeQuestion): string {
  return question.kind === 'choice' ? question.correctAnswer : question.answer
}

/** Mencatat jawaban untuk soal aktif. Jawaban ganda, kosong, atau untuk soal lain diabaikan. */
export function answerPractice(
  state: PracticeState,
  questions: readonly PracticeQuestion[],
  questionId: string,
  answer: string,
): PracticeState {
  const current = questions[state.currentIndex]
  if (!current || current.id !== questionId) return state
  if (state.answers[questionId] !== undefined) return state
  const value = answer.trim()
  if (!value) return state
  return { ...state, answers: { ...state.answers, [questionId]: value } }
}

/** Lanjut ke soal berikutnya; hanya bila soal aktif sudah dijawab. */
export function advancePractice(state: PracticeState, questions: readonly PracticeQuestion[]): PracticeState {
  const current = questions[state.currentIndex]
  if (!current || state.answers[current.id] === undefined) return state
  return { ...state, currentIndex: state.currentIndex + 1 }
}

/** Soal yang belum dijawab dihitung salah. */
export function summarizePractice(
  questions: readonly PracticeQuestion[],
  answers: Readonly<Record<string, string>>,
): QuizScore {
  const correct = questions.filter((q) => isPracticeCorrect(q, answers[q.id])).length
  return { correct, total: questions.length, score: calculateScore(correct, questions.length) }
}

/** Mengembalikan daftar masalah pada set soal latihan (kosong = valid). */
export function validatePracticeQuestions(questions: readonly PracticeQuestion[]): string[] {
  const problems: string[] = []
  const choices = questions.flatMap((q) => (q.kind === 'choice' ? [q] : []))
  problems.push(...validateQuestions(choices, choices.length))

  for (const q of questions) {
    if (!q.explanation.trim()) problems.push(`${q.id}: pembahasan kosong`)
    if (q.kind !== 'short') continue
    if (!q.question.trim()) problems.push(`${q.id}: teks soal kosong`)
    if (!q.answer.trim()) problems.push(`${q.id}: kunci jawaban kosong`)
    const { numbers, keywords } = q.accept
    if (!numbers?.length && !keywords?.length) problems.push(`${q.id}: aturan jawaban kosong`)
    for (const spec of numbers ?? []) {
      if (parseNumbers(spec.value).length !== 1) problems.push(`${q.id}: nilai "${spec.value}" bukan satu bilangan`)
    }
  }

  const ids = questions.map((q) => q.id)
  if (new Set(ids).size !== ids.length) problems.push('ID soal tidak unik')
  return problems
}
