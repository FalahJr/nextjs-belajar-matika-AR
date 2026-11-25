import type { NumberAnswerForm, PracticeShortQuestion } from '../types/quiz'

type Rational = { n: number; d: number }
type NumberKind = 'integer' | 'decimal' | 'fraction' | 'mixed'
type NumberToken = { kind: NumberKind; value: Rational }

/** Urutan alternatif penting: campuran (5 3/4), pecahan (3/4), lalu bilangan biasa/desimal (0,25 atau 0.25). */
const NUMBER_PATTERN = /(\d+)\s+(\d+)\s*\/\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+)(?:[.,](\d+))?/g

/** Mengambil semua bilangan dari teks, berurutan. Huruf, satuan, dan tanda baca lain diabaikan. */
export function parseNumbers(text: string): NumberToken[] {
  const tokens: NumberToken[] = []
  for (const m of text.matchAll(NUMBER_PATTERN)) {
    if (m[1] !== undefined) {
      const whole = Number(m[1])
      const num = Number(m[2])
      const den = Number(m[3])
      if (den > 0) tokens.push({ kind: 'mixed', value: { n: whole * den + num, d: den } })
    } else if (m[4] !== undefined) {
      const den = Number(m[5])
      if (den > 0) tokens.push({ kind: 'fraction', value: { n: Number(m[4]), d: den } })
    } else if (m[7] !== undefined) {
      tokens.push({ kind: 'decimal', value: { n: Number(`${m[6]}${m[7]}`), d: 10 ** m[7].length } })
    } else {
      tokens.push({ kind: 'integer', value: { n: Number(m[6]), d: 1 } })
    }
  }
  return tokens
}

const equalValue = (a: Rational, b: Rational) => a.n * b.d === b.n * a.d

/** Huruf kecil, tanda baca menjadi spasi, spasi ganda dirapikan ("ke-2" menjadi "ke 2"). */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/** Cocok per kata utuh, jadi "sama" tidak ikut cocok pada "sama-sama" yang berbeda arti. */
function hasPhrase(normalized: string, phrase: string): boolean {
  return ` ${normalized} `.includes(` ${normalizeText(phrase)} `)
}

function formMatches(form: NumberAnswerForm | undefined, kind: NumberKind): boolean {
  return form === undefined || form === kind
}

function matchesNumbers(input: string, specs: NonNullable<PracticeShortQuestion['accept']['numbers']>): boolean {
  const typed = parseNumbers(input)
  if (typed.length !== specs.length) return false
  return specs.every((spec, i) => {
    const expected = parseNumbers(spec.value)[0]
    return expected !== undefined && formMatches(spec.form, typed[i].kind) && equalValue(typed[i].value, expected.value)
  })
}

/** Memeriksa jawaban ketikan murid terhadap aturan `accept` pada soal isian. */
export function isShortAnswerCorrect(question: PracticeShortQuestion, input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  const { numbers, keywords, reject } = question.accept
  const normalized = normalizeText(trimmed)
  if (reject?.some((phrase) => hasPhrase(normalized, phrase))) return false
  if (numbers && matchesNumbers(trimmed, numbers)) return true
  return keywords?.some((group) => group.every((word) => hasPhrase(normalized, word))) ?? false
}
