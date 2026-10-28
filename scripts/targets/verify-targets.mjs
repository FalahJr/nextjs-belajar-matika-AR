// Memvalidasi file .mind sebuah set target + model GLB.
//   npm run verify:targets                 (set "temporary")
//   npm run verify:targets -- --set wildan
// Pemeriksaan:
//   1. file .mind ada, berformat MindAR v2, dan bisa dibaca oleh MindAR terpasang;
//   2. jumlah & urutan target cocok dengan manifest (src/config/targets/<set>.json) dan catatan kompilasi;
//   3. gambar sumber tidak berubah sejak dikompilasi (sha256) → mendeteksi .mind basi;
//   4. validasi silang: tiap gambar, dirender ke "frame kamera" simulasi, hanya dikenali sebagai targetIndex-nya
//      sendiri oleh Detector + Matcher + Estimator MindAR (bukan pengganti uji kamera & kartu cetak);
//   5. model GLB yang ditandai tersedia di src/config/models.json benar-benar ada dan valid.
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { createCanvas, loadImage } from 'canvas'
import {
  MIND_V2_HEADER,
  loadManifest,
  loadMindAr,
  loadModels,
  parseSetArg,
  publicFile,
  readJson,
  rel,
  rng,
  sha256,
} from './lib.mjs'

const FRAME_W = 640
const FRAME_H = 480
const MIN_FEATURE_POINTS = 100

/** Variasi "foto kamera": tinggi kartu relatif terhadap frame, rotasi (radian), kecerahan. */
const CAMERA_VARIANTS = [
  { height: 0.85, angle: 0.06, shade: 0.1, dx: 0 },
  { height: 0.62, angle: -0.22, shade: 0.25, dx: 70 },
  { height: 0.48, angle: 0.45, shade: 0.05, dx: -90 },
]

export async function verifySet(setId, { crossMatch = true } = {}) {
  const errors = []
  const warnings = []
  const ok = (msg) => console.log(`  ✓ ${msg}`)
  const warn = (msg) => {
    warnings.push(msg)
    console.log(`  ! ${msg}`)
  }
  const fail = (msg) => {
    errors.push(msg)
    console.log(`  ✗ ${msg}`)
  }

  console.log(`\nVerifikasi set target "${setId}"`)
  let manifest
  try {
    manifest = loadManifest(setId)
    ok(`manifest ${rel(manifest.manifestFile)} valid (${manifest.targets.length} target terpetakan)`)
  } catch (err) {
    fail(err.message)
    return { errors, warnings }
  }

  // --- 1. File .mind -------------------------------------------------------
  const mindFile = publicFile(manifest.mindUrl)
  let dataList = null
  if (!existsSync(mindFile)) {
    fail(`file .mind belum ada: ${rel(mindFile)}`)
  } else {
    const buffer = readFileSync(mindFile)
    if (buffer.length === 0) fail(`file .mind kosong: ${rel(mindFile)}`)
    else if (!buffer.subarray(0, 4).equals(MIND_V2_HEADER)) {
      fail(`${rel(mindFile)} bukan file .mind MindAR v2 (header ${buffer.subarray(0, 4).toString('hex')})`)
    } else {
      const { OfflineCompiler } = await loadMindAr()
      dataList = new OfflineCompiler().importData(buffer)
      if (dataList.length === 0) fail(`${rel(mindFile)} tidak berisi target yang bisa dibaca MindAR`)
      else ok(`${rel(mindFile)}: ${(buffer.length / 1024).toFixed(0)} KB, format MindAR v2, ${dataList.length} target`)
    }
  }

  // --- 2 & 3. Urutan + catatan kompilasi ------------------------------------
  const recordFile = `${mindFile}.json`
  const record = existsSync(recordFile) ? readJson(recordFile) : null
  if (dataList) {
    const maxIndex = Math.max(-1, ...manifest.targets.map((t) => t.targetIndex))
    if (maxIndex >= dataList.length) {
      fail(`manifest memetakan targetIndex ${maxIndex}, tetapi .mind hanya berisi ${dataList.length} target`)
    }
    const unmapped = dataList.length - manifest.targets.length
    if (unmapped > 0) warn(`${unmapped} target di .mind belum dipetakan ke materi (lihat docs/ASET.md, Mode B)`)

    if (!record) {
      warn(`tidak ada catatan kompilasi (${rel(recordFile)}); urutan target tidak bisa dicek otomatis — konfirmasi dengan uji scan`)
    } else {
      const recorded = record.targets.map((t) => `${t.targetIndex}:${t.cardId}`).join(', ')
      const configured = manifest.targets.map((t) => `${t.targetIndex}:${t.cardId}`).join(', ')
      if (recorded !== configured) fail(`urutan di catatan kompilasi [${recorded}] ≠ manifest [${configured}] → jalankan ulang compile:targets`)
      else ok(`urutan target sama dengan saat kompilasi: ${configured}`)
      if (record.mindSha256 && record.mindSha256 !== sha256(mindFile)) {
        fail('file .mind berubah setelah dikompilasi (sha256 berbeda dari catatan) → jalankan ulang compile:targets')
      }
      for (const t of record.targets) {
        const file = t.image ? publicFile(t.image) : null
        if (!file || !existsSync(file)) warn(`gambar sumber target #${t.targetIndex} tidak ditemukan: ${t.image}`)
        else if (sha256(file) !== t.sha256) fail(`gambar target #${t.targetIndex} (${t.image}) berubah sejak dikompilasi → jalankan ulang compile:targets`)
      }
      if (record.mindArVersion) ok(`dikompilasi dengan mind-ar ${record.mindArVersion} pada ${record.compiledAt}`)
    }

    dataList.forEach((d, i) => {
      const kf = d.matchingData?.[0]
      const points = kf ? kf.maximaPoints.length + kf.minimaPoints.length : 0
      const tracking = d.trackingData?.[0]?.points?.length ?? 0
      const msg = `target #${i}: ${d.targetImage.width}×${d.targetImage.height}px, ${points} titik fitur matching, ${tracking} titik tracking`
      if (points < MIN_FEATURE_POINTS) warn(`${msg} (rendah — gambar mungkin sulit dilacak)`)
      else ok(msg)
    })
  }

  // --- 4. Validasi silang ----------------------------------------------------
  const withImages = manifest.targets.filter((t) => t.image && existsSync(publicFile(t.image)))
  if (dataList && crossMatch && withImages.length > 0) {
    const { Detector, Matcher, Estimator, tf } = await loadMindAr()
    const f = FRAME_H / 2 / Math.tan((45 * Math.PI) / 180 / 2)
    const estimator = new Estimator([
      [f, 0, FRAME_W / 2],
      [0, f, FRAME_H / 2],
      [0, 0, 1],
    ])
    const matcher = new Matcher(FRAME_W, FRAME_H, false)
    const detector = new Detector(FRAME_W, FRAME_H)
    const matchingDataList = dataList.map((d) => d.matchingData)

    let correct = 0
    let total = 0
    let falseMatches = 0
    for (const t of withImages) {
      const image = await loadImage(publicFile(t.image))
      for (const [v, variant] of CAMERA_VARIANTS.entries()) {
        total++
        const gray = renderCameraFrame(image, variant, 1000 + t.targetIndex * 10 + v)
        let featurePoints = []
        tf.tidy(() => {
          const input = tf.tensor(gray, [FRAME_H, FRAME_W], 'float32')
          featurePoints = detector.detect(input).featurePoints
        })
        const matched = []
        matchingDataList.forEach((keyframes, j) => {
          const res = matcher.matchDetection(keyframes, featurePoints)
          if (res.keyframeIndex === -1) return
          if (estimator.estimate({ screenCoords: res.screenCoords, worldCoords: res.worldCoords })) {
            matched.push({ index: j, matches: res.screenCoords.length })
          }
        })
        const label = `gambar ${t.cardId} (variasi ${v + 1})`
        const self = matched.find((m) => m.index === t.targetIndex)
        const others = matched.filter((m) => m.index !== t.targetIndex)
        if (self && others.length === 0) {
          correct++
          ok(`${label} → hanya target #${t.targetIndex} (${self.matches} titik cocok)`)
        } else if (others.length > 0) {
          falseMatches++
          fail(
            `${label} juga cocok dengan ${others.map((m) => `#${m.index} (${m.matches} titik)`).join(', ')}` +
              ` selain #${t.targetIndex} (${self?.matches ?? 0} titik) — gambar target terlalu mirip`,
          )
        } else {
          warn(`${label} tidak dikenali di frame simulasi (${featurePoints.length} titik terdeteksi) — uji dengan kartu cetak`)
        }
      }
    }
    const summary = `validasi silang: ${correct}/${total} frame simulasi dikenali hanya sebagai target yang benar, ${falseMatches} salah-cocok`
    if (correct === total) ok(summary)
    else warn(summary)
  } else if (dataList && withImages.length === 0) {
    warn('tidak ada gambar sumber → validasi silang dilewati (konfirmasi urutan dengan uji scan)')
  }

  // --- 5. Model GLB ----------------------------------------------------------
  console.log('\nVerifikasi model GLB (src/config/models.json)')
  for (const [cardId, model] of Object.entries(loadModels())) {
    const file = publicFile(model.path)
    const exists = existsSync(file)
    if (model.available) {
      if (!exists) fail(`${cardId}: ditandai tersedia tetapi file tidak ada (${rel(file)})`)
      else {
        const problem = checkGlb(readFileSync(file))
        if (problem) fail(`${cardId}: ${rel(file)} ${problem}`)
        else ok(`${cardId}: ${rel(file)} (glTF 2.0, ${(readFileSync(file).length / 1024).toFixed(0)} KB)`)
      }
    } else if (exists) {
      warn(`${cardId}: file ${rel(file)} sudah ada tetapi ditandai belum tersedia → ubah "available" menjadi true`)
    } else {
      ok(`${cardId}: model belum tersedia (sesuai konfigurasi, tidak dimuat)`)
    }
  }

  console.log(`\nHasil: ${errors.length} error, ${warnings.length} peringatan`)
  return { errors, warnings }
}

function checkGlb(buf) {
  if (buf.length < 20 || buf.toString('ascii', 0, 4) !== 'glTF') return 'bukan file GLB (magic "glTF" tidak ada)'
  if (buf.readUInt32LE(4) !== 2) return `versi glTF ${buf.readUInt32LE(4)}, harus 2`
  if (buf.readUInt32LE(8) !== buf.length) return 'panjang file tidak cocok dengan header (file terpotong?)'
  return null
}

/** Merender kartu ke frame 640×480 dengan meja bertekstur, rotasi, dan bayangan; hasil grayscale 0–255. */
function renderCameraFrame(image, { height, angle, shade, dx }, seed) {
  const rand = rng(seed)
  const canvas = createCanvas(FRAME_W, FRAME_H)
  const g = canvas.getContext('2d')
  g.fillStyle = '#8b7355'
  g.fillRect(0, 0, FRAME_W, FRAME_H)
  for (let i = 0; i < 900; i++) {
    const c = 100 + Math.floor(rand() * 60)
    g.fillStyle = `rgb(${c + 20},${c},${c - 30})`
    g.fillRect(rand() * FRAME_W, rand() * FRAME_H, 1 + rand() * 3, 1 + rand() * 3)
  }
  const h = FRAME_H * height
  const w = (h * image.width) / image.height
  g.save()
  g.translate(FRAME_W / 2 + dx, FRAME_H / 2)
  g.rotate(angle)
  g.drawImage(image, -w / 2, -h / 2, w, h)
  g.restore()
  g.fillStyle = `rgba(0,0,0,${shade})`
  g.fillRect(0, 0, FRAME_W, FRAME_H)

  const { data } = g.getImageData(0, 0, FRAME_W, FRAME_H)
  const gray = new Float32Array(FRAME_W * FRAME_H)
  for (let i = 0; i < gray.length; i++) {
    // Sama dengan InputLoader MindAR (luminance × 255).
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
  }
  return gray
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { errors } = await verifySet(parseSetArg())
    process.exit(errors.length > 0 ? 1 : 0)
  } catch (err) {
    console.error(`✗ ${err.message}`)
    process.exit(1)
  }
}
