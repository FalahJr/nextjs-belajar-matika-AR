import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { CARD_LOOK } from '../data/cardLook'
import { MATERI } from '../data/materi'

export function MateriListPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="flex items-center gap-2 text-3xl font-black text-indigo-950">
          <BookOpen className="size-8 text-indigo-600" aria-hidden="true" /> Materi
        </h1>
        <p className="mt-1 font-medium text-indigo-800">
          Baca materinya dulu, lalu coba scan kartu AR atau kerjakan latihan soal.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {MATERI.map((m) => {
            const look = CARD_LOOK[m.cardId]
            return (
              <li key={m.slug}>
                <Link
                  to={`/materi/${m.slug}`}
                  className="group flex h-full items-center gap-4 rounded-3xl bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    className={`grid size-16 shrink-0 place-items-center rounded-2xl text-4xl ${look.bg}`}
                    aria-hidden="true"
                  >
                    {look.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-extrabold uppercase tracking-wide text-indigo-500">
                      Materi {m.number} · {m.pages} halaman
                    </span>
                    <span className="mt-0.5 block text-lg font-extrabold leading-tight text-indigo-950">{m.title}</span>
                    <span className="mt-1 block text-sm font-medium text-slate-700">{m.summary}</span>
                  </span>
                  <ChevronRight
                    className="size-6 shrink-0 text-indigo-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </PageShell>
  )
}
