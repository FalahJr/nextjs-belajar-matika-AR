import { Eye, Hand, MessageCircleHeart } from 'lucide-react'

const ITEMS = [
  { icon: Eye, title: 'Melihat konsep dari dekat', text: 'Objek 3D membantu membayangkan bagian-bagian pecahan, desimal, dan persen.', color: 'text-sky-700 bg-sky-100' },
  { icon: Hand, title: 'Belajar sambil bergerak', text: 'Memegang kartu dan mengarahkan kamera membuat belajar terasa seperti bermain.', color: 'text-amber-800 bg-amber-100' },
  { icon: MessageCircleHeart, title: 'Umpan balik yang ramah', text: 'Setiap jawaban langsung dijelaskan dengan bahasa positif, tanpa menghakimi.', color: 'text-rose-700 bg-rose-100' },
]

export function Benefits() {
  return (
    <section aria-labelledby="judul-manfaat" className="mx-auto max-w-6xl px-4 py-12">
      <h2 id="judul-manfaat" className="text-center text-3xl font-black text-indigo-950">Kenapa Belajar Interaktif?</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {ITEMS.map((b) => (
          <article key={b.title} className="rounded-3xl bg-white p-6 shadow-soft">
            <span className={`mb-4 grid size-12 place-items-center rounded-2xl ${b.color}`}>
              <b.icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-extrabold text-indigo-950">{b.title}</h3>
            <p className="mt-1 font-medium leading-relaxed text-slate-700">{b.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
