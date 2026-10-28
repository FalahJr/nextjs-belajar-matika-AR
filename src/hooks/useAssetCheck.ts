import { useEffect, useState } from 'react'
import { assetExists, checkMindFile, fetchCompileRecord } from '../ar/assets'
import { ACTIVE_TARGET_SET, AR_CARDS } from '../config/arTargets'
import type { MindState } from '../utils/cards'

export type AssetState = 'checking' | 'ready' | 'missing'

export type AssetReport = {
  mind: MindState
  /** Penjelasan tambahan untuk status `.mind` (mis. alasan tidak cocok). */
  mindDetail?: string
  /** Status file GLB per `cardId` (hanya untuk model yang ditandai tersedia di konfigurasi). */
  models: Record<string, AssetState>
}

const INITIAL: AssetReport = {
  mind: 'checking',
  models: Object.fromEntries(
    AR_CARDS.filter((c) => c.modelPath !== null).map((c) => [c.cardId, 'checking' as AssetState]),
  ),
}

/**
 * Memeriksa (tanpa kamera) file .mind set target aktif dan model GLB yang ditandai tersedia.
 * Bila compiler menulis catatan kompilasi (`<file>.mind.json`), urutannya dibandingkan dengan konfigurasi.
 */
export function useAssetCheck(): AssetReport {
  const [report, setReport] = useState<AssetReport>(INITIAL)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const toState = (ok: boolean): AssetState => (ok ? 'ready' : 'missing')

    void (async () => {
      const mind = await checkMindFile(ACTIVE_TARGET_SET.mindUrl, signal)
      let state: MindState = mind
      let detail: string | undefined
      if (mind === 'ready') {
        const problem = compareWithRecord(await fetchCompileRecord(ACTIVE_TARGET_SET.compileRecordUrl, signal))
        if (problem) {
          state = 'mismatch'
          detail = problem
        }
      }
      if (!signal.aborted) setReport((r) => ({ ...r, mind: state, mindDetail: detail }))
    })()

    for (const card of AR_CARDS) {
      if (card.modelPath === null) continue
      void assetExists(card.modelPath, signal).then((ok) => {
        if (!signal.aborted) {
          setReport((r) => ({ ...r, models: { ...r.models, [card.cardId]: toState(ok) } }))
        }
      })
    }
    return () => controller.abort()
  }, [])

  return report
}

/** Membandingkan urutan target hasil kompilasi dengan konfigurasi. `null` = cocok / tidak ada catatan. */
function compareWithRecord(record: Awaited<ReturnType<typeof fetchCompileRecord>>): string | null {
  if (!record) return null // .mind dari luar (mis. Wildan) boleh tanpa catatan kompilasi.
  for (const t of ACTIVE_TARGET_SET.targets) {
    const compiled = record.targets.find((r) => r.targetIndex === t.targetIndex)
    if (!compiled) return `File .mind tidak berisi target #${t.targetIndex} (${t.cardId}).`
    if (compiled.cardId !== t.cardId) {
      return `Target #${t.targetIndex} dikompilasi untuk ${compiled.cardId}, tetapi konfigurasi memetakannya ke ${t.cardId}.`
    }
  }
  return null
}
