import { PencilLine, ScanLine } from 'lucide-react'
import { ButtonLink } from '../ui/ButtonLink'
import { HeroIllustration } from './HeroIllustration'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-100 via-violet-50 to-transparent">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="animate-fade-up">
          <p className="mb-3 inline-block rounded-full bg-amber-300 px-4 py-1 text-sm font-extrabold text-amber-950">
            Belajar Matematika SD dengan AR 3D
          </p>
          <h1 className="text-4xl font-black leading-tight text-indigo-950 sm:text-5xl">
            Pizza, susu, dan kue <span className="text-rose-500">melayang</span> dari kartumu!
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-indigo-900">
            Arahkan kamera ke kartu belajar, lihat objek 3D muncul, lalu jawab soal tentang pecahan,
            desimal, persen, dan operasi hitung. Seru dan mudah dipahami!
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/scan" variant="accent" className="text-lg">
              <ScanLine className="size-6" aria-hidden="true" /> Mulai Scan AR
            </ButtonLink>
            <ButtonLink to="/latihan" variant="secondary" className="text-lg">
              <PencilLine className="size-6" aria-hidden="true" /> Mulai Latihan Soal
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm font-semibold text-indigo-700">
            Tanpa login · Tanpa menyimpan data · Bisa lewat HP maupun laptop
          </p>
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}
