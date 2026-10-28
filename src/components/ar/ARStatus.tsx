import {
  Camera,
  CameraOff,
  CircleCheck,
  CircleDashed,
  LoaderCircle,
  ScanLine,
  Square,
  TriangleAlert,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { ARStatus as Status } from '../../types/ar'

const INFO: Record<Status, { label: string; tone: string; icon: ComponentType<{ className?: string }> }> = {
  idle: { label: 'Belum dimulai', tone: 'bg-slate-100 text-slate-800', icon: CircleDashed },
  'requesting-permission': { label: 'Meminta izin kamera…', tone: 'bg-amber-100 text-amber-900', icon: Camera },
  loading: { label: 'Memuat AR…', tone: 'bg-sky-100 text-sky-900', icon: LoaderCircle },
  scanning: { label: 'Siap memindai kartu', tone: 'bg-indigo-100 text-indigo-900', icon: ScanLine },
  'target-found': { label: 'Kartu terdeteksi', tone: 'bg-emerald-100 text-emerald-900', icon: CircleCheck },
  'target-lost': { label: 'Kartu hilang sementara', tone: 'bg-amber-100 text-amber-900', icon: ScanLine },
  'assets-missing': { label: 'Aset belum tersedia', tone: 'bg-orange-100 text-orange-900', icon: TriangleAlert },
  error: { label: 'Kamera/AR gagal', tone: 'bg-rose-100 text-rose-900', icon: CameraOff },
  stopped: { label: 'Dihentikan', tone: 'bg-slate-100 text-slate-800', icon: Square },
}

export function ARStatus({ status }: { status: Status }) {
  const { label, tone, icon: Icon } = INFO[status]
  const spinning = status === 'loading'
  return (
    <p role="status" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold shadow ${tone}`}>
      <Icon className={`size-4 ${spinning ? 'animate-spin' : ''}`} aria-hidden="true" />
      {label}
    </p>
  )
}
