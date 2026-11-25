import type { ReactNode } from 'react'
import type { AnswerKey, Question } from '../../types/quiz'
import { isFinished, type QuizState } from '../../utils/quizState'
import { summarizeAnswers } from '../../utils/scoring'
import { AnswerFeedback } from './AnswerFeedback'
import { QuestionCard } from './QuestionCard'
import { QuizProgress } from './QuizProgress'
import { QuizResult } from './QuizResult'

type Props = {
  questions: readonly Question[]
  state: QuizState
  onAnswer: (questionId: string, answer: AnswerKey) => void
  onNext: () => void
  resultTitle?: string
  /** Tombol aksi di layar hasil (ulangi, scan kartu lain, kembali, ...). */
  resultActions: ReactNode
}

/**
 * Alur kuis pilihan ganda untuk panel AR (Latihan Soal punya alur sendiri: PracticeRunner).
 * Komponen ini sepenuhnya dikontrol dari luar (state dimiliki oleh hook sesi).
 */
export function QuizRunner({ questions, state, onAnswer, onNext, resultTitle, resultActions }: Props) {
  if (isFinished(state, questions)) {
    return (
      <QuizResult
        result={summarizeAnswers(questions, state.answers)}
        title={resultTitle}
        actions={resultActions}
      />
    )
  }

  const question = questions[state.currentIndex]
  const selected = state.answers[question.id]
  const isLast = state.currentIndex === questions.length - 1
  const isCorrect = selected !== undefined && selected === question.correctAnswer

  return (
    <div className="grid gap-4">
      <QuizProgress current={state.currentIndex + 1} total={questions.length} />
      {/* key memicu animasi singkat saat soal berganti, tanpa menyentuh scene AR. */}
      <div key={question.id} className="animate-fade-up">
        <QuestionCard
          question={question}
          selected={selected}
          onSelect={(a) => onAnswer(question.id, a)}
        />
      </div>

      {selected !== undefined && (
        <AnswerFeedback
          isCorrect={isCorrect}
          correctLabel={question.correctAnswer}
          explanation={question.explanation}
          isLast={isLast}
          onNext={onNext}
        />
      )}
    </div>
  )
}
