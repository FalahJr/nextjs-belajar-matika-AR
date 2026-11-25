import { ArrowLeft, RotateCcw } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { PracticeRunner } from '../components/quiz/PracticeRunner'
import { Button, ButtonLink } from '../components/ui/ButtonLink'
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions'
import { usePracticeSession } from '../hooks/usePracticeSession'

export function PracticePage() {
  const { state, answer, next, restart } = usePracticeSession(PRACTICE_QUESTIONS)

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-black text-indigo-950">Latihan Soal</h1>
        <p className="mt-1 font-medium text-indigo-800">
          {PRACTICE_QUESTIONS.length} soal dalam tiga level, tanpa kamera. Nilaimu tidak disimpan.
        </p>
        <p className="mt-1 text-sm font-medium text-indigo-700">
          Menulis jawaban: pecahan dengan garis miring (3/4), pecahan campuran dengan spasi (2 1/3), desimal dengan
          koma (0,5).
        </p>
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft sm:p-7">
          <PracticeRunner
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
