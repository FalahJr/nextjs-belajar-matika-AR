export type AnswerKey = 'A' | 'B' | 'C' | 'D'

export const ANSWER_KEYS: readonly AnswerKey[] = ['A', 'B', 'C', 'D']

export type Question = {
  id: string
  question: string
  options: Record<AnswerKey, string>
  correctAnswer: AnswerKey
  explanation?: string
}

export type QuizScore = {
  correct: number
  total: number
  /** Nilai 0–100, dibulatkan ke bilangan bulat terdekat. */
  score: number
}
