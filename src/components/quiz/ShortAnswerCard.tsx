import { useId, useState, type FormEvent } from 'react'
import { CircleCheck, CircleX, Send } from 'lucide-react'
import type { PracticeShortQuestion } from '../../types/quiz'

type Props = {
  question: PracticeShortQuestion
  /** Jawaban yang sudah dikirim; `undefined` bila belum menjawab. */
  submitted: string | undefined
  isCorrect: boolean
  onSubmit: (answer: string) => void
}

/** Soal isian: murid mengetik jawaban, lalu menekan "Periksa Jawaban" (atau Enter). */
export function ShortAnswerCard({ question, submitted, isCorrect, onSubmit }: Props) {
  const inputId = useId()
  const hintId = useId()
  const [draft, setDraft] = useState('')
  const answered = submitted !== undefined
  const value = answered ? submitted : draft

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answered && draft.trim()) onSubmit(draft)
  }

  const fieldStyle = !answered
    ? 'border-indigo-200 bg-white text-indigo-950 focus:border-indigo-500'
    : isCorrect
      ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
      : 'border-rose-500 bg-rose-50 text-rose-950'

  return (
    <form onSubmit={handleSubmit}>
      {/* pre-line: soal bertahap (a., b.) tampil di baris terpisah sesuai penulisan di data. */}
      <h3 className="mb-4 whitespace-pre-line text-lg font-extrabold leading-snug text-indigo-950 sm:text-xl">
        {question.question}
      </h3>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-indigo-900">
        Jawabanmu
      </label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          value={value}
          readOnly={answered}
          onChange={(e) => setDraft(e.target.value)}
          aria-describedby={question.hint ? hintId : undefined}
          placeholder="Ketik jawabanmu di sini"
          className={`min-h-14 w-full min-w-0 rounded-2xl border-2 px-4 text-lg font-bold outline-none transition motion-reduce:transition-none ${fieldStyle}`}
        />
        {answered &&
          (isCorrect ? (
            <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-emerald-700">
              <CircleCheck className="size-5" aria-hidden="true" /> Benar
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-rose-700">
              <CircleX className="size-5" aria-hidden="true" /> Kurang tepat
            </span>
          ))}
      </div>
      {question.hint && (
        <p id={hintId} className="mt-1.5 text-sm font-medium text-slate-600">
          {question.hint}
        </p>
      )}
      {!answered && (
        <button
          type="submit"
          disabled={!draft.trim()}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-base font-extrabold text-white shadow-pop transition hover:bg-indigo-700 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
        >
          <Send className="size-5" aria-hidden="true" /> Periksa Jawaban
        </button>
      )}
    </form>
  )
}
