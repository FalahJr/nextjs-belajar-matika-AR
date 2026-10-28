import { describe, expect, it } from 'vitest'
import { PRACTICE_QUESTIONS as Q } from '../data/practiceQuestions'
import { summarizeAnswers } from './scoring'
import { INITIAL_QUIZ_STATE, advanceQuestion, answerQuestion, isFinished } from './quizState'

describe('quizState', () => {
  it('tidak menghitung jawaban ganda untuk soal yang sama', () => {
    let s = answerQuestion(INITIAL_QUIZ_STATE, Q, Q[0].id, Q[0].correctAnswer)
    s = answerQuestion(s, Q, Q[0].id, Q[0].correctAnswer === 'A' ? 'B' : 'A')
    expect(s.answers[Q[0].id]).toBe(Q[0].correctAnswer)
    expect(Object.keys(s.answers)).toHaveLength(1)
  })

  it('mengabaikan jawaban untuk soal yang bukan soal aktif', () => {
    const s = answerQuestion(INITIAL_QUIZ_STATE, Q, Q[2].id, 'A')
    expect(s).toBe(INITIAL_QUIZ_STATE)
  })

  it('tidak bisa lanjut sebelum soal dijawab', () => {
    expect(advanceQuestion(INITIAL_QUIZ_STATE, Q)).toBe(INITIAL_QUIZ_STATE)
  })

  it('menyelesaikan seluruh soal dan menghitung nilai', () => {
    let s = INITIAL_QUIZ_STATE
    Q.forEach((q, i) => {
      expect(isFinished(s, Q)).toBe(false)
      // jawab benar untuk 4 soal pertama, salah untuk soal terakhir
      const wrong = q.correctAnswer === 'A' ? 'B' : 'A'
      s = answerQuestion(s, Q, q.id, i < 4 ? q.correctAnswer : wrong)
      s = advanceQuestion(s, Q)
    })
    expect(isFinished(s, Q)).toBe(true)
    expect(summarizeAnswers(Q, s.answers)).toEqual({ correct: 4, total: 5, score: 80 })
  })
})
