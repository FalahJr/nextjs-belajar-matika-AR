import { useCallback, useReducer } from 'react'
import type { ARCardConfig } from '../types/ar'
import type { AnswerKey } from '../types/quiz'
import {
  INITIAL_QUIZ_STATE,
  advanceQuestion,
  answerQuestion,
  type QuizState,
} from '../utils/quizState'

type Sessions = Record<string, QuizState>

type Action =
  | { type: 'answer'; card: ARCardConfig; questionId: string; answer: AnswerKey }
  | { type: 'next'; card: ARCardConfig }
  | { type: 'restart'; cardId: string }

function reducer(sessions: Sessions, action: Action): Sessions {
  switch (action.type) {
    case 'answer': {
      const { card } = action
      const prev = sessions[card.cardId] ?? INITIAL_QUIZ_STATE
      const next = answerQuestion(prev, card.questions, action.questionId, action.answer)
      return next === prev ? sessions : { ...sessions, [card.cardId]: next }
    }
    case 'next': {
      const { card } = action
      const prev = sessions[card.cardId] ?? INITIAL_QUIZ_STATE
      const next = advanceQuestion(prev, card.questions)
      return next === prev ? sessions : { ...sessions, [card.cardId]: next }
    }
    case 'restart': {
      const { [action.cardId]: _removed, ...rest } = sessions
      return rest
    }
  }
}

/**
 * Sesi kuis terpisah per kartu (kunci = cardId). Berpindah kartu atau kehilangan target
 * tidak menghapus atau mencampur progres; hanya "Ulangi" yang mereset satu kartu.
 */
export function useCardSessions() {
  const [sessions, dispatch] = useReducer(reducer, {} as Sessions)

  const getState = useCallback(
    (cardId: string): QuizState => sessions[cardId] ?? INITIAL_QUIZ_STATE,
    [sessions],
  )
  const answer = useCallback(
    (card: ARCardConfig, questionId: string, a: AnswerKey) =>
      dispatch({ type: 'answer', card, questionId, answer: a }),
    [],
  )
  const next = useCallback((card: ARCardConfig) => dispatch({ type: 'next', card }), [])
  const restart = useCallback((cardId: string) => dispatch({ type: 'restart', cardId }), [])

  return { getState, answer, next, restart }
}
