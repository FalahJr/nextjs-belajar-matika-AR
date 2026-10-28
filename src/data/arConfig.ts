/**
 * Konfigurasi perilaku engine AR (kamera & tracking).
 * File target (.mind), pemetaan targetIndex, dan model GLB ada di `src/config/arTargets.ts`.
 * Langkah lengkap: docs/ASET.md
 */

/** Set `false` untuk mematikan tombol kamera nyata sama sekali (mode demo tetap jalan). */
export const ENABLE_REAL_AR = true

/** Parameter tracking MindAR (nilai `null` = default MindAR). Sesuaikan setelah uji kartu fisik. */
export const MINDAR_TUNING = {
  filterMinCF: null as number | null,
  filterBeta: null as number | null,
  warmupTolerance: null as number | null,
  missTolerance: null as number | null,
}

/** Jeda (ms) sebelum status "target hilang sementara" ditampilkan. Progres kuis tidak pernah dihapus. */
export const TARGET_LOST_GRACE_MS = 1500

/** Batas waktu (ms) inisialisasi kamera + muat target sebelum dianggap gagal. */
export const AR_START_TIMEOUT_MS = 60_000
