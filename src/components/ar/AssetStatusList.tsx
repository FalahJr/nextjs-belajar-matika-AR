import { CircleCheck, CircleDashed, CircleX } from 'lucide-react'
import { AR_CARDS } from '../../data/arCards'
import { MIND_TARGET_URL } from '../../data/arConfig'
import type { AssetReport, AssetState } from '../../hooks/useAssetCheck'

function Row({ label, path, state }: { label: string; path: string; state: AssetState }) {
  const info = {
    ready: { text: 'Tersedia', icon: CircleCheck, tone: 'text-emerald-700' },
    missing: { text: 'Belum tersedia', icon: CircleX, tone: 'text-rose-700' },
    checking: { text: 'Memeriksa…', icon: CircleDashed, tone: 'text-slate-600' },
  }[state]
  return (
    <li className="flex items-start justify-between gap-3 py-1.5 text-sm">
      <span className="min-w-0">
        <span className="block font-bold text-indigo-950">{label}</span>
        <code className="block break-all text-xs text-slate-600">{path}</code>
      </span>
      <span className={`flex shrink-0 items-center gap-1 font-extrabold ${info.tone}`}>
        <info.icon className="size-4" aria-hidden="true" /> {info.text}
      </span>
    </li>
  )
}

export function AssetStatusList({ report }: { report: AssetReport }) {
  return (
    <details className="rounded-2xl border-2 border-indigo-100 bg-white p-3">
      <summary className="cursor-pointer text-sm font-extrabold text-indigo-800">Status aset AR</summary>
      <ul className="mt-2 divide-y divide-indigo-50">
        <Row label="File target MindAR" path={MIND_TARGET_URL} state={report.mind} />
        {AR_CARDS.map((c) => (
          <Row key={c.cardId} label={`Model: ${c.title}`} path={c.modelUrl} state={report.models[c.cardId] ?? 'checking'} />
        ))}
      </ul>
      <p className="mt-2 text-xs font-medium text-slate-600">
        Cara menyiapkan aset: lihat <code>docs/ASET.md</code> di repository.
      </p>
    </details>
  )
}
