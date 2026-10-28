import { ArrowLeft, RotateCcw } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { QuizRunner } from '../components/quiz/QuizRunner'
import { Button, ButtonLink } from '../components/ui/ButtonLink'
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions'
import { useQuizSession } from '../hooks/useQuizSession'

export function PracticePage() {
  const { state, answer, next, restart } = useQuizSession(PRACTICE_QUESTIONS)

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-black text-indigo-950">Latihan Soal</h1>
        <p className="mt-1 font-medium text-indigo-800">
          Lima soal pilihan ganda tanpa kamera. Nilaimu tidak disimpan.
        </p>
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft sm:p-7">
          <QuizRunner
            questions={PRACTICE_QUESTIONS}
            state={state}
            onAnswer={answer}
            onNext={next}
            resultTitle="Hasil Latihan"
            resultActions={
              <>
                <Button variant="primary" onClick={restart}>
                  <RotateCcw className="size-5" aria-hidden="true" /> Ulangi Latihan
                </Button>
                <ButtonLink to="/" variant="secondary">
                  <ArrowLeft className="size-5" aria-hidden="true" /> Kembali ke Beranda
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>
    </PageShell>
  )
}
