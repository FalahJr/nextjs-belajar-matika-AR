import type { ReactNode } from 'react'
import { ArrowRight, CircleCheck, CircleX, Trophy } from 'lucide-react'
import type { AnswerKey, Question } from '../../types/quiz'
import { isFinished, type QuizState } from '../../utils/quizState'
import { summarizeAnswers } from '../../utils/scoring'
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
 * Alur kuis yang dipakai bersama oleh panel AR dan latihan biasa.
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
        <div
          role="status"
          className={`animate-pop rounded-2xl border-2 p-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
        >
          <p
            className={`flex items-center gap-2 text-base font-extrabold ${isCorrect ? 'text-emerald-800' : 'text-amber-900'}`}
          >
            {isCorrect ? (
              <CircleCheck className="size-6" aria-hidden="true" />
            ) : (
              <CircleX className="size-6" aria-hidden="true" />
            )}
            {isCorrect
              ? 'Hebat! Jawabanmu benar.'
              : `Belum tepat, tidak apa-apa! Jawaban yang benar: ${question.correctAnswer}.`}
          </p>
          {question.explanation && (
            <p className="mt-1.5 text-sm font-medium text-slate-800">{question.explanation}</p>
          )}
          <button
            type="button"
            onClick={onNext}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-base font-extrabold text-white shadow-pop transition hover:bg-indigo-700 active:translate-y-0.5 sm:w-auto"
          >
            {isLast ? (
              <>
                <Trophy className="size-5" aria-hidden="true" /> Lihat Hasil
              </>
            ) : (
              <>
                Soal Berikutnya <ArrowRight className="size-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
