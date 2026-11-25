import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, PencilLine, ScanLine } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { PdfViewer } from '../components/materi/PdfViewer'
import { ButtonLink } from '../components/ui/ButtonLink'
import { MATERI, getMateriBySlug } from '../data/materi'
import { NotFoundPage } from './NotFoundPage'

export function MateriDetailPage() {
  const { slug } = useParams()
  const materi = getMateriBySlug(slug)
  if (!materi) return <NotFoundPage />

  const index = MATERI.indexOf(materi)
  const prev = MATERI[index - 1]
  const next = MATERI[index + 1]

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link
          to="/materi"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl pr-3 font-bold text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeft className="size-5" aria-hidden="true" /> Semua Materi
        </Link>
        <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-indigo-500">Materi {materi.number}</p>
        <h1 className="text-3xl font-black text-indigo-950">{materi.title}</h1>
        <p className="mt-1 font-medium text-indigo-800">{materi.summary}</p>

        <div className="mt-5">
          {/* key: viewer dibuat ulang (zoom kembali 100%) saat pindah materi. */}
          <PdfViewer key={materi.slug} url={materi.pdf} title={`Materi ${materi.number}: ${materi.title}`} />
        </div>

        <section aria-label="Lanjut belajar" className="mt-6 rounded-3xl bg-white p-5 text-center shadow-soft">
          <h2 className="text-lg font-extrabold text-indigo-950">Sudah selesai membaca?</h2>
          <p className="mt-1 font-medium text-indigo-800">Uji pemahamanmu dengan kartu AR atau latihan soal.</p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <ButtonLink to="/scan" variant="accent">
              <ScanLine className="size-5" aria-hidden="true" /> Scan Kartu AR
            </ButtonLink>
            <ButtonLink to="/latihan" variant="secondary">
              <PencilLine className="size-5" aria-hidden="true" /> Latihan Soal
            </ButtonLink>
          </div>
        </section>

        <nav aria-label="Materi lain" className="mt-4 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              to={`/materi/${prev.slug}`}
              className="flex min-h-14 items-center gap-2 rounded-2xl bg-white p-3 font-bold text-indigo-900 shadow-soft hover:bg-indigo-50"
            >
              <ChevronLeft className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs text-indigo-500">Sebelumnya</span>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/materi/${next.slug}`}
              className="flex min-h-14 items-center justify-end gap-2 rounded-2xl bg-white p-3 text-right font-bold text-indigo-900 shadow-soft hover:bg-indigo-50"
            >
              <span className="min-w-0">
                <span className="block text-xs text-indigo-500">Berikutnya</span>
                {next.title}
              </span>
              <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </PageShell>
  )
}
