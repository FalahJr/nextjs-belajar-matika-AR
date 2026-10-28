import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ScanLine, X } from 'lucide-react'
import { buttonClass } from '../ui/buttonClass'
import { Logo } from './Logo'

const LINKS = [
  { to: '/#cara-belajar', label: 'Cara Belajar' },
  { to: '/#materi', label: 'Materi' },
  { to: '/#tentang', label: 'Tentang' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100 bg-white/90 backdrop-blur">
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-xl px-3 py-2 font-bold text-indigo-900 hover:bg-indigo-50">
              {l.label}
            </Link>
          ))}
          <NavLink
            to="/latihan"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 font-bold hover:bg-indigo-50 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-900'}`
            }
          >
            Latihan Soal
          </NavLink>
          <Link to="/scan" className={buttonClass('accent', 'ml-2 min-h-11 py-2')}>
            <ScanLine className="size-5" aria-hidden="true" /> Scan AR
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl text-indigo-900 hover:bg-indigo-50 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-indigo-100 bg-white px-4 pb-4 md:hidden">
          <ul className="grid gap-1 py-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close} className="block rounded-xl px-3 py-3 font-bold text-indigo-900 hover:bg-indigo-50">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/latihan" onClick={close} className="block rounded-xl px-3 py-3 font-bold text-indigo-900 hover:bg-indigo-50">
                Latihan Soal
              </Link>
            </li>
          </ul>
          <Link to="/scan" onClick={close} className={buttonClass('accent', 'w-full')}>
            <ScanLine className="size-5" aria-hidden="true" /> Mulai Scan AR
          </Link>
        </div>
      )}
    </header>
  )
}
