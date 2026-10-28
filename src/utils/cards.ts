import { AR_CARDS } from '../config/arTargets'
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
  const targets = cards.flatMap((c) => (c.targetIndex === null ? [] : [c.targetIndex]))
  if (new Set(targets).size !== targets.length) problems.push('targetIndex tidak unik')
  for (const c of cards) {
    if (!c.plannedModelPath.endsWith(`/${c.cardId}.glb`)) problems.push(`${c.cardId}: path model tidak sesuai`)
    if ((c.modelStatus === 'available') !== (c.modelPath !== null)) problems.push(`${c.cardId}: status model tidak konsisten`)
    problems.push(...validateQuestions(c.questions, questionsPerCard).map((p) => `${c.cardId}: ${p}`))
  }
  const allIds = cards.flatMap((c) => c.questions.map((q) => q.id))
  if (new Set(allIds).size !== allIds.length) problems.push('ID soal antar-kartu tidak unik')
  return problems
}

/**
 * Status file .mind aktif:
 * - `ready`    file ada dan berformat MindAR (v2)
 * - `missing`  file belum ada
 * - `invalid`  file ada tetapi bukan .mind yang valid
 * - `mismatch` catatan kompilasi tidak cocok dengan pemetaan di konfigurasi (perlu compile ulang / perbaiki config)
 */
export type MindState = 'checking' | 'ready' | 'missing' | 'invalid' | 'mismatch'

export type CardReadiness = 'checking' | 'ready' | 'target-missing' | 'model-missing' | 'mind-unavailable'

/**
 * Kesiapan AR satu kartu:
 * - `model-missing`    model GLB belum tersedia (tracking tetap bisa jalan bila targetnya ada, dengan penanda kotak)
 * - `target-missing`   model ada, tetapi kartu belum punya target di file .mind aktif
 * - `mind-unavailable` model & pemetaan ada, tetapi file .mind belum tersedia / tidak valid / tidak cocok
 * - `ready`            model, target, dan file .mind siap
 */
export function getCardReadiness(card: ARCardConfig, mind: MindState): CardReadiness {
  if (card.modelPath === null) return 'model-missing'
  if (card.targetIndex === null) return 'target-missing'
  if (mind === 'checking') return 'checking'
  return mind === 'ready' ? 'ready' : 'mind-unavailable'
}
