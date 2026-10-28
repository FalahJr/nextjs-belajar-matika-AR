export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white shadow-pop hover:bg-indigo-700',
  secondary: 'bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50',
  accent: 'bg-amber-400 text-amber-950 shadow-pop hover:bg-amber-300',
  ghost: 'bg-transparent text-indigo-700 hover:bg-indigo-100',
  danger: 'bg-rose-500 text-white shadow-pop hover:bg-rose-600',
}

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-base font-extrabold transition active:translate-y-0.5 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60'

export function buttonClass(variant: ButtonVariant = 'primary', extra = '') {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim()
}
