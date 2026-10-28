import { useCallback, useEffect, useRef, useState } from 'react'
import type { AREngine, ModelState } from '../ar/arEngine'
import { AR_CARDS } from '../data/arCards'
import type { ARStatus } from '../types/ar'

/**
 * Menjembatani AREngine (non-React) dengan React.
 * - Engine dibuat HANYA saat `start()` dipanggil (setelah pengguna menekan Mulai Scan),
 *   tidak pernah saat render, sehingga Strict Mode/rerender tidak menginisialisasi kamera ganda.
 * - State kuis berada di luar hook ini; mengubahnya tidak memengaruhi engine.
 */
export function useAREngine() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<AREngine | null>(null)
  const startingRef = useRef(false)
  const mountedRef = useRef(false)

  const [status, setStatus] = useState<ARStatus>('idle')
  const [message, setMessage] = useState<string | undefined>()
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [modelStates, setModelStates] = useState<Record<string, ModelState>>({})
  const [canSwitchCamera, setCanSwitchCamera] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      engineRef.current?.stop()
      engineRef.current = null
    }
  }, [])

  const start = useCallback(async () => {
    const container = containerRef.current
    if (!container || engineRef.current || startingRef.current) return
    startingRef.current = true
    setStatus('loading')
    setMessage('Menyiapkan AR…')
    setCanSwitchCamera(false)

    try {
      // Engine (Three.js + GLTFLoader) dimuat malas agar landing & latihan tetap ringan.
      const { AREngine } = await import('../ar/arEngine')
      if (!mountedRef.current) return

      const engine = new AREngine(container, AR_CARDS, {
        onStatus: (s, msg) => {
          if (!mountedRef.current) return
          setStatus(s)
          setMessage(msg)
          if (s === 'error' || s === 'assets-missing' || s === 'stopped') {
            engineRef.current = null
            setCanSwitchCamera(false)
          }
          if (s === 'scanning') {
            void engine.hasMultipleCameras().then((multi) => {
              if (mountedRef.current && engineRef.current === engine) setCanSwitchCamera(multi)
            })
          }
        },
        onCardFound: (cardId) => {
          if (mountedRef.current) setActiveCardId(cardId)
        },
        onModelState: (cardId, state) => {
          if (mountedRef.current) setModelStates((m) => ({ ...m, [cardId]: state }))
        },
      })
      engineRef.current = engine
      await engine.start()
    } catch {
      if (mountedRef.current) {
        engineRef.current = null
        setStatus('error')
        setMessage('Engine AR gagal dimuat. Periksa koneksi lalu coba lagi.')
      }
    } finally {
      startingRef.current = false
    }
  }, [])

  const stop = useCallback(() => {
    engineRef.current?.stop()
    engineRef.current = null
  }, [])

  const switchCamera = useCallback(() => {
    void engineRef.current?.switchCamera()
  }, [])

  const clearActiveCard = useCallback(() => setActiveCardId(null), [])

  return {
    containerRef,
    status,
    message,
    activeCardId,
    modelStates,
    canSwitchCamera,
    start,
    stop,
    switchCamera,
    clearActiveCard,
  }
}
