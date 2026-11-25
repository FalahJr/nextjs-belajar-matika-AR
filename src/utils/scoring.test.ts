import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { AR_CARDS } from '../config/arTargets'
import { calculateScore, summarizeAnswers } from './scoring'
import { validateCards, validateQuestions } from './cards'
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
    const q = AR_CARDS[0].questions
    const answers: Record<string, AnswerKey> = {
      [q[0].id]: q[0].correctAnswer,
      [q[1].id]: q[1].correctAnswer === 'A' ? 'B' : 'A',
      [q[2].id]: q[2].correctAnswer,
    }
    expect(summarizeAnswers(q, answers)).toEqual({ correct: 2, total: 3, score: 67 })
  })
})

describe('data soal', () => {
  it('enam kartu AR valid: 3 soal per kartu (total 18)', () => {
    expect(validateCards(AR_CARDS)).toEqual([])
    expect(AR_CARDS.flatMap((c) => c.questions)).toHaveLength(18)
  })

  it('soal bergambar Card 1: 3 opsi (A–C) dan file gambar ada', () => {
    const withImage = AR_CARDS.flatMap((c) => c.questions).filter((q) => q.image)
    expect(withImage.map((q) => q.id)).toEqual([
      'pizza-pecahan-biasa-1',
      'pizza-pecahan-biasa-2',
      'pizza-pecahan-biasa-3',
    ])
    for (const q of withImage) {
      expect(q.options.D).toBeUndefined()
      expect(existsSync(resolve('public', q.image!.src.slice(1))), q.image!.src).toBe(true)
    }
  })

  // Kecuali Card 5 soal 2: docx menulis kunci "2/3 = 1/2" (salah secara matematika), di sini dibuat C (2/3 > 1/2).
  it('kunci jawaban kuis kartu sesuai docx', () => {
    const keys = AR_CARDS.map((c) => c.questions.map((q) => q.correctAnswer).join(''))
    expect(keys).toEqual(['BCA', 'CAD', 'BCA', 'BCD', 'BCD', 'CCD'])
  })

  it('validator mendeteksi data rusak', () => {
    const good = AR_CARDS[0].questions
    const bad = [{ ...good[0], options: { A: 'x', B: 'x', C: 'y', D: 'z' } }]
    expect(validateQuestions(bad, 1).length).toBeGreaterThan(0)
    expect(validateQuestions(good, 5).length).toBeGreaterThan(0)
    const wrongKey = [{ ...good[0], correctAnswer: 'D' as const }]
    expect(validateQuestions(wrongKey, 1).length).toBeGreaterThan(0)
  })
})
