import { useCallback, useReducer } from 'react'
import type { PracticeQuestion } from '../types/quiz'
import {
  INITIAL_PRACTICE_STATE,
  advancePractice,
  answerPractice,
  type PracticeState,
} from '../utils/practice'

type Action =
  | { type: 'answer'; questions: readonly PracticeQuestion[]; questionId: string; answer: string }
  | { type: 'next'; questions: readonly PracticeQuestion[] }
  | { type: 'restart' }

function reducer(state: PracticeState, action: Action): PracticeState {
  switch (action.type) {
    case 'answer':
      return answerPractice(state, action.questions, action.questionId, action.answer)
    case 'next':
      return advancePractice(state, action.questions)
    case 'restart':
      return INITIAL_PRACTICE_STATE
  }
}

/** State Latihan Soal di web. */
export function usePracticeSession(questions: readonly PracticeQuestion[]) {
  const [state, dispatch] = useReducer(reducer, INITIAL_PRACTICE_STATE)
  const answer = useCallback(
    (questionId: string, a: string) => dispatch({ type: 'answer', questions, questionId, answer: a }),
    [questions],
  )
  const next = useCallback(() => dispatch({ type: 'next', questions }), [questions])
  const restart = useCallback(() => dispatch({ type: 'restart' }), [])
  return { state, answer, next, restart }
}
