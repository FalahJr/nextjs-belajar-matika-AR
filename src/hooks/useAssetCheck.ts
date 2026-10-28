import { useEffect, useState } from 'react'
import { assetExists } from '../ar/assets'
import { AR_CARDS } from '../data/arCards'
import { MIND_TARGET_URL } from '../data/arConfig'

export type AssetState = 'checking' | 'ready' | 'missing'

export type AssetReport = {
  mind: AssetState
  /** Status file GLB per `cardId`. */
  models: Record<string, AssetState>
}

const INITIAL: AssetReport = {
  mind: 'checking',
  models: Object.fromEntries(AR_CARDS.map((c) => [c.cardId, 'checking' as AssetState])),
}

/** Memeriksa (tanpa kamera) apakah file .mind dan keenam .glb sudah ada di /public/assets. */
export function useAssetCheck(): AssetReport {
  const [report, setReport] = useState<AssetReport>(INITIAL)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const toState = (ok: boolean): AssetState => (ok ? 'ready' : 'missing')

    void assetExists(MIND_TARGET_URL, signal).then((ok) => {
      if (!signal.aborted) setReport((r) => ({ ...r, mind: toState(ok) }))
    })
    for (const card of AR_CARDS) {
      void assetExists(card.modelUrl, signal).then((ok) => {
        if (!signal.aborted) {
          setReport((r) => ({ ...r, models: { ...r.models, [card.cardId]: toState(ok) } }))
        }
      })
    }
    return () => controller.abort()
  }, [])

  return report
}
