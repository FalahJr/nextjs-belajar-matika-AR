import { ArrowLeft, RotateCcw, ScanLine } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ARCardConfig } from '../../types/ar'
import type { AnswerKey } from '../../types/quiz'
import type { QuizState } from '../../utils/quizState'
import { QuizRunner } from '../quiz/QuizRunner'
import { Button } from '../ui/ButtonLink'

type Props = {
  card: ARCardConfig | null
  state: QuizState
  /** Tampil bila target sedang hilang sementara; progres tetap dipertahankan. */
  targetLost?: boolean
  emptyHint: ReactNode
  onAnswer: (card: ARCardConfig, questionId: string, answer: AnswerKey) => void
  onNext: (card: ARCardConfig) => void
  onRestart: (card: ARCardConfig) => void
  onScanAnother: () => void
  onBack: () => void
  scanAnotherLabel?: string
}

/** Panel soal: elemen React biasa, terpisah total dari scene 3D. */
export function ARQuestionPanel({
  card,
  state,
  targetLost = false,
  emptyHint,
  onAnswer,
  onNext,
  onRestart,
  onScanAnother,
  onBack,
  scanAnotherLabel = 'Scan Kartu Lain',
}: Props) {
  if (!card) {
    return (
      <section aria-label="Panel soal" className="grid min-h-48 place-items-center rounded-3xl bg-white p-6 text-center shadow-soft">
        <div className="grid justify-items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full bg-indigo-100 text-indigo-600">
            <ScanLine className="size-7" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-extrabold text-indigo-950">Belum ada kartu</h2>
          <p className="max-w-xs font-medium text-slate-700">{emptyHint}</p>
        </div>
      </section>
    )
  }

  return (
    <section aria-label={`Soal kartu ${card.title}`} className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-500">Kartu terpilih</p>
          <h2 className="text-lg font-black leading-tight text-indigo-950">{card.title}</h2>
        </div>
      </header>
      {targetLost && (
        <p role="status" className="mb-3 rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">
          Kartu hilang sementara — jawabanmu tetap tersimpan.
        </p>
      )}
      <QuizRunner
        questions={card.questions}
        state={state}
        onAnswer={(qid, a) => onAnswer(card, qid, a)}
        onNext={() => onNext(card)}
        resultTitle={`Hasil: ${card.title}`}
        resultActions={
          <>
            <Button variant="primary" onClick={() => onRestart(card)}>
              <RotateCcw className="size-5" aria-hidden="true" /> Ulangi Kuis
            </Button>
            <Button variant="accent" onClick={onScanAnother}>
              <ScanLine className="size-5" aria-hidden="true" /> {scanAnotherLabel}
            </Button>
            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft className="size-5" aria-hidden="true" /> Kembali
            </Button>
          </>
        }
      />
    </section>
  )
}
