import { CircleCheck, CircleX } from 'lucide-react'
import type { AnswerKey } from '../../types/quiz'

export type AnswerOptionState = 'idle' | 'correct' | 'wrong' | 'reveal' | 'dimmed'

type Props = {
  answerKey: AnswerKey
  text: string
  state: AnswerOptionState
  disabled: boolean
  onSelect: (key: AnswerKey) => void
}

const STYLES: Record<AnswerOptionState, string> = {
  idle: 'border-indigo-200 bg-white text-indigo-950 hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98]',
  correct: 'border-emerald-500 bg-emerald-50 text-emerald-950',
  wrong: 'border-rose-500 bg-rose-50 text-rose-950',
  reveal: 'border-emerald-500 border-dashed bg-emerald-50/60 text-emerald-950',
  dimmed: 'border-slate-200 bg-slate-50 text-slate-500',
}

const BADGE: Record<AnswerOptionState, string> = {
  idle: 'bg-indigo-100 text-indigo-700',
  correct: 'bg-emerald-500 text-white',
  wrong: 'bg-rose-500 text-white',
  reveal: 'bg-emerald-200 text-emerald-800',
  dimmed: 'bg-slate-200 text-slate-500',
}

/** Status benar/salah selalu disertai ikon dan teks, tidak hanya warna. */
export function AnswerOption({ answerKey, text, state, disabled, onSelect }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(answerKey)}
      aria-pressed={state === 'correct' || state === 'wrong'}
      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left text-base font-semibold transition motion-reduce:transition-none ${STYLES[state]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl text-lg font-extrabold ${BADGE[state]}`}
        aria-hidden="true"
      >
        {answerKey}
      </span>
      <span className="min-w-0 flex-1 break-words">
        <span className="sr-only">Pilihan {answerKey}: </span>
        {text}
      </span>
      {state === 'correct' && (
        <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-emerald-700">
          <CircleCheck className="size-5" aria-hidden="true" /> Benar
        </span>
      )}
      {state === 'wrong' && (
        <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-rose-700">
          <CircleX className="size-5" aria-hidden="true" /> Kurang tepat
        </span>
      )}
      {state === 'reveal' && (
        <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold text-emerald-700">
          <CircleCheck className="size-5" aria-hidden="true" /> Jawaban benar
        </span>
      )}
    </button>
  )
}
