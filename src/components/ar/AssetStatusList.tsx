import { CircleAlert, CircleCheck, CircleDashed, CircleX, Printer } from 'lucide-react'
import type { ComponentType } from 'react'
import { ACTIVE_TARGET_SET, AR_CARDS } from '../../config/arTargets'
import type { AssetReport } from '../../hooks/useAssetCheck'
import { getCardReadiness, type CardReadiness, type MindState } from '../../utils/cards'

type Info = { text: string; icon: ComponentType<{ className?: string }>; tone: string }

const MIND_INFO: Record<MindState, Info> = {
  ready: { text: 'Tersedia', icon: CircleCheck, tone: 'text-emerald-700' },
  missing: { text: 'Belum tersedia', icon: CircleX, tone: 'text-rose-700' },
  invalid: { text: 'Tidak valid', icon: CircleX, tone: 'text-rose-700' },
  mismatch: { text: 'Tidak cocok', icon: CircleAlert, tone: 'text-orange-700' },
  checking: { text: 'Memeriksa…', icon: CircleDashed, tone: 'text-slate-600' },
}

const READINESS_INFO: Record<CardReadiness, Info> = {
  ready: { text: 'Siap AR', icon: CircleCheck, tone: 'text-emerald-700' },
  'target-missing': { text: 'Target belum ada', icon: CircleAlert, tone: 'text-orange-700' },
  'model-missing': { text: 'Model belum tersedia', icon: CircleX, tone: 'text-rose-700' },
  'mind-unavailable': { text: 'File .mind belum siap', icon: CircleAlert, tone: 'text-orange-700' },
  checking: { text: 'Memeriksa…', icon: CircleDashed, tone: 'text-slate-600' },
}

function Badge({ info }: { info: Info }) {
  return (
    <span className={`flex shrink-0 items-center gap-1 font-extrabold ${info.tone}`}>
      <info.icon className="size-4" aria-hidden="true" /> {info.text}
    </span>
  )
}

const fileName = (path: string) => path.split('/').pop() ?? path

export function AssetStatusList({ report }: { report: AssetReport }) {
  const printSheet = ACTIVE_TARGET_SET.mode === 'temporary' ? '/assets/targets/temporary/kartu-sementara-a4.pdf' : null

  return (
    <details className="rounded-2xl border-2 border-indigo-100 bg-white p-3">
      <summary className="cursor-pointer text-sm font-extrabold text-indigo-800">Status aset AR</summary>
      <ul className="mt-2 divide-y divide-indigo-50">
        <li className="flex items-start justify-between gap-3 py-1.5 text-sm">
          <span className="min-w-0">
            <span className="block font-bold text-indigo-950">File target MindAR — {ACTIVE_TARGET_SET.label}</span>
            <code className="block break-all text-xs text-slate-600">{ACTIVE_TARGET_SET.mindUrl}</code>
            {report.mind === 'invalid' && (
              <span className="block text-xs font-semibold text-rose-700">File ada tetapi bukan file .mind MindAR yang valid.</span>
            )}
            {report.mindDetail && <span className="block text-xs font-semibold text-orange-700">{report.mindDetail}</span>}
          </span>
          <Badge info={MIND_INFO[report.mind]} />
        </li>
        {AR_CARDS.map((c) => {
          const readiness = getCardReadiness(c, report.mind)
          const modelMissingOnDisk = c.modelPath !== null && report.models[c.cardId] === 'missing'
          return (
            <li key={c.cardId} className="flex items-start justify-between gap-3 py-1.5 text-sm">
              <span className="min-w-0">
                <span className="block font-bold text-indigo-950">{c.title}</span>
                <span className="block text-xs text-slate-600">
                  Target:{' '}
                  {c.targetIndex === null ? (
                    'belum ada di file .mind aktif'
                  ) : (
                    <code>
                      #{c.targetIndex}
                      {c.targetSource ? ` · ${fileName(c.targetSource)}` : ''}
                    </code>
                  )}
                </span>
                <span className="block break-all text-xs text-slate-600">
                  Model:{' '}
                  {c.modelPath === null ? (
                    <>
                      belum tersedia (rencana: <code>{fileName(c.plannedModelPath)}</code>)
                    </>
                  ) : (
                    <code>{c.modelPath}</code>
                  )}
                </span>
                {modelMissingOnDisk && (
                  <span className="block text-xs font-semibold text-rose-700">
                    File model ditandai tersedia di konfigurasi, tetapi tidak ditemukan.
                  </span>
                )}
              </span>
              <Badge info={READINESS_INFO[readiness]} />
            </li>
          )
        })}
      </ul>
      {printSheet && (
        <a
          href={printSheet}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-700 underline"
        >
          <Printer className="size-4" aria-hidden="true" /> Cetak kartu target sementara (PDF A4)
        </a>
      )}
      <p className="mt-2 text-xs font-medium text-slate-600">
        Cara menyiapkan aset: lihat <code>docs/ASET.md</code> di repository.
      </p>
    </details>
  )
}
