import type { RefObject } from 'react'
import { Camera, RefreshCw, RotateCcw, SwitchCamera, TriangleAlert, X } from 'lucide-react'
import type { ModelState } from '../../ar/arEngine'
import type { ARStatus as Status } from '../../types/ar'
import { Button } from '../ui/ButtonLink'
import { ARStatus } from './ARStatus'

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
  status: Status
  message: string | undefined
  /** Status model 3D kartu yang sedang aktif (untuk banner fallback). */
  activeModelState: ModelState | undefined
  canSwitchCamera: boolean
  onStart: () => void
  onStop: () => void
  onSwitchCamera: () => void
  onBack: () => void
  onDemo: () => void
}

const COVER_STATES: Status[] = ['idle', 'requesting-permission', 'loading', 'assets-missing', 'error', 'stopped']

/**
 * Tampilan kamera. Wrapper memakai `isolate` karena MindAR memberi `<video>` z-index -2;
 * tanpa stacking context sendiri, video akan tersembunyi di balik latar wrapper.
 * `containerRef` adalah div KOSONG yang dikuasai MindAR/Three.js;
 * seluruh overlay React berada di sibling-nya agar tidak bercampur dengan DOM milik engine.
 */
export function ARCamera({
  containerRef,
  status,
  message,
  activeModelState,
  canSwitchCamera,
  onStart,
  onStop,
  onSwitchCamera,
  onBack,
  onDemo,
}: Props) {
  const showCover = COVER_STATES.includes(status)
  const live = !showCover

  return (
    <div className="relative isolate h-[52dvh] min-h-72 overflow-hidden rounded-3xl bg-indigo-950 shadow-soft lg:h-[calc(100dvh-9rem)] lg:min-h-[28rem]">
      <div ref={containerRef} className="absolute inset-0" />

      {live && (
        <>
          <div className="absolute left-3 top-3 z-10">
            <ARStatus status={status} />
          </div>
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            {canSwitchCamera && (
              <button
                type="button"
                onClick={onSwitchCamera}
                className="grid size-11 place-items-center rounded-full bg-white/90 text-indigo-900 shadow"
                aria-label="Ganti kamera"
              >
                <SwitchCamera className="size-5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={onStop}
              className="flex min-h-11 items-center gap-1.5 rounded-full bg-rose-500 px-4 font-extrabold text-white shadow"
            >
              <X className="size-5" aria-hidden="true" /> Berhenti
            </button>
          </div>
          {(status === 'scanning' || status === 'target-lost') && (
            <p className="absolute inset-x-3 bottom-3 z-10 rounded-2xl bg-white/90 px-4 py-2.5 text-center text-sm font-bold text-indigo-950">
              {status === 'scanning'
                ? 'Arahkan kamera ke kartu dan tahan hingga objek 3D muncul.'
                : 'Kartu hilang sementara. Arahkan lagi ke kartu — progres kuis tetap aman.'}
            </p>
          )}
          {(activeModelState === 'missing' || activeModelState === 'error') && status === 'target-found' && (
            <p className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 rounded-2xl bg-amber-100 px-4 py-2.5 text-sm font-bold text-amber-950">
              <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
              {activeModelState === 'missing'
                ? 'Model 3D kartu ini belum tersedia. Kotak kuning adalah penanda posisi kartu.'
                : 'Model 3D gagal dimuat. Kotak kuning adalah penanda posisi kartu.'}
            </p>
          )}
        </>
      )}

      {showCover && (
        <div className="absolute inset-0 z-10 grid place-items-center overflow-y-auto bg-gradient-to-b from-indigo-900 to-indigo-950 p-5 text-center text-white">
          <div className="grid max-w-sm justify-items-center gap-3">
            <ARStatus status={status} />
            {status === 'idle' && (
              <>
                <h2 className="text-2xl font-black">Siap memindai kartu?</h2>
                <p className="font-medium text-indigo-100">
                  Kamera baru menyala setelah kamu menekan tombol di bawah. Siapkan salah satu kartu dan cari tempat yang terang.
                </p>
                <Button variant="accent" onClick={onStart} className="w-full text-lg">
                  <Camera className="size-6" aria-hidden="true" /> Mulai Scan
                </Button>
              </>
            )}
            {(status === 'requesting-permission' || status === 'loading') && (
              <p className="font-semibold text-indigo-100">
                {status === 'requesting-permission'
                  ? 'Izinkan akses kamera pada kotak dialog browser.'
                  : (message ?? 'Mohon tunggu sebentar…')}
              </p>
            )}
            {status === 'assets-missing' && (
              <>
                <h2 className="text-xl font-black">Aset AR belum tersedia</h2>
                <p className="font-medium text-indigo-100">
                  {message} Kamera tidak dinyalakan. Kamu tetap bisa mencoba kuis lewat Mode Demo.
                </p>
              </>
            )}
            {status === 'error' && (
              <>
                <h2 className="text-xl font-black">Oh, ada kendala</h2>
                <p className="font-medium text-indigo-100">{message}</p>
                <Button variant="accent" onClick={onStart} className="w-full">
                  <RefreshCw className="size-5" aria-hidden="true" /> Coba Lagi
                </Button>
              </>
            )}
            {status === 'stopped' && (
              <>
                <h2 className="text-xl font-black">Sesi dihentikan</h2>
                <p className="font-medium text-indigo-100">Kamera sudah dimatikan.</p>
                <Button variant="accent" onClick={onStart} className="w-full">
                  <RotateCcw className="size-5" aria-hidden="true" /> Mulai Scan Lagi
                </Button>
              </>
            )}
            {status !== 'requesting-permission' && status !== 'loading' && (
              <div className="grid w-full gap-2">
                {status !== 'idle' && (
                  <Button variant="secondary" onClick={onDemo} className="w-full">
                    Coba Mode Demo (Tanpa Kamera)
                  </Button>
                )}
                <Button variant="ghost" onClick={onBack} className="w-full text-white hover:bg-white/10">
                  Kembali
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
