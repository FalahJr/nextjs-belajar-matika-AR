import { describe, expect, it } from 'vitest'
import { AR_CARD_CONTENT } from '../data/arCards'
import { CARD_IDS, type ARCardConfig } from '../types/ar'
import { getCardById, getCardByTargetIndex, getCardReadiness } from '../utils/cards'
import { AR_CARDS, AR_MODELS, buildCards, validateTargetSet } from './arTargets'
import temporary from './targets/temporary.json'
import wildan from './targets/wildan.json'

describe('konfigurasi target AR', () => {
  it('enam materi tetap ada sesuai cardId brief', () => {
    expect(AR_CARD_CONTENT.map((c) => c.cardId)).toEqual([...CARD_IDS])
  })

  it('manifest set target valid', () => {
    expect(validateTargetSet(temporary)).toEqual([])
    expect(validateTargetSet(wildan)).toEqual([])
  })

  it('set sementara memetakan tepat tiga kartu yang modelnya tersedia, urut 0–2', () => {
    const cards = buildCards(AR_CARD_CONTENT, AR_MODELS, temporary)
    const mapped = cards.filter((c) => c.targetIndex !== null).map((c) => [c.targetIndex, c.cardId])
    expect(mapped).toEqual([
      [0, 'pizza-pecahan-biasa'],
      [1, 'susu-pecahan-campuran'],
      [2, 'piring-buah-desimal'],
    ])
    for (const t of temporary.targets) {
      expect(t.image).toMatch(/^\/assets\/targets\/temporary\/.+\.(png|jpe?g)$/)
      expect(AR_MODELS[t.cardId as keyof typeof AR_MODELS].available).toBe(true)
    }
  })

  it('set Wildan tidak mengasumsikan urutan target', () => {
    const cards = buildCards(AR_CARD_CONTENT, AR_MODELS, wildan)
    expect(cards.every((c) => c.targetIndex === null)).toBe(true)
  })

  it('model yang belum tersedia tidak punya modelPath (tidak pernah dimuat)', () => {
    const missing = AR_CARDS.filter((c) => c.modelStatus === 'missing').map((c) => c.cardId)
    expect(missing).toEqual(['jajanan-ubah-persen', 'pizza-urut-campuran', 'kue-operasi-hitung'])
    for (const c of AR_CARDS) {
      expect(c.modelPath === null).toBe(c.modelStatus === 'missing')
      expect(c.plannedModelPath).toBe(`/assets/models/${c.cardId}.glb`)
    }
  })

  it('lookup kartu memakai konfigurasi terpusat', () => {
    expect(getCardByTargetIndex(1)?.cardId).toBe('susu-pecahan-campuran')
    expect(getCardByTargetIndex(3)).toBeUndefined()
    expect(getCardById('kue-operasi-hitung')?.targetIndex).toBeNull()
  })

  it('validator manifest mendeteksi indeks/cardId ganda dan cardId asing', () => {
    const bad = {
      ...temporary,
      targets: [
        { targetIndex: 0, cardId: 'pizza-pecahan-biasa', image: null },
        { targetIndex: 0, cardId: 'pizza-pecahan-biasa', image: null },
        { targetIndex: 1, cardId: 'tidak-ada', image: null },
      ],
    }
    expect(validateTargetSet(bad)).toHaveLength(3)
  })
})

describe('getCardReadiness', () => {
  const base = AR_CARDS[0]
  const card = (patch: Partial<ARCardConfig>): ARCardConfig => ({ ...base, ...patch })

  it('membedakan keempat status kesiapan', () => {
    expect(getCardReadiness(card({ targetIndex: 0, modelPath: '/m.glb' }), 'ready')).toBe('ready')
    expect(getCardReadiness(card({ targetIndex: null, modelPath: '/m.glb' }), 'ready')).toBe('target-missing')
    expect(getCardReadiness(card({ targetIndex: 0, modelPath: null }), 'ready')).toBe('model-missing')
    expect(getCardReadiness(card({ targetIndex: null, modelPath: null }), 'missing')).toBe('model-missing')
    for (const mind of ['missing', 'invalid', 'mismatch'] as const) {
      expect(getCardReadiness(card({ targetIndex: 0, modelPath: '/m.glb' }), mind)).toBe('mind-unavailable')
    }
    expect(getCardReadiness(card({ targetIndex: 0, modelPath: '/m.glb' }), 'checking')).toBe('checking')
  })
})
