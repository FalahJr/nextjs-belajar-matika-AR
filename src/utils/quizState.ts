import type { AnswerKey, Question } from '../types/quiz'

/** Sesi kuis murni (tanpa React) agar mudah diuji dan dipakai ulang oleh AR dan latihan biasa. */
export type QuizState = {
  /** Indeks soal aktif. Bernilai `total` ketika kuis selesai. */
  currentIndex: number
  /** Jawaban per ID soal. Satu soal hanya dapat dijawab sekali. */
  answers: Record<string, AnswerKey>
}

export const INITIAL_QUIZ_STATE: QuizState = { currentIndex: 0, answers: {} }

export function isFinished(state: QuizState, questions: readonly Question[]): boolean {
  return state.currentIndex >= questions.length
}

/** Mencatat jawaban untuk soal aktif. Jawaban ganda atau untuk soal lain diabaikan. */
export function answerQuestion(
  state: QuizState,
  questions: readonly Question[],
  questionId: string,
  answer: AnswerKey,
): QuizState {
  const current = questions[state.currentIndex]
  if (!current || current.id !== questionId) return state
  if (state.answers[questionId] !== undefined) return state
  return { ...state, answers: { ...state.answers, [questionId]: answer } }
}

/** Lanjut ke soal berikutnya; hanya bila soal aktif sudah dijawab. */
export function advanceQuestion(state: QuizState, questions: readonly Question[]): QuizState {
  const current = questions[state.currentIndex]
  if (!current || state.answers[current.id] === undefined) return state
  return { ...state, currentIndex: state.currentIndex + 1 }
}
