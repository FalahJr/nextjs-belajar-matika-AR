import { CreditCard, Cuboid, ListChecks, ScanLine } from 'lucide-react'

const STEPS = [
  { icon: CreditCard, title: 'Pilih kartu', text: 'Ambil salah satu dari enam kartu belajar.', color: 'bg-rose-100 text-rose-700' },
  { icon: ScanLine, title: 'Scan kartu', text: 'Tekan Mulai Scan dan arahkan kamera ke kartu.', color: 'bg-sky-100 text-sky-700' },
  { icon: Cuboid, title: 'Amati objek 3D', text: 'Lihat objek 3D muncul di atas kartu.', color: 'bg-amber-100 text-amber-800' },
  { icon: ListChecks, title: 'Jawab 3 soal', text: 'Pilih jawaban A–D dan lihat nilaimu.', color: 'bg-emerald-100 text-emerald-700' },
]

export function HowItWorks() {
  return (
    <section id="cara-belajar" aria-labelledby="judul-cara" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
      <h2 id="judul-cara" className="text-center text-3xl font-black text-indigo-950">Cara Belajar</h2>
      <p className="mx-auto mt-2 max-w-xl text-center font-medium text-indigo-800">Hanya empat langkah mudah.</p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-3xl bg-white p-5 shadow-soft">
            <span className="absolute -top-3 left-5 rounded-full bg-indigo-600 px-3 py-0.5 text-sm font-black text-white">
              {i + 1}
            </span>
            <span className={`mb-3 grid size-12 place-items-center rounded-2xl ${s.color}`}>
              <s.icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-extrabold text-indigo-950">{s.title}</h3>
            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
