// Helper bersama untuk script target MindAR (Node, tanpa browser).
// Data dibaca dari file JSON yang SAMA dengan yang dipakai aplikasi:
//   src/config/targets/<set>.json  → urutan target (targetIndex) + gambar sumber
//   src/config/models.json         → model GLB per cardId
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const PUBLIC_DIR = join(ROOT, 'public')
export const CONFIG_DIR = join(ROOT, 'src/config')
export const TARGET_SETS = ['temporary', 'wildan']

export const rel = (path) => relative(ROOT, path)

/** URL publik (/assets/...) → path file di folder public/. */
export function publicFile(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) throw new Error(`URL publik harus diawali "/": ${url}`)
  return join(PUBLIC_DIR, url)
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function loadModels() {
  return readJson(join(CONFIG_DIR, 'models.json'))
}

export function manifestPath(setId) {
  return join(CONFIG_DIR, 'targets', `${setId}.json`)
}

/** Membaca argumen `--set <id>` (default: temporary). */
export function parseSetArg(argv = process.argv.slice(2)) {
  const i = argv.indexOf('--set')
  const setId = i >= 0 ? argv[i + 1] : 'temporary'
  if (!TARGET_SETS.includes(setId)) {
    throw new Error(`Set target tidak dikenal: "${setId}". Pilihan: ${TARGET_SETS.join(', ')}`)
  }
  return setId
}

/**
 * Membaca dan memvalidasi manifest. Mengembalikan target yang DIURUTKAN menurut targetIndex.
 * Untuk kompilasi, indeks wajib kontinu 0..n-1 dan setiap target wajib punya gambar.
 */
export function loadManifest(setId, { forCompile = false } = {}) {
  const path = manifestPath(setId)
  const manifest = readJson(path)
  const knownCards = Object.keys(loadModels())
  const problems = []

  if (typeof manifest.mindUrl !== 'string' || !manifest.mindUrl.endsWith('.mind')) {
    problems.push(`mindUrl harus berupa URL publik berakhiran .mind (sekarang: ${manifest.mindUrl})`)
  }
  if (!Array.isArray(manifest.targets)) problems.push('targets harus berupa array')
  const targets = [...(manifest.targets ?? [])].sort((a, b) => a.targetIndex - b.targetIndex)

  const seenIndexes = new Set()
  const seenCards = new Set()
  targets.forEach((t, i) => {
    if (!Number.isInteger(t.targetIndex) || t.targetIndex < 0) problems.push(`targetIndex tidak valid: ${t.targetIndex}`)
    if (seenIndexes.has(t.targetIndex)) problems.push(`targetIndex ${t.targetIndex} dipakai lebih dari sekali`)
    seenIndexes.add(t.targetIndex)
    // Compiler memberi indeks menurut urutan gambar, jadi set yang dikompilasi wajib 0..n-1 tanpa loncat.
    if (forCompile && t.targetIndex !== i) {
      problems.push(`targetIndex harus kontinu 0..${targets.length - 1} (ditemukan ${t.targetIndex} di posisi ${i})`)
    }
    if (!knownCards.includes(t.cardId)) problems.push(`cardId tidak dikenal: ${t.cardId}`)
    if (seenCards.has(t.cardId)) problems.push(`cardId ${t.cardId} dipetakan lebih dari sekali`)
    seenCards.add(t.cardId)
    if (forCompile) {
      if (!t.image) problems.push(`target #${t.targetIndex} (${t.cardId}) tidak punya gambar sumber — tidak bisa dikompilasi`)
      else if (!existsSync(publicFile(t.image))) problems.push(`gambar target #${t.targetIndex} tidak ditemukan: public${t.image}`)
      else if (!/\.(png|jpe?g)$/i.test(t.image)) problems.push(`gambar target #${t.targetIndex} harus PNG/JPG: ${t.image}`)
    }
  })
  if (forCompile && targets.length === 0) problems.push('targets kosong — tidak ada gambar untuk dikompilasi')

  if (problems.length > 0) {
    throw new Error(`Manifest ${rel(path)} tidak valid:\n  - ${problems.join('\n  - ')}`)
  }
  return { ...manifest, targets, manifestFile: path }
}

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

export function mindArVersion() {
  return readJson(join(ROOT, 'node_modules/mind-ar/package.json')).version
}

/** Byte awal file .mind MindAR 1.2.x: msgpack `{ v: 2, ... }`. */
export const MIND_V2_HEADER = Buffer.from([0x82, 0xa1, 0x76, 0x02])

/** Memuat modul MindAR resmi dari paket terpasang (compiler offline + komponen deteksi). */
export async function loadMindAr() {
  // offline-compiler.js juga mendaftarkan kernel CPU TensorFlow.js yang dipakai Detector.
  const { OfflineCompiler } = await import('mind-ar/src/image-target/offline-compiler.js')
  const { Detector } = await import('mind-ar/src/image-target/detector/detector.js')
  const { Matcher } = await import('mind-ar/src/image-target/matching/matcher.js')
  const { Estimator } = await import('mind-ar/src/image-target/estimation/estimator.js')
  const tf = await import('@tensorflow/tfjs')
  return { OfflineCompiler, Detector, Matcher, Estimator, tf }
}

/** PRNG deterministik (mulberry32) agar gambar & uji selalu sama untuk seed yang sama. */
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
