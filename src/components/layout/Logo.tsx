import { Link } from 'react-router-dom'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="BelajarMatika AR — Beranda">
      <span
        className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-black text-amber-300 shadow-soft"
        aria-hidden="true"
      >
        ½
      </span>
      <span className={`text-lg font-black tracking-tight ${light ? 'text-white' : 'text-indigo-950'}`}>
        Belajar<span className={light ? 'text-amber-300' : 'text-rose-500'}>Matika</span> AR
      </span>
    </Link>
  )
}
