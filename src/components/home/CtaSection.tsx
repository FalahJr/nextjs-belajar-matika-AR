import { PencilLine, ScanLine } from 'lucide-react'
import { ButtonLink } from '../ui/ButtonLink'

export function CtaSection() {
  return (
    <section aria-labelledby="judul-cta" className="mx-auto max-w-4xl px-4 pt-12">
      <div className="rounded-[2rem] bg-gradient-to-br from-amber-300 to-rose-300 p-8 text-center shadow-soft">
        <h2 id="judul-cta" className="text-3xl font-black text-indigo-950">Siap belajar sambil bermain?</h2>
        <p className="mx-auto mt-2 max-w-lg font-semibold text-indigo-950">
          Punya kartunya? Scan sekarang. Belum punya? Coba latihan soal atau mode demo tanpa kamera.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/scan" variant="primary">
            <ScanLine className="size-5" aria-hidden="true" /> Mulai Scan AR
          </ButtonLink>
          <ButtonLink to="/latihan" variant="secondary">
            <PencilLine className="size-5" aria-hidden="true" /> Mulai Latihan Soal
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
