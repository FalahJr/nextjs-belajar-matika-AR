import { AR_CARDS } from '../../data/arCards'

const LOOK: Record<string, { emoji: string; bg: string }> = {
  'pizza-pecahan-biasa': { emoji: '🍕', bg: 'bg-rose-100' },
  'susu-pecahan-campuran': { emoji: '🥛', bg: 'bg-sky-100' },
  'piring-buah-desimal': { emoji: '🍓', bg: 'bg-emerald-100' },
  'jajanan-ubah-persen': { emoji: '🍬', bg: 'bg-violet-100' },
  'pizza-urut-campuran': { emoji: '🍕', bg: 'bg-amber-100' },
  'kue-operasi-hitung': { emoji: '🧁', bg: 'bg-pink-100' },
}

export function CardsGrid() {
  return (
    <section id="materi" aria-labelledby="judul-materi" className="scroll-mt-20 bg-white/60 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="judul-materi" className="text-center text-3xl font-black text-indigo-950">Enam Kartu Materi</h2>
        <p className="mx-auto mt-2 max-w-xl text-center font-medium text-indigo-800">
          Setiap kartu punya objek 3D sendiri dan tiga soal pilihan ganda.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AR_CARDS.map((c, i) => {
            const look = LOOK[c.cardId]
            return (
              <li key={c.cardId} className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft">
                <span className={`grid size-16 shrink-0 place-items-center rounded-2xl text-4xl ${look?.bg ?? 'bg-indigo-100'}`} aria-hidden="true">
                  {look?.emoji}
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-500">Kartu {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="text-lg font-extrabold leading-tight text-indigo-950">{c.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">{c.topic}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
