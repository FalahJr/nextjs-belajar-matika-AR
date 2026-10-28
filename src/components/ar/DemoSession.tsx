import { FlaskConical } from 'lucide-react'
import { AR_CARDS } from '../../data/arCards'
import { useCardSessions } from '../../hooks/useCardSessions'
import { summarizeAnswers } from '../../utils/scoring'
import { useEffect, useState } from 'react'
import { ARQuestionPanel } from './ARQuestionPanel'

type Props = { onExit: () => void }

/**
 * Mode Demo: menguji 18 soal AR tanpa kamera dan tanpa tracking.
 * Memakai panel soal & hook sesi yang sama dengan AR nyata, sehingga kuis tidak perlu ditulis ulang.
 */
export function DemoSession({ onExit }: Props) {
  const [cardId, setCardId] = useState<string | null>(null)
  const sessions = useCardSessions()
  const card = AR_CARDS.find((c) => c.cardId === cardId) ?? null

  // Di HP, daftar kartu mendorong panel soal ke bawah layar; gulir otomatis saat kartu dipilih.
  useEffect(() => {
    if (cardId) document.getElementById('panel-soal-demo')?.scrollIntoView({ block: 'start' })
  }, [cardId])

  return (
    <div className="grid gap-4">
      <div role="note" className="flex items-start gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
        <FlaskConical className="mt-0.5 size-6 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <p className="font-black text-amber-950">Mode Demo — Tanpa Kamera</p>
          <p className="text-sm font-medium text-amber-950">
            Ini hanya untuk mencoba soal. Tidak ada pelacakan kartu atau objek 3D di mode ini.
          </p>
        </div>
      </div>

      <section aria-labelledby="pilih-kartu" className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <h2 id="pilih-kartu" className="mb-3 text-lg font-black text-indigo-950">Pilih kartu</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AR_CARDS.map((c) => {
            const st = sessions.getState(c.cardId)
            const answered = Object.keys(st.answers).length
            const done = st.currentIndex >= c.questions.length
            const selected = c.cardId === cardId
            const result = summarizeAnswers(c.questions, st.answers)
            return (
              <li key={c.cardId}>
                <button
                  type="button"
                  onClick={() => setCardId(c.cardId)}
                  aria-pressed={selected}
                  className={`flex min-h-14 w-full flex-col items-start rounded-2xl border-2 px-3 py-2 text-left transition ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-indigo-100 bg-white hover:border-indigo-300'}`}
                >
                  <span className="font-extrabold text-indigo-950">{c.title}</span>
                  <span className="text-xs font-bold text-slate-600">
                    {done ? `Selesai · nilai ${result.score}` : answered > 0 ? `${answered} dari ${c.questions.length} dijawab` : 'Belum dikerjakan'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div id="panel-soal-demo" className="scroll-mt-20">
        <ARQuestionPanel
          card={card}
          state={card ? sessions.getState(card.cardId) : sessions.getState('')}
          emptyHint="Pilih salah satu kartu di atas untuk mencoba tiga soalnya."
          onAnswer={sessions.answer}
          onNext={sessions.next}
          onRestart={(c) => sessions.restart(c.cardId)}
          onScanAnother={() => setCardId(null)}
          scanAnotherLabel="Pilih Kartu Lain"
          onBack={onExit}
        />
      </div>
    </div>
  )
}
