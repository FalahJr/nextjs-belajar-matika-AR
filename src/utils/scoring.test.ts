import { describe, expect, it } from 'vitest'
import { AR_CARDS } from '../data/arCards'
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions'
import { calculateScore, summarizeAnswers } from './scoring'
import { getCardById, getCardByTargetIndex, validateCards, validateQuestions } from './cards'
import type { AnswerKey } from '../types/quiz'

describe('calculateScore', () => {
  it('menghitung (benar / total) * 100 dan membulatkan', () => {
    expect(calculateScore(3, 3)).toBe(100)
    expect(calculateScore(2, 3)).toBe(67)
    expect(calculateScore(1, 3)).toBe(33)
    expect(calculateScore(0, 3)).toBe(0)
    expect(calculateScore(4, 5)).toBe(80)
  })

  it('aman untuk total 0', () => {
    expect(calculateScore(0, 0)).toBe(0)
  })
})

describe('summarizeAnswers', () => {
  it('menghitung hanya jawaban yang sesuai kunci', () => {
    const q = PRACTICE_QUESTIONS
    const answers: Record<string, AnswerKey> = {
      [q[0].id]: q[0].correctAnswer,
      [q[1].id]: q[1].correctAnswer === 'A' ? 'B' : 'A',
      [q[2].id]: q[2].correctAnswer,
    }
    expect(summarizeAnswers(q, answers)).toEqual({ correct: 2, total: 5, score: 40 })
  })
})

describe('data soal', () => {
  it('latihan biasa memiliki tepat 5 soal valid', () => {
    expect(validateQuestions(PRACTICE_QUESTIONS, 5)).toEqual([])
  })

  it('enam kartu AR valid: 3 soal A–D per kartu (total 18)', () => {
    expect(validateCards(AR_CARDS)).toEqual([])
    expect(AR_CARDS.flatMap((c) => c.questions)).toHaveLength(18)
  })

  it('targetIndex awal sesuai rencana 0–5', () => {
    const expected = [
      'pizza-pecahan-biasa',
      'susu-pecahan-campuran',
      'piring-buah-desimal',
      'jajanan-ubah-persen',
      'pizza-urut-campuran',
      'kue-operasi-hitung',
    ]
    expected.forEach((cardId, i) => expect(getCardByTargetIndex(i)?.cardId).toBe(cardId))
    expect(getCardByTargetIndex(6)).toBeUndefined()
    expect(getCardById('kue-operasi-hitung')?.targetIndex).toBe(5)
  })

  it('validator mendeteksi data rusak', () => {
    const bad = [{ ...PRACTICE_QUESTIONS[0], options: { A: 'x', B: 'x', C: 'y', D: 'z' } }]
    expect(validateQuestions(bad, 1).length).toBeGreaterThan(0)
    expect(validateQuestions(PRACTICE_QUESTIONS, 3).length).toBeGreaterThan(0)
  })
})
