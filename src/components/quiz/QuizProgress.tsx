type Props = {
  /** Nomor soal aktif, dimulai dari 1. */
  current: number
  total: number
}

export function QuizProgress({ current, total }: Props) {
  const percent = Math.round(((current - 1) / total) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-indigo-900">
        <span>
          Soal {current} dari {total}
        </span>
        <span className="text-indigo-600">{percent}% selesai</span>
      </div>
      <div
        role="progressbar"
        aria-label="Kemajuan kuis"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current - 1}
        className="h-3 overflow-hidden rounded-full bg-indigo-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
