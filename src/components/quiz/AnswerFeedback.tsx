import { ArrowRight, CircleCheck, CircleX, Trophy } from 'lucide-react'

type Props = {
  isCorrect: boolean
  /** Kunci jawaban yang ditampilkan bila murid salah. */
  correctLabel: string
  explanation?: string
  isLast: boolean
  onNext: () => void
}

/** Kotak umpan balik setelah murid menjawab: benar/salah, pembahasan, dan tombol lanjut. */
export function AnswerFeedback({ isCorrect, correctLabel, explanation, isLast, onNext }: Props) {
  return (
    <div
      role="status"
      className={`animate-pop rounded-2xl border-2 p-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
    >
      <p
        className={`flex items-center gap-2 text-base font-extrabold ${isCorrect ? 'text-emerald-800' : 'text-amber-900'}`}
      >
        {isCorrect ? (
          <CircleCheck className="size-6 shrink-0" aria-hidden="true" />
        ) : (
          <CircleX className="size-6 shrink-0" aria-hidden="true" />
        )}
        <span className="min-w-0 break-words">
          {isCorrect
            ? 'Hebat! Jawabanmu benar.'
            : `Belum tepat, tidak apa-apa! Jawaban yang benar: ${correctLabel}.`}
        </span>
      </p>
      {explanation && <p className="mt-1.5 text-sm font-medium text-slate-800">{explanation}</p>}
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
  )
}
