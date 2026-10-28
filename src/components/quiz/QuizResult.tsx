import type { ReactNode } from 'react'
import { PartyPopper, Star, ThumbsUp } from 'lucide-react'
import type { QuizScore } from '../../types/quiz'

type Props = {
  result: QuizScore
  title?: string
  /** Tombol aksi (ulangi, kembali, dll.) disediakan oleh halaman pemanggil. */
  actions: ReactNode
}

function message(score: number): { text: string; icon: ReactNode } {
  if (score === 100)
    return { text: 'Luar biasa! Semua jawabanmu benar!', icon: <PartyPopper className="size-7" aria-hidden="true" /> }
  if (score >= 60)
    return { text: 'Hebat! Sedikit lagi sempurna.', icon: <Star className="size-7" aria-hidden="true" /> }
  return { text: 'Tidak apa-apa, ayo coba lagi dan belajar lebih seru!', icon: <ThumbsUp className="size-7" aria-hidden="true" /> }
}

export function QuizResult({ result, title = 'Hasil Kuis', actions }: Props) {
  const { text, icon } = message(result.score)
  return (
    <section aria-labelledby="quiz-result-title" className="animate-pop text-center">
      <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-amber-300 text-amber-900">
        {icon}
      </div>
      <h3 id="quiz-result-title" className="text-xl font-extrabold text-indigo-950">
        {title}
      </h3>
      <p className="mt-1 font-semibold text-indigo-800">{text}</p>

      <dl className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-emerald-100 p-3">
          <dt className="text-xs font-bold text-emerald-800">Jawaban benar</dt>
          <dd className="text-2xl font-extrabold text-emerald-900">{result.correct}</dd>
        </div>
        <div className="rounded-2xl bg-sky-100 p-3">
          <dt className="text-xs font-bold text-sky-800">Total soal</dt>
          <dd className="text-2xl font-extrabold text-sky-900">{result.total}</dd>
        </div>
        <div className="rounded-2xl bg-violet-100 p-3">
          <dt className="text-xs font-bold text-violet-800">Nilai</dt>
          <dd className="text-2xl font-extrabold text-violet-900">{result.score}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">{actions}</div>
    </section>
  )
}
