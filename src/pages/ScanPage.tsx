import { useState } from 'react'
import { ArrowLeft, Camera, FlaskConical, Lightbulb, Smartphone } from 'lucide-react'
import { ARSession } from '../components/ar/ARSession'
import { AssetStatusList } from '../components/ar/AssetStatusList'
import { DemoSession } from '../components/ar/DemoSession'
import { PageShell } from '../components/layout/PageShell'
import { Button, ButtonLink } from '../components/ui/ButtonLink'
import { MAPPED_CARDS } from '../config/arTargets'
import { ENABLE_REAL_AR } from '../data/arConfig'
import { useAssetCheck } from '../hooks/useAssetCheck'

type Mode = 'intro' | 'ar' | 'demo'

function Intro({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  const assets = useAssetCheck()
  const realArOff = !ENABLE_REAL_AR
  const notice = realArOff
    ? 'Mode kamera nyata dinonaktifkan di konfigurasi (arConfig.ts).'
    : assets.mind === 'missing'
      ? 'File target .mind belum tersedia. Scan kamera belum bisa dipakai; coba kuis lewat Mode Demo.'
      : assets.mind === 'invalid'
        ? 'File target .mind tidak valid (bukan hasil compiler MindAR). Scan kamera belum bisa dipakai; coba kuis lewat Mode Demo.'
        : assets.mind === 'mismatch'
          ? `File target .mind tidak cocok dengan konfigurasi. ${assets.mindDetail ?? ''} Jalankan ulang compile:targets.`
          : assets.mind === 'ready' && MAPPED_CARDS.length === 0
            ? 'Belum ada target yang dipetakan ke materi. Scan hanya menampilkan nomor target yang terdeteksi (untuk mengonfirmasi urutan).'
            : null

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      <div className="rounded-3xl bg-white p-5 shadow-soft sm:p-7">
        <h1 className="text-3xl font-black text-indigo-950">Scan Kartu AR</h1>
        <ol className="mt-4 grid gap-3 font-medium text-indigo-900">
          <li className="flex gap-3"><Smartphone className="mt-0.5 size-6 shrink-0 text-indigo-600" aria-hidden="true" /> <span>Siapkan salah satu kartu belajar yang sudah dicetak, letakkan di meja yang rata.</span></li>
          <li className="flex gap-3"><Camera className="mt-0.5 size-6 shrink-0 text-indigo-600" aria-hidden="true" /> <span>Tekan <strong>Mulai Scan</strong> dan izinkan kamera. Di HP, kamera belakang dipakai bila tersedia.</span></li>
          <li className="flex gap-3"><Lightbulb className="mt-0.5 size-6 shrink-0 text-indigo-600" aria-hidden="true" /> <span>Cari tempat yang terang, tahan kamera tegak lurus ke kartu hingga objek 3D muncul.</span></li>
        </ol>

        {notice && (
          <p role="status" className="mt-4 rounded-2xl bg-orange-50 p-3 font-bold text-orange-900">
            {notice}
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button variant="accent" className="text-lg" onClick={onStart} disabled={realArOff || assets.mind !== 'ready'}>
            <Camera className="size-6" aria-hidden="true" /> Mulai Scan
          </Button>
          <Button variant="secondary" className="text-lg" onClick={onDemo}>
            <FlaskConical className="size-6" aria-hidden="true" /> Mode Demo (Tanpa Kamera)
          </Button>
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">
          Kamera tidak menyala sebelum kamu menekan Mulai Scan. Akses kamera lewat jaringan memerlukan HTTPS.
        </p>
      </div>

      <AssetStatusList report={assets} />
      <ButtonLink to="/latihan" variant="ghost" className="justify-self-center">
        Atau coba Latihan Soal biasa
      </ButtonLink>
    </div>
  )
}

export function ScanPage() {
  const [mode, setMode] = useState<Mode>('intro')

  return (
    <PageShell hideFooter={mode !== 'intro'}>
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        {mode !== 'intro' && (
          <div className="mb-3">
            <Button variant="ghost" className="min-h-11 px-3 py-1.5" onClick={() => setMode('intro')}>
              <ArrowLeft className="size-5" aria-hidden="true" /> Kembali
            </Button>
          </div>
        )}
        {mode === 'intro' && <Intro onStart={() => setMode('ar')} onDemo={() => setMode('demo')} />}
        {mode === 'ar' && <ARSession onExit={() => setMode('intro')} onDemo={() => setMode('demo')} />}
        {mode === 'demo' && <DemoSession onExit={() => setMode('intro')} />}
      </div>
    </PageShell>
  )
}
