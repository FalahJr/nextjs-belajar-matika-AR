import { describe, expect, it } from 'vitest'
import { PRACTICE_QUESTIONS as Q } from '../data/practiceQuestions'
import type { PracticeShortQuestion } from '../types/quiz'
import {
  INITIAL_PRACTICE_STATE,
  advancePractice,
  answerPractice,
  isPracticeCorrect,
  isPracticeFinished,
  summarizePractice,
  validatePracticeQuestions,
} from './practice'
import { isShortAnswerCorrect, parseNumbers } from './shortAnswer'

const short = (id: string) => {
  const q = Q.find((x) => x.id === id)
  if (!q || q.kind !== 'short') throw new Error(`soal isian ${id} tidak ditemukan`)
  return q satisfies PracticeShortQuestion
}

describe('data latihan soal', () => {
  it('valid: 29 soal, Level 1 isian (10), Level 2 (9) dan Level 3 (10) pilihan ganda', () => {
    expect(validatePracticeQuestions(Q)).toEqual([])
    expect(Q).toHaveLength(29)
    expect(Q.filter((q) => q.level === 'LOTS' && q.kind === 'short')).toHaveLength(10)
    expect(Q.filter((q) => q.level === 'MOTS' && q.kind === 'choice')).toHaveLength(9)
    expect(Q.filter((q) => q.level === 'HOTS' && q.kind === 'choice')).toHaveLength(10)
  })

  it('kunci pilihan ganda sesuai docx', () => {
    const keys = Q.flatMap((q) => (q.kind === 'choice' ? [q.correctAnswer] : [])).join('')
    // Level 2: a c b c b c a b c — Level 3: B A B B B C A C A A
    expect(keys).toBe('ACBCBCABC' + 'BABBBCACAA')
  })

  it('validator mendeteksi data rusak', () => {
    const noRule = { ...short('latihan-1-1'), accept: {} }
    expect(validatePracticeQuestions([noRule]).length).toBeGreaterThan(0)
    expect(validatePracticeQuestions([Q[0], Q[0]]).length).toBeGreaterThan(0)
  })
})

describe('parseNumbers', () => {
  it('membaca pecahan, campuran, desimal (koma/titik), dan bilangan bulat', () => {
    expect(parseNumbers('5 3/4 kg').map((t) => t.kind)).toEqual(['mixed'])
    expect(parseNumbers('3/4').map((t) => t.kind)).toEqual(['fraction'])
    expect(parseNumbers('0,25 dan 0.5').map((t) => t.kind)).toEqual(['decimal', 'decimal'])
    expect(parseNumbers('40%').map((t) => t.kind)).toEqual(['integer'])
    expect(parseNumbers('tidak ada angka')).toEqual([])
  })

  it('mengabaikan penyebut nol', () => {
    expect(parseNumbers('3/0')).toEqual([])
  })
})

describe('isShortAnswerCorrect (Level 1)', () => {
  const cases: [id: string, right: string[], wrong: string[]][] = [
    ['latihan-1-1', ['1/8', ' 1 / 8 ', '1/8 bagian', '2/16'], ['0,125', '8/1', '1/7', '']],
    [
      'latihan-1-2',
      ['Salah', 'Pendapat Putu salah', 'tidak benar', 'Bagian Putu dan Karel sama banyak'],
      ['Putu benar', 'benar', 'tidak sama banyak', 'Putu tidak salah', ''],
    ],
    ['latihan-1-3', ['5/8', '5/8 bagian', '10/16'], ['5/16', '3/8', '0']],
    ['latihan-1-4', ['5 3/4', '5  3/4 donat'], ['23/4', '5,75', '5 1/4', '3/4']],
    ['latihan-1-5', ['3 1/2', '3 1/2 m', 'lompatan kedua', 'Kedua', 'ke-2', '7/2'], ['2 7/8', 'ketiga', 'lompatan ketiga']],
    ['latihan-1-6', ['3 3/4', '3 3/4 kg', '15/4', '3,75'], ['3 1/4', '4', '3 3/8']],
    [
      'latihan-1-7',
      ['0,3 dan 0,25', 'a. 0,3  b. 0,25', '0.3 0.25', '0,30; 0,250'],
      ['0,3', '0,25', '3/10 dan 25/100', '0,25 dan 0,3', '0,3 dan 0,25 dan 1'],
    ],
    ['latihan-1-8', ['0,75', '0,75 kg', '0.75', '3/4'], ['0,7', '75', '0,5']],
    ['latihan-1-9', ['2,75', '2,75 kg', '2.75', '2 3/4'], ['2,7', '3,75', '275']],
    ['latihan-1-10', ['40', '40%', '40 %', '40 siswa'], ['4', '40/100 siswa 4', '0,4', '400']],
  ]

  it.each(cases)('%s', (id, right, wrong) => {
    const q = short(id)
    for (const input of right) expect(isShortAnswerCorrect(q, input), `benar: "${input}"`).toBe(true)
    for (const input of wrong) expect(isShortAnswerCorrect(q, input), `salah: "${input}"`).toBe(false)
  })
})

describe('sesi latihan', () => {
  it('menolak jawaban kosong, ganda, dan untuk soal yang bukan soal aktif', () => {
    expect(answerPractice(INITIAL_PRACTICE_STATE, Q, Q[0].id, '   ')).toBe(INITIAL_PRACTICE_STATE)
    expect(answerPractice(INITIAL_PRACTICE_STATE, Q, Q[5].id, '1/8')).toBe(INITIAL_PRACTICE_STATE)
    const s = answerPractice(INITIAL_PRACTICE_STATE, Q, Q[0].id, '1/8')
    expect(answerPractice(s, Q, Q[0].id, '9/9')).toBe(s)
    expect(s.answers[Q[0].id]).toBe('1/8')
  })

  it('tidak bisa lanjut sebelum soal dijawab', () => {
    expect(advancePractice(INITIAL_PRACTICE_STATE, Q)).toBe(INITIAL_PRACTICE_STATE)
  })

  it('menyelesaikan 29 soal dan menghitung nilai (campuran isian dan pilihan ganda)', () => {
    let s = INITIAL_PRACTICE_STATE
    Q.forEach((q, i) => {
      expect(isPracticeFinished(s, Q)).toBe(false)
      const right = q.kind === 'choice' ? q.correctAnswer : q.answer
      const wrong = q.kind === 'choice' ? (q.correctAnswer === 'A' ? 'B' : 'A') : 'jawaban ngawur'
      s = answerPractice(s, Q, q.id, i < 20 ? right : wrong)
      s = advancePractice(s, Q)
    })
    expect(isPracticeFinished(s, Q)).toBe(true)
    // Soal isian dijawab dengan teks kunci apa adanya, jadi kunci berbentuk kalimat/gabungan harus ikut lolos.
    expect(summarizePractice(Q, s.answers)).toEqual({ correct: 20, total: 29, score: 69 })
  })

  it('kunci jawaban yang tampil (answer) selalu diterima pemeriksa', () => {
    for (const q of Q.filter((x) => x.kind === 'short')) {
      expect(isPracticeCorrect(q, q.answer), q.id).toBe(true)
    }
  })

  it('soal belum dijawab dihitung salah', () => {
    expect(summarizePractice(Q, {})).toEqual({ correct: 0, total: 29, score: 0 })
  })
})
