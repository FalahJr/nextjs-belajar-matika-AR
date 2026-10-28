// Mengompilasi gambar target menjadi satu file .mind dengan compiler RESMI MindAR yang terpasang
// (mind-ar/src/image-target/offline-compiler.js — versi yang sama dengan runtime aplikasi).
//   npm run compile:targets                 (set "temporary")
//   npm run compile:targets -- --set wildan (setelah gambar & urutan dari Wildan diisi)
//
// Urutan kompilasi = urutan `targetIndex` di src/config/targets/<set>.json (file yang sama dibaca aplikasi).
// Selain .mind, ditulis catatan `<file>.mind.json` (urutan, sha256 gambar & .mind) untuk verifikasi.
// Tidak dijalankan otomatis oleh `dev`/`build`; jalankan ulang hanya ketika gambar target berubah.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { loadImage } from 'canvas'
import { loadManifest, loadMindAr, mindArVersion, parseSetArg, publicFile, rel, sha256 } from './lib.mjs'
import { verifySet } from './verify-targets.mjs'

async function main() {
  const setId = parseSetArg()
  const manifest = loadManifest(setId, { forCompile: true })
  const mindFile = publicFile(manifest.mindUrl)

  console.log(`Mengompilasi set "${setId}" (mind-ar ${mindArVersion()}) → ${rel(mindFile)}`)
  const images = []
  for (const t of manifest.targets) {
    const file = publicFile(t.image)
    const image = await loadImage(file)
    images.push(image)
    console.log(`  #${t.targetIndex} ${t.cardId} ← ${rel(file)} (${image.width}×${image.height})`)
  }

  const { OfflineCompiler } = await loadMindAr()
  const compiler = new OfflineCompiler()
  const started = Date.now()
  let lastShown = -10
  await compiler.compileImageTargets(images, (percent) => {
    if (percent - lastShown >= 10 || percent >= 100) {
      lastShown = Math.floor(percent / 10) * 10
      process.stdout.write(`  ${Math.min(100, percent).toFixed(0)}%`)
    }
  })
  const buffer = Buffer.from(compiler.exportData())
  console.log(`\n  selesai dalam ${((Date.now() - started) / 1000).toFixed(1)} dtk`)

  mkdirSync(dirname(mindFile), { recursive: true })
  writeFileSync(mindFile, buffer)
  const record = {
    note: 'Dibuat otomatis oleh `npm run compile:targets`. Jangan diedit manual.',
    set: setId,
    mindUrl: manifest.mindUrl,
    mindArVersion: mindArVersion(),
    compiledAt: new Date().toISOString(),
    mindBytes: buffer.length,
    mindSha256: sha256(mindFile),
    targets: manifest.targets.map((t, i) => ({
      targetIndex: t.targetIndex,
      cardId: t.cardId,
      image: t.image,
      width: images[i].width,
      height: images[i].height,
      sha256: sha256(publicFile(t.image)),
    })),
  }
  writeFileSync(`${mindFile}.json`, `${JSON.stringify(record, null, 2)}\n`)
  console.log(`✓ ${rel(mindFile)} (${(buffer.length / 1024).toFixed(0)} KB) + ${rel(`${mindFile}.json`)}`)

  const { errors } = await verifySet(setId)
  if (errors.length > 0) process.exit(1)
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`)
  process.exit(1)
})
