import type { AnswerKey, Question, QuizScore } from '../types/quiz'

/** nilai = (jumlahJawabanBenar / jumlahSoal) * 100, dibulatkan ke bilangan bulat terdekat. */
export function calculateScore(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

/** Menghitung hasil dari jawaban per ID soal. Soal yang belum dijawab dihitung salah. */
export function summarizeAnswers(
  questions: readonly Question[],
  answers: Readonly<Record<string, AnswerKey>>,
): QuizScore {
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length
  return { correct, total: questions.length, score: calculateScore(correct, questions.length) }
}
