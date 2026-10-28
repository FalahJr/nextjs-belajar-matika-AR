import { House } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { ButtonLink } from '../components/ui/ButtonLink'

export function NotFoundPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-6xl font-black text-rose-500">404</p>
        <h1 className="mt-2 text-2xl font-black text-indigo-950">Halaman tidak ditemukan</h1>
        <p className="mt-2 font-medium text-indigo-800">Sepertinya kamu tersesat. Yuk kembali ke beranda!</p>
        <ButtonLink to="/" className="mt-6">
          <House className="size-5" aria-hidden="true" /> Kembali ke Beranda
        </ButtonLink>
      </div>
    </PageShell>
  )
}
