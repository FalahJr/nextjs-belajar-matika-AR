import { useCallback, useReducer } from 'react'
import type { AnswerKey, Question } from '../types/quiz'
import {
  INITIAL_QUIZ_STATE,
  advanceQuestion,
  answerQuestion,
  type QuizState,
} from '../utils/quizState'

type Action =
  | { type: 'answer'; questions: readonly Question[]; questionId: string; answer: AnswerKey }
  | { type: 'next'; questions: readonly Question[] }
  | { type: 'restart' }

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'answer':
      return answerQuestion(state, action.questions, action.questionId, action.answer)
    case 'next':
      return advanceQuestion(state, action.questions)
    case 'restart':
      return INITIAL_QUIZ_STATE
  }
}

/** State kuis tunggal (dipakai latihan biasa). */
export function useQuizSession(questions: readonly Question[]) {
  const [state, dispatch] = useReducer(reducer, INITIAL_QUIZ_STATE)
  const answer = useCallback(
    (questionId: string, a: AnswerKey) => dispatch({ type: 'answer', questions, questionId, answer: a }),
    [questions],
  )
  const next = useCallback(() => dispatch({ type: 'next', questions }), [questions])
  const restart = useCallback(() => dispatch({ type: 'restart' }), [])
  return { state, answer, next, restart }
}
