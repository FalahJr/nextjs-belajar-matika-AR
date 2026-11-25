import type { ReactNode } from 'react'
import { PRACTICE_LEVEL_INFO } from '../../data/practiceQuestions'
import type { AnswerKey, PracticeQuestion } from '../../types/quiz'
import {
  correctAnswerLabel,
  isPracticeCorrect,
  isPracticeFinished,
  summarizePractice,
  type PracticeState,
} from '../../utils/practice'
import { AnswerFeedback } from './AnswerFeedback'
import { QuestionCard } from './QuestionCard'
import { QuizProgress } from './QuizProgress'
import { QuizResult } from './QuizResult'
import { ShortAnswerCard } from './ShortAnswerCard'

type Props = {
  questions: readonly PracticeQuestion[]
  state: PracticeState
  onAnswer: (questionId: string, answer: string) => void
  onNext: () => void
  resultTitle?: string
  resultActions: ReactNode
}

/** Alur Latihan Soal: soal isian (Level 1) dan pilihan ganda (Level 2–3) dalam satu urutan. */
export function PracticeRunner({ questions, state, onAnswer, onNext, resultTitle, resultActions }: Props) {
  if (isPracticeFinished(state, questions)) {
    return (
      <QuizResult
        result={summarizePractice(questions, state.answers)}
        title={resultTitle}
        actions={resultActions}
      />
    )
  }

  const question = questions[state.currentIndex]
  const answer = state.answers[question.id]
  const isLast = state.currentIndex === questions.length - 1
  const level = PRACTICE_LEVEL_INFO[question.level]

  return (
    <div className="grid gap-4">
      <QuizProgress current={state.currentIndex + 1} total={questions.length} />
      <div key={question.id} className="animate-fade-up">
        <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-indigo-700">
            Level {level.number} · {question.level}
          </span>
          <span className="text-sm font-bold text-indigo-900">{question.title ?? level.label}</span>
        </p>
        {question.kind === 'choice' ? (
          <QuestionCard
            question={question}
            selected={answer as AnswerKey | undefined}
            onSelect={(a) => onAnswer(question.id, a)}
          />
        ) : (
          <ShortAnswerCard
            question={question}
            submitted={answer}
            isCorrect={isPracticeCorrect(question, answer)}
            onSubmit={(text) => onAnswer(question.id, text)}
          />
        )}
      </div>

      {answer !== undefined && (
        <AnswerFeedback
          isCorrect={isPracticeCorrect(question, answer)}
          correctLabel={correctAnswerLabel(question)}
          explanation={question.explanation}
          isLast={isLast}
          onNext={onNext}
        />
      )}
    </div>
  )
}
