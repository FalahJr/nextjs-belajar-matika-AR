import { useEffect } from 'react'
import { AR_CARDS } from '../../config/arTargets'
import { useAREngine } from '../../hooks/useAREngine'
import { useCardSessions } from '../../hooks/useCardSessions'
import { getCardById } from '../../utils/cards'
import { ARCamera } from './ARCamera'
import { ARQuestionPanel } from './ARQuestionPanel'

type Props = {
  onExit: () => void
  onDemo: () => void
}

/**
 * Sesi AR nyata. Dua bagian yang berdiri sendiri:
 * - `useAREngine` → kamera/scene (tidak tahu apa pun tentang jawaban),
 * - `useCardSessions` → kuis per kartu (tidak tahu apa pun tentang kamera).
 * Keduanya hanya dihubungkan lewat `activeCardId`.
 */
export function ARSession({ onExit, onDemo }: Props) {
  const ar = useAREngine()
  const sessions = useCardSessions()

  // Sesi dibuka setelah pengguna menekan "Mulai Scan" di halaman pengantar, jadi kamera dimulai di sini.
  // `start` aman terhadap Strict Mode: panggilan kedua diabaikan selama start pertama berjalan.
  const { start } = ar
  useEffect(() => {
    void start()
  }, [start])

  const card = ar.activeCardId ? getCardById(ar.activeCardId, AR_CARDS) ?? null : null

  const exit = () => {
    ar.stop()
    onExit()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
      <ARCamera
        containerRef={ar.containerRef}
        status={ar.status}
        message={ar.message}
        activeModelState={card ? ar.modelStates[card.cardId] : undefined}
        unmappedTarget={ar.unmappedTarget}
        canSwitchCamera={ar.canSwitchCamera}
        onStart={() => void ar.start()}
        onStop={ar.stop}
        onSwitchCamera={ar.switchCamera}
        onBack={exit}
        onDemo={() => {
          ar.stop()
          onDemo()
        }}
      />
      <ARQuestionPanel
        card={card}
        state={card ? sessions.getState(card.cardId) : sessions.getState('')}
        targetLost={ar.status === 'target-lost'}
        emptyHint="Mulai scan, lalu arahkan kamera ke salah satu kartu. Soal dari kartu itu akan muncul di sini."
        onAnswer={sessions.answer}
        onNext={sessions.next}
        onRestart={(c) => sessions.restart(c.cardId)}
        onScanAnother={ar.clearActiveCard}
        onBack={exit}
      />
    </div>
  )
}
