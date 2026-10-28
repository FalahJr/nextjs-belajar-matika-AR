/**
 * KONFIGURASI TARGET & MODEL AR — satu-satunya sumber `targetIndex` dan path model.
 * Komponen React tidak perlu diubah saat aset berganti; cukup edit file ini dan/atau
 * `src/config/targets/*.json`. Langkah lengkap: docs/ASET.md
 *
 * Tiga hal yang dikelola terpisah:
 * - Materi & soal          → src/data/arCards.ts
 * - Model GLB per materi   → src/config/models.json (AR_MODELS)
 * - Set target (.mind)     → src/config/targets/<mode>.json (dibaca juga oleh `npm run compile:targets`)
 */
import { AR_CARD_CONTENT } from '../data/arCards'
import { CARD_IDS, type ARCardConfig, type ARCardContent, type CardId, type TargetSetManifest } from '../types/ar'
import models from './models.json'
import temporaryTargets from './targets/temporary.json'
import wildanTargets from './targets/wildan.json'

// ---------------------------------------------------------------------------
// 1. Mode target aktif
// ---------------------------------------------------------------------------

export type TargetMode = 'temporary' | 'wildan'

/**
 * - `temporary` (Mode A): kartu sementara buatan project + `.mind` hasil `npm run compile:targets`.
 * - `wildan`    (Mode B): `.mind`/kartu final dari Wildan (src/config/targets/wildan.json).
 * Bisa juga di-override saat build/dev lewat env `VITE_AR_TARGET_MODE=wildan`.
 */
const DEFAULT_TARGET_MODE: TargetMode = 'temporary'

const TARGET_SETS: Record<TargetMode, TargetSetManifest> = {
  temporary: temporaryTargets,
  wildan: wildanTargets,
}

function resolveMode(value: unknown): TargetMode {
  return value === 'temporary' || value === 'wildan' ? value : DEFAULT_TARGET_MODE
}

export const TARGET_MODE: TargetMode = resolveMode(import.meta.env.VITE_AR_TARGET_MODE)

export type ActiveTargetSet = TargetSetManifest & {
  mode: TargetMode
  /** Catatan hasil kompilasi (urutan + hash gambar) yang ditulis compiler di samping file .mind. */
  compileRecordUrl: string
}

export const ACTIVE_TARGET_SET: ActiveTargetSet = {
  ...TARGET_SETS[TARGET_MODE],
  mode: TARGET_MODE,
  compileRecordUrl: `${TARGET_SETS[TARGET_MODE].mindUrl}.json`,
}

// ---------------------------------------------------------------------------
// 2. Model GLB per materi — data di src/config/models.json (dibaca juga oleh `npm run verify:targets`)
// ---------------------------------------------------------------------------

export type ModelEntry = {
  /** Path publik GLB. Untuk model yang belum ada, ini hanya nama RENCANA (lihat docs/ASET.md). */
  path: string
  /**
   * `true` hanya bila file benar-benar sudah ada di public/assets/models/.
   * `false` ⇒ model tidak pernah dimuat; ubah menjadi `true` setelah file GLB diletakkan.
   */
  available: boolean
}

/** Tipe `Record<CardId, …>` memastikan keenam cardId ada di models.json (error saat typecheck bila kurang). */
export const AR_MODELS: Record<CardId, ModelEntry> = models

// ---------------------------------------------------------------------------
// 3. Penggabungan (jangan baca targetIndex dari tempat lain)
// ---------------------------------------------------------------------------

export function isCardId(value: string): value is CardId {
  return (CARD_IDS as readonly string[]).includes(value)
}

/** Mengembalikan daftar masalah pada manifest set target (kosong = valid). */
export function validateTargetSet(set: TargetSetManifest): string[] {
  const problems: string[] = []
  if (!set.mindUrl.endsWith('.mind')) problems.push(`mindUrl harus berakhiran .mind: ${set.mindUrl}`)
  const seenIndex = new Set<number>()
  const seenCard = new Set<string>()
  for (const t of set.targets) {
    if (!Number.isInteger(t.targetIndex) || t.targetIndex < 0) problems.push(`targetIndex tidak valid: ${t.targetIndex}`)
    if (seenIndex.has(t.targetIndex)) problems.push(`targetIndex ${t.targetIndex} dipakai lebih dari sekali`)
    seenIndex.add(t.targetIndex)
    if (!isCardId(t.cardId)) problems.push(`cardId tidak dikenal: ${t.cardId}`)
    if (seenCard.has(t.cardId)) problems.push(`cardId ${t.cardId} dipetakan lebih dari sekali`)
    seenCard.add(t.cardId)
  }
  return problems
}

export function buildCards(
  content: readonly ARCardContent[],
  models: Record<CardId, ModelEntry>,
  set: TargetSetManifest,
): ARCardConfig[] {
  return content.map((c) => {
    const target = set.targets.find((t) => t.cardId === c.cardId)
    const model = models[c.cardId]
    return {
      ...c,
      targetIndex: target ? target.targetIndex : null,
      targetSource: target?.image ?? null,
      modelPath: model.available ? model.path : null,
      plannedModelPath: model.path,
      modelStatus: model.available ? 'available' : 'missing',
    }
  })
}

/** Enam kartu siap pakai untuk seluruh aplikasi (landing, scan, demo). */
export const AR_CARDS: readonly ARCardConfig[] = buildCards(AR_CARD_CONTENT, AR_MODELS, ACTIVE_TARGET_SET)

/** Kartu yang punya target di file .mind aktif. */
export const MAPPED_CARDS: readonly ARCardConfig[] = AR_CARDS.filter((c) => c.targetIndex !== null)
