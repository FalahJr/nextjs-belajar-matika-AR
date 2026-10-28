import { AR_CARDS } from '../data/arCards'
import type { ARCardConfig } from '../types/ar'
import { ANSWER_KEYS, type Question } from '../types/quiz'

export function getCardByTargetIndex(
  targetIndex: number,
  cards: readonly ARCardConfig[] = AR_CARDS,
): ARCardConfig | undefined {
  return cards.find((c) => c.targetIndex === targetIndex)
}

export function getCardById(
  cardId: string,
  cards: readonly ARCardConfig[] = AR_CARDS,
): ARCardConfig | undefined {
  return cards.find((c) => c.cardId === cardId)
}

/** Mengembalikan daftar masalah pada set soal (kosong = valid). */
export function validateQuestions(questions: readonly Question[], expectedCount: number): string[] {
  const problems: string[] = []
  if (questions.length !== expectedCount) {
    problems.push(`Jumlah soal ${questions.length}, seharusnya ${expectedCount}`)
  }
  for (const q of questions) {
    if (!q.question.trim()) problems.push(`${q.id}: teks soal kosong`)
    for (const key of ANSWER_KEYS) {
      if (!q.options[key]?.trim()) problems.push(`${q.id}: opsi ${key} kosong`)
    }
    if (Object.keys(q.options).length !== ANSWER_KEYS.length) {
      problems.push(`${q.id}: opsi harus tepat A–D`)
    }
    if (!ANSWER_KEYS.includes(q.correctAnswer)) problems.push(`${q.id}: kunci jawaban tidak valid`)
    const values = ANSWER_KEYS.map((k) => q.options[k]?.trim())
    if (new Set(values).size !== values.length) problems.push(`${q.id}: ada opsi yang sama`)
  }
  const ids = questions.map((q) => q.id)
  if (new Set(ids).size !== ids.length) problems.push('ID soal tidak unik')
  return problems
}

/** Mengembalikan daftar masalah pada konfigurasi kartu AR (kosong = valid). */
export function validateCards(cards: readonly ARCardConfig[], questionsPerCard = 3): string[] {
  const problems: string[] = []
  if (cards.length !== 6) problems.push(`Jumlah kartu ${cards.length}, seharusnya 6`)
  const ids = cards.map((c) => c.cardId)
  if (new Set(ids).size !== ids.length) problems.push('cardId tidak unik')
  const targets = cards.map((c) => c.targetIndex)
  if (new Set(targets).size !== targets.length) problems.push('targetIndex tidak unik')
  for (const c of cards) {
    if (!c.modelUrl.endsWith(`/${c.cardId}.glb`)) problems.push(`${c.cardId}: modelUrl tidak sesuai`)
    problems.push(...validateQuestions(c.questions, questionsPerCard).map((p) => `${c.cardId}: ${p}`))
  }
  const allIds = cards.flatMap((c) => c.questions.map((q) => q.id))
  if (new Set(allIds).size !== allIds.length) problems.push('ID soal antar-kartu tidak unik')
  return problems
}
