// Membuat 3 gambar KARTU TARGET SEMENTARA (PNG) + lembar cetak A4 (PDF).
//   npm run targets:generate
// Gambar digambar lokal dengan node-canvas dan PRNG ber-seed → hasil sama setiap dijalankan
// (di OS yang sama; font sistem berbeda bisa sedikit mengubah piksel → jalankan ulang compile:targets).
// Ini BUKAN desain kartu final; ganti dengan desain dari Wildan (lihat docs/ASET.md).
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createCanvas, loadImage } from 'canvas'
import { loadManifest, publicFile, rel, rng } from './lib.mjs'

const W = 1000
const H = 1400
const TAU = Math.PI * 2
const FONT = '"Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif'

// ---------------------------------------------------------------------------
// Primitif gambar
// ---------------------------------------------------------------------------

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

/** Gumpalan tak beraturan (untuk bercak sapi, daun, dll.). */
function blob(g, rand, cx, cy, r, points = 9, wobble = 0.45) {
  const pts = []
  for (let i = 0; i < points; i++) {
    const a = (i / points) * TAU
    const rr = r * (1 - wobble / 2 + rand() * wobble)
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  g.beginPath()
  for (let i = 0; i < points; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % points]
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    if (i === 0) g.moveTo(mx, my)
    else g.quadraticCurveTo(x1, y1, mx, my)
  }
  const [x1, y1] = pts[0]
  const [x2, y2] = pts[1]
  g.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2)
  g.closePath()
}

function star(g, cx, cy, r, spikes = 5, inner = 0.45, rot = 0) {
  g.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const rr = i % 2 === 0 ? r : r * inner
    const a = rot + (i / (spikes * 2)) * TAU - Math.PI / 2
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    if (i === 0) g.moveTo(x, y)
    else g.lineTo(x, y)
  }
  g.closePath()
}

function text(g, str, x, y, { size = 40, color = '#1e1b4b', align = 'center', weight = 'bold', stroke = null, strokeWidth = 8 } = {}) {
  g.font = `${weight} ${size}px ${FONT}`
  g.textAlign = align
  g.textBaseline = 'middle'
  if (stroke) {
    g.lineJoin = 'round'
    g.lineWidth = strokeWidth
    g.strokeStyle = stroke
    g.strokeText(str, x, y)
  }
  g.fillStyle = color
  g.fillText(str, x, y)
}

/** Pecahan bertumpuk (pembilang / garis / penyebut) di dalam lencana bulat. */
function fractionBadge(g, x, y, r, top, bottom, { fill = '#ffffff', ink = '#1e1b4b', ring = '#1e1b4b', whole = null } = {}) {
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fillStyle = fill
  g.fill()
  g.lineWidth = 8
  g.strokeStyle = ring
  g.stroke()
  const fx = whole ? x + r * 0.22 : x
  if (whole) text(g, whole, x - r * 0.38, y + 2, { size: r * 1.05, color: ink })
  text(g, top, fx, y - r * 0.38, { size: r * 0.62, color: ink })
  g.fillStyle = ink
  g.fillRect(fx - r * 0.3, y - 4, r * 0.6, 8)
  text(g, bottom, fx, y + r * 0.42, { size: r * 0.62, color: ink })
}

function tag(g, label, x, y, { fill, ink = '#1e1b4b', size = 50, angle = 0 }) {
  g.save()
  g.translate(x, y)
  g.rotate(angle)
  g.font = `bold ${size}px ${FONT}`
  const w = g.measureText(label).width + 44
  const h = size + 30
  roundRect(g, -w / 2, -h / 2, w, h, 20)
  g.fillStyle = fill
  g.fill()
  g.lineWidth = 6
  g.strokeStyle = ink
  g.stroke()
  text(g, label, 0, 2, { size, color: ink })
  g.restore()
}

// ---------------------------------------------------------------------------
// Kerangka kartu (identitas aplikasi + judul + catatan) — sengaja kecil agar ilustrasi mendominasi.
//
// PENTING untuk image tracking: MindAR cukup menemukan ±6 titik cocok untuk menyatakan sebuah target
// terdeteksi. Teks yang SAMA di semua kartu (nama aplikasi, catatan "sementara") di posisi yang sama
// membuat satu kartu bisa terbaca sebagai kartu lain (terbukti oleh validasi silang verify:targets).
// Karena itu blok bersama diberi tekstur latar khas tiap kartu dan posisinya dibedakan per kartu.
// ---------------------------------------------------------------------------

function background(g, color) {
  g.fillStyle = color
  g.fillRect(0, 0, W, H)
}

/** Tekstur acak khas kartu di dalam sebuah area (mengubah deskriptor fitur di sekitar huruf). */
function texture(g, rand, x, y, w, h, colors, count) {
  for (let i = 0; i < count; i++) {
    const px = x + rand() * w
    const py = y + rand() * h
    const s = 5 + rand() * 18
    g.fillStyle = colors[Math.floor(rand() * colors.length)]
    const kind = rand()
    g.beginPath()
    if (kind < 0.45) g.arc(px, py, s / 2, 0, TAU)
    else if (kind < 0.75) star(g, px, py, s * 0.6, 4 + Math.floor(rand() * 3), 0.5, rand() * TAU)
    else {
      g.save()
      g.translate(px, py)
      g.rotate(rand() * TAU)
      g.rect(-s / 2, -s / 4, s, s / 2)
      g.restore()
    }
    g.fill()
  }
}

/**
 * @param {object} o
 * @param {'top'|'bottom'} o.header  posisi pita identitas aplikasi
 * @param {'left'|'right'} o.logo    sisi logo di pita identitas
 * @param {'left'|'center'|'right'} o.note  posisi kotak catatan "sementara" (di sisi berlawanan dengan header)
 */
function chrome(g, { seed, number, kind, title, titleY, accent, tints, header, logo, note, cardId }) {
  const rand = rng(seed)

  // Pita identitas aplikasi
  const hy = header === 'top' ? 30 : H - 150
  g.save()
  roundRect(g, 30, hy, W - 60, 120, 28)
  g.fillStyle = accent
  g.fill()
  g.clip()
  texture(g, rand, 30, hy, W - 60, 120, tints, 90)
  g.restore()
  const lx = logo === 'left' ? 52 : W - 136
  g.fillStyle = '#4f46e5'
  roundRect(g, lx, hy + 18, 84, 84, 22)
  g.fill()
  g.lineWidth = 5
  g.strokeStyle = '#ffffff'
  g.stroke()
  text(g, '½', lx + 42, hy + 62, { size: 60, color: '#fcd34d' })
  const tx = logo === 'left' ? 160 : W - 160
  const align = logo === 'left' ? 'left' : 'right'
  const ink = { color: '#ffffff', align, stroke: '#1e1b4b', strokeWidth: 8 }
  text(g, 'BelajarMatika AR', tx, hy + 46, { size: 42, ...ink })
  text(g, `KARTU ${number} · ${kind}`, tx, hy + 92, { size: 26, ...ink, strokeWidth: 6 })

  // Judul materi
  text(g, title, W / 2, titleY, { size: 64, color: '#1e1b4b', stroke: '#ffffff', strokeWidth: 14 })

  // Catatan kartu sementara
  const nw = note === 'center' ? W - 60 : 640
  const nx = note === 'left' ? 30 : note === 'right' ? W - 30 - nw : 30
  const ny = header === 'top' ? H - 110 : 30
  g.save()
  roundRect(g, nx, ny, nw, 80, 24)
  g.fillStyle = '#ffffff'
  g.fill()
  g.clip()
  g.globalAlpha = 0.4
  texture(g, rand, nx, ny, nw, 80, tints, 50)
  g.restore()
  roundRect(g, nx, ny, nw, 80, 24)
  g.lineWidth = 5
  g.strokeStyle = accent
  g.stroke()
  text(g, 'KARTU TARGET SEMENTARA — bukan desain final', nx + nw / 2, ny + 28, {
    size: note === 'center' ? 26 : 23,
    color: '#1e1b4b',
    stroke: '#ffffff',
    strokeWidth: 5,
  })
  text(g, cardId, nx + nw / 2, ny + 60, { size: 22, color: '#334155', weight: 'normal', stroke: '#ffffff', strokeWidth: 5 })
}

// ---------------------------------------------------------------------------
// Kartu 1 — Pizza (Pecahan Biasa)
// ---------------------------------------------------------------------------

function drawPizzaCard(g) {
  const rand = rng(101)
  const accent = '#b91c1c'
  background(g, '#fff7ed')

  // Latar konfeti tak berulang (segitiga, lingkaran, bintang aneka warna)
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#0f172a']
  for (let i = 0; i < 230; i++) {
    const x = 40 + rand() * (W - 80)
    const y = 260 + rand() * 1010
    const s = 8 + rand() * 22
    g.fillStyle = colors[Math.floor(rand() * colors.length)]
    const kind = rand()
    if (kind < 0.35) {
      g.beginPath()
      g.arc(x, y, s / 2, 0, TAU)
      g.fill()
    } else if (kind < 0.7) {
      g.save()
      g.translate(x, y)
      g.rotate(rand() * TAU)
      g.beginPath()
      g.moveTo(0, -s / 2)
      g.lineTo(s / 2, s / 2)
      g.lineTo(-s / 2, s / 2)
      g.closePath()
      g.fill()
      g.restore()
    } else {
      star(g, x, y, s * 0.7, 5, 0.45, rand() * TAU)
      g.fill()
    }
  }

  // Papan kayu di bawah pizza
  g.save()
  g.beginPath()
  g.arc(500, 735, 395, 0, TAU)
  g.fillStyle = '#b45309'
  g.fill()
  g.lineWidth = 10
  g.strokeStyle = '#78350f'
  g.stroke()
  g.clip()
  g.strokeStyle = '#92400e'
  for (let i = 0; i < 26; i++) {
    g.lineWidth = 2 + rand() * 4
    g.beginPath()
    const y = 340 + i * 31 + rand() * 12
    g.moveTo(80, y)
    g.bezierCurveTo(300, y + rand() * 30 - 15, 700, y + rand() * 30 - 15, 920, y + rand() * 20 - 10)
    g.stroke()
  }
  g.restore()

  // 8 potong pizza; potong ke-0 digeser keluar
  const cx = 500
  const cy = 735
  const R = 330
  for (let k = 0; k < 8; k++) {
    const a0 = -Math.PI / 2 + (k * TAU) / 8
    const a1 = a0 + TAU / 8
    const mid = (a0 + a1) / 2
    const off = k === 0 ? 46 : 0
    g.save()
    g.translate(cx + Math.cos(mid) * off, cy + Math.sin(mid) * off)
    const wedge = () => {
      g.beginPath()
      g.moveTo(0, 0)
      g.arc(0, 0, R, a0, a1)
      g.closePath()
    }
    wedge()
    g.fillStyle = '#d97706'
    g.fill()
    g.beginPath()
    g.moveTo(0, 0)
    g.arc(0, 0, R - 38, a0, a1)
    g.closePath()
    g.fillStyle = '#fbbf24'
    g.fill()
    // Saus tomat tidak rata di tepi keju
    g.save()
    wedge()
    g.clip()
    for (let i = 0; i < 6; i++) {
      const a = a0 + rand() * (a1 - a0)
      const r = R - 70 + rand() * 30
      blob(g, rand, Math.cos(a) * r, Math.sin(a) * r, 16 + rand() * 12, 7, 0.6)
      g.fillStyle = '#dc2626'
      g.fill()
    }
    // Topping acak: pepperoni, zaitun, paprika, jamur
    for (let i = 0; i < 9; i++) {
      const a = a0 + 0.08 + rand() * (a1 - a0 - 0.16)
      const r = 50 + rand() * (R - 110)
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      const t = rand()
      if (t < 0.4) {
        g.beginPath()
        g.arc(x, y, 22 + rand() * 8, 0, TAU)
        g.fillStyle = '#b91c1c'
        g.fill()
        g.fillStyle = '#7f1d1d'
        for (let d = 0; d < 4; d++) {
          g.beginPath()
          g.arc(x + rand() * 24 - 12, y + rand() * 24 - 12, 3 + rand() * 2, 0, TAU)
          g.fill()
        }
      } else if (t < 0.65) {
        g.beginPath()
        g.arc(x, y, 12, 0, TAU)
        g.lineWidth = 8
        g.strokeStyle = '#111827'
        g.stroke()
      } else if (t < 0.85) {
        g.beginPath()
        g.arc(x, y, 16, rand() * TAU, rand() * TAU + Math.PI)
        g.lineWidth = 9
        g.strokeStyle = '#15803d'
        g.stroke()
      } else {
        g.beginPath()
        g.arc(x, y, 15, Math.PI, 0)
        g.fillStyle = '#e7e5e4'
        g.fill()
        g.fillStyle = '#a8a29e'
        g.fillRect(x - 5, y, 10, 14)
      }
    }
    g.restore()
    wedge()
    g.lineWidth = 6
    g.strokeStyle = '#7c2d12'
    g.stroke()
    g.restore()
  }

  fractionBadge(g, 845, 1095, 92, '3', '8', { fill: '#fef08a', ring: accent })
  tag(g, '1 dari 8 potong', 760, 300, { fill: '#ffffff', size: 40, angle: 0.08 })
  chrome(g, {
    seed: 111,
    number: '01',
    kind: 'PIZZA',
    title: 'Pecahan Biasa',
    titleY: 205,
    accent,
    tints: ['#fca5a5', '#7f1d1d', '#fde68a', '#f97316'],
    header: 'top',
    logo: 'left',
    note: 'right',
    cardId: 'pizza-pecahan-biasa',
  })
}

// ---------------------------------------------------------------------------
// Kartu 2 — Susu (Pecahan Campuran)
// ---------------------------------------------------------------------------

function bottle(g, x, y, w, h, level, rand) {
  const neck = w * 0.42
  const shape = () => {
    g.beginPath()
    g.moveTo(x - neck / 2, y)
    g.lineTo(x + neck / 2, y)
    g.lineTo(x + neck / 2, y + h * 0.16)
    g.quadraticCurveTo(x + w / 2, y + h * 0.22, x + w / 2, y + h * 0.34)
    g.lineTo(x + w / 2, y + h - 30)
    g.quadraticCurveTo(x + w / 2, y + h, x + w / 2 - 30, y + h)
    g.lineTo(x - w / 2 + 30, y + h)
    g.quadraticCurveTo(x - w / 2, y + h, x - w / 2, y + h - 30)
    g.lineTo(x - w / 2, y + h * 0.34)
    g.quadraticCurveTo(x - w / 2, y + h * 0.22, x - neck / 2, y + h * 0.16)
    g.closePath()
  }
  shape()
  g.fillStyle = '#dbeafe'
  g.fill()
  g.save()
  shape()
  g.clip()
  const top = y + h - h * 0.66 * level
  g.fillStyle = '#ffffff'
  g.fillRect(x - w, top, w * 2, h)
  g.beginPath()
  for (let i = 0; i <= 10; i++) g.lineTo(x - w / 2 + (i * w) / 10, top + (i % 2 ? 8 : -8))
  g.lineTo(x + w / 2, top + 20)
  g.lineTo(x - w / 2, top + 20)
  g.fillStyle = '#ffffff'
  g.fill()
  // Gelembung/kilau
  for (let i = 0; i < 7; i++) {
    g.beginPath()
    g.arc(x - w / 3 + rand() * w * 0.66, top + 30 + rand() * (y + h - top - 60), 5 + rand() * 8, 0, TAU)
    g.fillStyle = '#bfdbfe'
    g.fill()
  }
  g.restore()
  shape()
  g.lineWidth = 9
  g.strokeStyle = '#1e3a8a'
  g.stroke()
  // Tutup botol
  g.fillStyle = '#2563eb'
  roundRect(g, x - neck / 2 - 10, y - 34, neck + 20, 40, 10)
  g.fill()
  g.strokeStyle = '#1e3a8a'
  g.lineWidth = 6
  g.stroke()
  // Garis takaran
  g.strokeStyle = '#1e3a8a'
  g.lineWidth = 5
  for (let i = 1; i < 4; i++) {
    const ly = y + h - (h * 0.66 * i) / 4
    g.beginPath()
    g.moveTo(x + w / 2 - 34, ly)
    g.lineTo(x + w / 2 - 6, ly)
    g.stroke()
  }
}

function drawMilkCard(g) {
  const rand = rng(202)
  const accent = '#3b82f6'
  background(g, '#ffffff')

  // Langit + matahari
  const sky = g.createLinearGradient(0, 250, 0, 900)
  sky.addColorStop(0, '#bae6fd')
  sky.addColorStop(1, '#e0f2fe')
  g.fillStyle = sky
  g.fillRect(30, 250, W - 60, 700)
  g.fillStyle = '#facc15'
  g.beginPath()
  g.arc(840, 360, 70, 0, TAU)
  g.fill()
  g.strokeStyle = '#f59e0b'
  g.lineWidth = 9
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + 0.1
    const r1 = 88
    const r2 = 112 + (i % 2) * 18
    g.beginPath()
    g.moveTo(840 + Math.cos(a) * r1, 360 + Math.sin(a) * r1)
    g.lineTo(840 + Math.cos(a) * r2, 360 + Math.sin(a) * r2)
    g.stroke()
  }
  // Awan
  for (const [cx, cy] of [[190, 330], [470, 300]]) {
    g.fillStyle = '#ffffff'
    for (let i = 0; i < 5; i++) {
      g.beginPath()
      g.arc(cx + i * 34 - 68, cy + (i % 2) * -18, 34 + rand() * 12, 0, TAU)
      g.fill()
    }
  }

  // Bukit + padang rumput dengan bercak sapi (pola tak beraturan, kontras tinggi)
  g.save()
  g.beginPath()
  g.moveTo(30, 820)
  g.bezierCurveTo(260, 700, 520, 860, 760, 760)
  g.bezierCurveTo(860, 720, 930, 760, W - 30, 740)
  g.lineTo(W - 30, 1280)
  g.lineTo(30, 1280)
  g.closePath()
  g.fillStyle = '#4ade80'
  g.fill()
  g.clip()
  for (let i = 0; i < 420; i++) {
    const x = 30 + rand() * (W - 60)
    const y = 720 + rand() * 560
    const h = 14 + rand() * 26
    g.strokeStyle = rand() < 0.5 ? '#15803d' : '#166534'
    g.lineWidth = 3 + rand() * 3
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + rand() * 16 - 8, y - h / 2, x + rand() * 20 - 10, y - h)
    g.stroke()
  }
  // Bunga kecil
  for (let i = 0; i < 40; i++) {
    const x = 50 + rand() * (W - 100)
    const y = 800 + rand() * 460
    g.fillStyle = ['#f472b6', '#fde047', '#ffffff', '#a78bfa'][i % 4]
    for (let p = 0; p < 5; p++) {
      g.beginPath()
      g.arc(x + Math.cos((p / 5) * TAU) * 9, y + Math.sin((p / 5) * TAU) * 9, 7, 0, TAU)
      g.fill()
    }
    g.fillStyle = '#ea580c'
    g.beginPath()
    g.arc(x, y, 5, 0, TAU)
    g.fill()
  }
  g.restore()

  // Alas bercorak sapi di bawah botol
  g.save()
  roundRect(g, 90, 1000, 820, 200, 40)
  g.fillStyle = '#ffffff'
  g.fill()
  g.clip()
  for (let i = 0; i < 22; i++) {
    blob(g, rand, 100 + rand() * 800, 1000 + rand() * 200, 18 + rand() * 38, 10, 0.7)
    g.fillStyle = '#111827'
    g.fill()
  }
  g.restore()
  roundRect(g, 90, 1000, 820, 200, 40)
  g.lineWidth = 8
  g.strokeStyle = '#111827'
  g.stroke()

  // Botol 1 liter (penuh) + botol ½ liter (setengah)
  bottle(g, 290, 520, 230, 520, 1, rand)
  bottle(g, 600, 640, 200, 400, 0.5, rand)
  tag(g, '1 liter', 290, 425, { fill: '#fde68a', size: 38, angle: -0.05 })
  tag(g, '½ liter', 600, 545, { fill: '#fde68a', size: 38, angle: 0.05 })

  // Gelas kecil
  g.save()
  g.beginPath()
  g.moveTo(780, 860)
  g.lineTo(890, 860)
  g.lineTo(875, 1060)
  g.lineTo(795, 1060)
  g.closePath()
  g.fillStyle = '#e0f2fe'
  g.fill()
  g.clip()
  g.fillStyle = '#ffffff'
  g.fillRect(770, 930, 140, 140)
  g.restore()
  g.beginPath()
  g.moveTo(780, 860)
  g.lineTo(890, 860)
  g.lineTo(875, 1060)
  g.lineTo(795, 1060)
  g.closePath()
  g.lineWidth = 7
  g.strokeStyle = '#1e3a8a'
  g.stroke()

  fractionBadge(g, 820, 590, 105, '1', '2', { fill: '#ffffff', ring: accent, whole: '1' })
  chrome(g, {
    seed: 222,
    number: '02',
    kind: 'SUSU',
    title: 'Pecahan Campuran',
    titleY: 180,
    accent,
    tints: ['#bfdbfe', '#1e3a8a', '#ffffff', '#111827'],
    header: 'bottom',
    logo: 'right',
    note: 'center',
    cardId: 'susu-pecahan-campuran',
  })
}

// ---------------------------------------------------------------------------
// Kartu 3 — Piring buah (Pecahan Menjadi Desimal)
// ---------------------------------------------------------------------------

function orangeHalf(g, x, y, r, rot) {
  g.save()
  g.translate(x, y)
  g.rotate(rot)
  g.beginPath()
  g.arc(0, 0, r, 0, TAU)
  g.fillStyle = '#ea580c'
  g.fill()
  g.beginPath()
  g.arc(0, 0, r - 10, 0, TAU)
  g.fillStyle = '#fdba74'
  g.fill()
  for (let i = 0; i < 9; i++) {
    const a0 = (i / 9) * TAU + 0.06
    const a1 = ((i + 1) / 9) * TAU - 0.06
    g.beginPath()
    g.moveTo(0, 0)
    g.arc(0, 0, r - 18, a0, a1)
    g.closePath()
    g.fillStyle = '#fb923c'
    g.fill()
  }
  g.beginPath()
  g.arc(0, 0, 9, 0, TAU)
  g.fillStyle = '#fff7ed'
  g.fill()
  g.restore()
}

function strawberry(g, rand, x, y, s, rot) {
  g.save()
  g.translate(x, y)
  g.rotate(rot)
  g.beginPath()
  g.moveTo(0, s)
  g.bezierCurveTo(-s * 1.1, s * 0.2, -s * 0.9, -s * 0.8, 0, -s * 0.7)
  g.bezierCurveTo(s * 0.9, -s * 0.8, s * 1.1, s * 0.2, 0, s)
  g.fillStyle = '#e11d48'
  g.fill()
  g.lineWidth = 4
  g.strokeStyle = '#881337'
  g.stroke()
  g.fillStyle = '#fde047'
  for (let i = 0; i < 12; i++) {
    g.beginPath()
    g.ellipse(rand() * s * 1.0 - s * 0.5, rand() * s * 1.2 - s * 0.5, 3, 5, rand(), 0, TAU)
    g.fill()
  }
  g.fillStyle = '#16a34a'
  star(g, 0, -s * 0.72, s * 0.5, 6, 0.35)
  g.fill()
  g.restore()
}

function kiwi(g, rand, x, y, r) {
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fillStyle = '#78350f'
  g.fill()
  g.beginPath()
  g.arc(x, y, r - 8, 0, TAU)
  g.fillStyle = '#84cc16'
  g.fill()
  g.beginPath()
  g.arc(x, y, r * 0.35, 0, TAU)
  g.fillStyle = '#fefce8'
  g.fill()
  g.fillStyle = '#1c1917'
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU + rand() * 0.15
    const rr = r * 0.45 + rand() * 6
    g.beginPath()
    g.ellipse(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 3, 6, a, 0, TAU)
    g.fill()
  }
}

function drawFruitCard(g) {
  const rand = rng(303)
  const accent = '#047857'
  background(g, '#fefce8')

  // Taplak meja dengan daun & titik acak
  for (let i = 0; i < 140; i++) {
    const x = 40 + rand() * (W - 80)
    const y = 260 + rand() * 1010
    g.save()
    g.translate(x, y)
    g.rotate(rand() * TAU)
    if (rand() < 0.55) {
      g.beginPath()
      g.ellipse(0, 0, 10 + rand() * 18, 5 + rand() * 7, 0, 0, TAU)
      g.fillStyle = ['#65a30d', '#16a34a', '#0d9488'][i % 3]
      g.fill()
      g.strokeStyle = '#14532d'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(-14, 0)
      g.lineTo(14, 0)
      g.stroke()
    } else {
      g.beginPath()
      g.arc(0, 0, 4 + rand() * 7, 0, TAU)
      g.fillStyle = ['#f97316', '#e11d48', '#7c3aed', '#0284c7'][i % 4]
      g.fill()
    }
    g.restore()
  }

  // Piring
  const cx = 500
  const cy = 745
  g.beginPath()
  g.arc(cx + 10, cy + 16, 385, 0, TAU)
  g.fillStyle = '#00000022'
  g.fill()
  g.beginPath()
  g.arc(cx, cy, 380, 0, TAU)
  g.fillStyle = '#ffffff'
  g.fill()
  g.lineWidth = 8
  g.strokeStyle = '#334155'
  g.stroke()
  // Hiasan tepi piring: titik biru tidak seragam
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * TAU + rand() * 0.04
    const r = 350 + rand() * 8
    g.beginPath()
    g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5 + (i % 3) * 3, 0, TAU)
    g.fillStyle = i % 5 === 0 ? '#dc2626' : '#1d4ed8'
    g.fill()
  }
  g.beginPath()
  g.arc(cx, cy, 322, 0, TAU)
  g.lineWidth = 4
  g.strokeStyle = '#94a3b8'
  g.stroke()

  // Pisang (bulan sabit) dengan ujung cokelat
  g.save()
  g.translate(cx - 90, cy + 175)
  g.rotate(-0.12)
  g.beginPath()
  g.moveTo(-165, -10)
  g.quadraticCurveTo(0, 150, 165, -10)
  g.quadraticCurveTo(0, 60, -165, -10)
  g.closePath()
  g.fillStyle = '#facc15'
  g.fill()
  g.lineWidth = 6
  g.strokeStyle = '#854d0e'
  g.stroke()
  g.beginPath()
  g.moveTo(-120, 18)
  g.quadraticCurveTo(0, 105, 120, 18)
  g.lineWidth = 3
  g.strokeStyle = '#ca8a04'
  g.stroke()
  g.fillStyle = '#422006'
  for (const x of [-165, 165]) {
    g.beginPath()
    g.arc(x, -10, 9, 0, TAU)
    g.fill()
  }
  g.restore()

  // Blueberry di tengah piring
  for (let i = 0; i < 9; i++) {
    const a = rand() * TAU
    const r = rand() * 55
    const x = cx + 30 + Math.cos(a) * r
    const y = cy + 45 + Math.sin(a) * r
    g.beginPath()
    g.arc(x, y, 17, 0, TAU)
    g.fillStyle = '#1e40af'
    g.fill()
    g.lineWidth = 3
    g.strokeStyle = '#172554'
    g.stroke()
    star(g, x, y - 4, 6, 5, 0.4, rand())
    g.fillStyle = '#93c5fd'
    g.fill()
  }

  // Buah-buahan
  orangeHalf(g, cx - 160, cy - 140, 105, 0.3)
  orangeHalf(g, cx + 30, cy - 205, 82, 1.1)
  kiwi(g, rand, cx + 190, cy - 60, 88)
  kiwi(g, rand, cx + 140, cy + 130, 62)
  for (const [x, y, s, r] of [[cx - 230, cy + 60, 52, -0.4], [cx - 120, cy + 10, 46, 0.3], [cx - 40, cy - 30, 40, -0.1]]) {
    strawberry(g, rand, x, y, s, r)
  }
  // Anggur
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(Math.sqrt(i * 2))
    const x = cx + 230 - row * 8 + (i % 4) * 34 - 50 + rand() * 6
    const y = cy + 90 + row * 30 + rand() * 6
    g.beginPath()
    g.arc(x - 60, y - 290, 22, 0, TAU)
    g.fillStyle = i % 3 === 0 ? '#6d28d9' : '#7c3aed'
    g.fill()
    g.lineWidth = 3
    g.strokeStyle = '#3b0764'
    g.stroke()
    g.beginPath()
    g.arc(x - 66, y - 297, 6, 0, TAU)
    g.fillStyle = '#ddd6fe'
    g.fill()
  }

  tag(g, '½ = 0,5', 230, 1185, { fill: '#fef08a', size: 46, angle: -0.06 })
  tag(g, '¼ = 0,25', 760, 1185, { fill: '#bbf7d0', size: 46, angle: 0.05 })
  chrome(g, {
    seed: 333,
    number: '03',
    kind: 'BUAH',
    title: 'Pecahan → Desimal',
    titleY: 205,
    accent,
    tints: ['#a7f3d0', '#064e3b', '#fef08a', '#e11d48'],
    header: 'top',
    logo: 'right',
    note: 'left',
    cardId: 'piring-buah-desimal',
  })
}

// ---------------------------------------------------------------------------
// Kartu 4 — Jajanan pasar (Pecahan Menjadi Persen)
// ---------------------------------------------------------------------------

function percentBadge(g, x, y, r, pct, color, label) {
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fillStyle = '#ffffff'
  g.fill()
  g.beginPath()
  g.moveTo(x, y)
  g.arc(x, y, r - 10, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * TAU)
  g.closePath()
  g.fillStyle = color
  g.fill()
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.lineWidth = 8
  g.strokeStyle = '#1e1b4b'
  g.stroke()
  text(g, label, x, y + 4, { size: r * 0.62, color: '#1e1b4b', stroke: '#ffffff', strokeWidth: 10 })
}

function klepon(g, rand, x, y, r) {
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fillStyle = '#4d7c0f'
  g.fill()
  g.beginPath()
  g.arc(x, y, r - 7, 0, TAU)
  g.fillStyle = '#84cc16'
  g.fill()
  g.fillStyle = '#ffffff'
  for (let i = 0; i < 16; i++) {
    const a = rand() * TAU
    const d = rand() * (r - 14)
    g.beginPath()
    g.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 4 + rand() * 4, 3 + rand() * 3, rand() * TAU, 0, TAU)
    g.fill()
  }
}

function ondeOnde(g, rand, x, y, r) {
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fillStyle = '#7c2d12'
  g.fill()
  g.beginPath()
  g.arc(x, y, r - 6, 0, TAU)
  g.fillStyle = '#d97706'
  g.fill()
  g.fillStyle = '#fffbeb'
  for (let i = 0; i < 26; i++) {
    const a = rand() * TAU
    const d = rand() * (r - 12)
    g.beginPath()
    g.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 3.5, 2.2, rand() * TAU, 0, TAU)
    g.fill()
  }
}

function kueLapis(g, x, y, w, h, angle) {
  g.save()
  g.translate(x, y)
  g.rotate(angle)
  const bands = 9
  const bh = h / bands
  for (let i = 0; i < bands; i++) {
    g.fillStyle = ['#f472b6', '#fff1f2', '#be185d'][i % 3]
    g.fillRect(-w / 2, -h / 2 + i * bh, w, bh + 1)
  }
  g.lineWidth = 7
  g.strokeStyle = '#500724'
  g.strokeRect(-w / 2, -h / 2, w, h)
  g.restore()
}

function drawSnackCard(g) {
  const rand = rng(404)
  const accent = '#6d28d9'

  // Daun pisang: gradasi hijau + urat daun miring acak
  const leaf = g.createLinearGradient(0, 0, W, H)
  leaf.addColorStop(0, '#14532d')
  leaf.addColorStop(1, '#65a30d')
  g.fillStyle = leaf
  g.fillRect(0, 0, W, H)
  for (let i = 0; i < 120; i++) {
    const x = rand() * W
    const y = rand() * H
    const len = 120 + rand() * 330
    const a = -0.55 + rand() * 0.3
    g.strokeStyle = rand() < 0.5 ? 'rgba(220,252,231,0.30)' : 'rgba(6,78,59,0.35)'
    g.lineWidth = 2 + rand() * 6
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5 + rand() * 30, x + Math.cos(a) * len, y + Math.sin(a) * len)
    g.stroke()
  }
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(254,240,138,${0.12 + rand() * 0.2})`
    blob(g, rand, rand() * W, rand() * H, 14 + rand() * 26, 8, 0.6)
    g.fill()
  }

  // Tampah anyaman bambu
  const cx = 500
  const cy = 735
  g.beginPath()
  g.arc(cx + 12, cy + 18, 372, 0, TAU)
  g.fillStyle = 'rgba(0,0,0,0.28)'
  g.fill()
  g.beginPath()
  g.arc(cx, cy, 368, 0, TAU)
  g.fillStyle = '#e8c27c'
  g.fill()
  g.save()
  g.beginPath()
  g.arc(cx, cy, 366, 0, TAU)
  g.clip()
  for (let r = 350; r > 15; r -= 20) {
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.lineWidth = 8 + rand() * 6
    g.strokeStyle = rand() < 0.5 ? '#b8803a' : '#d6a560'
    g.stroke()
  }
  for (let i = 0; i < 44; i++) {
    const a = rand() * TAU
    g.strokeStyle = `rgba(120,70,20,${0.25 + rand() * 0.35})`
    g.lineWidth = 2 + rand() * 4
    g.beginPath()
    g.moveTo(cx, cy)
    g.lineTo(cx + Math.cos(a) * 370, cy + Math.sin(a) * 370)
    g.stroke()
  }
  g.restore()
  g.beginPath()
  g.arc(cx, cy, 368, 0, TAU)
  g.lineWidth = 18
  g.strokeStyle = '#7c4a1e'
  g.stroke()

  // Daun pandan alas jajanan
  g.save()
  g.beginPath()
  g.arc(cx, cy, 300, 0, TAU)
  g.fillStyle = '#166534'
  g.fill()
  g.restore()

  kueLapis(g, 500, 560, 330, 170, -0.1)
  for (const [x, y] of [[300, 790], [380, 860], [450, 780], [340, 710], [250, 870], [430, 930]]) klepon(g, rand, x, y, 52)
  for (const [x, y] of [[620, 800], [700, 870], [570, 900], [680, 760], [640, 960]]) ondeOnde(g, rand, x, y, 50)
  tag(g, 'kue lapis', 500, 440, { fill: '#fbcfe8', size: 34, angle: 0.04 })

  percentBadge(g, 838, 345, 98, 50, '#f59e0b', '50%')
  percentBadge(g, 165, 1115, 92, 25, '#10b981', '25%')
  tag(g, '½ = 50%', 838, 480, { fill: '#fef08a', size: 34, angle: -0.05 })
  tag(g, '¼ = 25%', 300, 1170, { fill: '#a7f3d0', size: 34, angle: 0.05 })

  chrome(g, {
    seed: 444,
    number: '04',
    kind: 'JAJANAN',
    title: 'Pecahan → Persen',
    titleY: 185,
    accent,
    tints: ['#ddd6fe', '#2e1065', '#fde68a', '#f472b6'],
    header: 'bottom',
    logo: 'left',
    note: 'right',
    cardId: 'jajanan-ubah-persen',
  })
}

// ---------------------------------------------------------------------------
// Kartu 5 — Pizza berurutan (Mengurutkan Pecahan)
// ---------------------------------------------------------------------------

/** Pizza dibagi 4; `shown` potong digambar penuh, sisanya hanya garis putus-putus. */
function quarterPizza(g, rand, cx, cy, R, shown) {
  for (let k = 0; k < 4; k++) {
    const a0 = -Math.PI / 2 + (k * TAU) / 4
    const a1 = a0 + TAU / 4
    g.beginPath()
    g.moveTo(cx, cy)
    g.arc(cx, cy, R, a0, a1)
    g.closePath()
    if (k < shown) {
      g.fillStyle = '#c2410c'
      g.fill()
      g.beginPath()
      g.moveTo(cx, cy)
      g.arc(cx, cy, R - 16, a0, a1)
      g.closePath()
      g.fillStyle = '#fde047'
      g.fill()
      for (let i = 0; i < 3; i++) {
        const a = a0 + 0.2 + rand() * (a1 - a0 - 0.4)
        const d = R * (0.3 + rand() * 0.45)
        g.beginPath()
        g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 13, 0, TAU)
        g.fillStyle = i === 1 ? '#15803d' : '#b91c1c'
        g.fill()
      }
      g.lineWidth = 4
      g.strokeStyle = '#7c2d12'
      g.stroke()
    } else {
      g.fillStyle = 'rgba(255,255,255,0.12)'
      g.fill()
      g.setLineDash([10, 9])
      g.lineWidth = 4
      g.strokeStyle = '#fef3c7'
      g.stroke()
      g.setLineDash([])
    }
  }
}

function drawSortPizzaCard(g) {
  const rand = rng(505)
  const accent = '#a16207'

  // Meja kayu gelap dengan serat acak, remah tepung, basil, dan irisan tomat
  g.fillStyle = '#5b3a1a'
  g.fillRect(0, 0, W, H)
  for (let i = 0; i < 90; i++) {
    const y = rand() * H
    g.strokeStyle = rand() < 0.5 ? 'rgba(254,215,170,0.18)' : 'rgba(30,15,5,0.4)'
    g.lineWidth = 2 + rand() * 7
    g.beginPath()
    g.moveTo(0, y)
    g.bezierCurveTo(250, y + rand() * 60 - 30, 700, y + rand() * 60 - 30, W, y + rand() * 40 - 20)
    g.stroke()
  }
  for (let i = 0; i < 160; i++) {
    g.fillStyle = `rgba(255,251,235,${0.2 + rand() * 0.5})`
    g.beginPath()
    g.arc(rand() * W, 250 + rand() * 1000, 1.5 + rand() * 5, 0, TAU)
    g.fill()
  }
  for (let i = 0; i < 22; i++) {
    g.save()
    g.translate(40 + rand() * (W - 80), 270 + rand() * 980)
    g.rotate(rand() * TAU)
    g.beginPath()
    g.ellipse(0, 0, 16 + rand() * 12, 8 + rand() * 6, 0, 0, TAU)
    g.fillStyle = '#16a34a'
    g.fill()
    g.restore()
  }
  for (let i = 0; i < 9; i++) {
    const x = 60 + rand() * (W - 120)
    const y = 280 + rand() * 960
    g.beginPath()
    g.arc(x, y, 20 + rand() * 8, 0, TAU)
    g.fillStyle = '#dc2626'
    g.fill()
    g.beginPath()
    g.arc(x, y, 9, 0, TAU)
    g.fillStyle = '#fecaca'
    g.fill()
  }

  // Tiga baris: pizza utuh (1) + pizza terbagi 4 dengan 1, 2, atau 3 potong → 1¼ < 1½ < 1¾
  const rows = [
    { y: 440, shown: 1, whole: '1', top: '1', bottom: '4' },
    { y: 760, shown: 2, whole: '1', top: '1', bottom: '2' },
    { y: 1080, shown: 3, whole: '1', top: '3', bottom: '4' },
  ]
  rows.forEach((row, i) => {
    g.fillStyle = 'rgba(255,251,235,0.9)'
    roundRect(g, 60, row.y - 140, W - 120, 280, 40)
    g.fill()
    g.lineWidth = 6
    g.strokeStyle = '#7c2d12'
    g.stroke()
    quarterPizza(g, rand, 245, row.y, 112, 4)
    g.beginPath()
    g.arc(245, row.y, 124, 0, TAU)
    g.lineWidth = 6
    g.strokeStyle = '#78350f'
    g.stroke()
    text(g, '+', 400, row.y, { size: 70, color: '#7c2d12' })
    quarterPizza(g, rand, 555, row.y, 112, row.shown)
    fractionBadge(g, 830, row.y, 84, row.top, row.bottom, { fill: '#fde68a', ring: accent, whole: row.whole })
    if (i < rows.length - 1) {
      g.save()
      g.translate(830, row.y + 160)
      g.beginPath()
      g.moveTo(-30, 0)
      g.lineTo(30, 0)
      g.lineTo(0, 34)
      g.closePath()
      g.fillStyle = '#fef3c7'
      g.fill()
      g.lineWidth = 5
      g.strokeStyle = '#7c2d12'
      g.stroke()
      g.restore()
    }
  })
  tag(g, 'kecil → besar', 270, 280, { fill: '#fef08a', size: 36, angle: -0.04 })

  chrome(g, {
    seed: 555,
    number: '05',
    kind: 'PIZZA',
    title: 'Mengurutkan Pecahan',
    titleY: 205,
    accent,
    tints: ['#fde68a', '#451a03', '#fb923c', '#fef3c7'],
    header: 'top',
    logo: 'left',
    note: 'center',
    cardId: 'pizza-urut-campuran',
  })
}

// ---------------------------------------------------------------------------
// Kartu 6 — Kue dalam kotak (Operasi Hitung Pecahan)
// ---------------------------------------------------------------------------

const PASTELS = ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fde68a', '#ddd6fe', '#fed7aa']

function mochi(g, rand, x, y, r) {
  const color = PASTELS[Math.floor(rand() * PASTELS.length)]
  g.beginPath()
  g.ellipse(x, y + r * 0.25, r, r * 0.85, 0, 0, TAU)
  g.fillStyle = 'rgba(0,0,0,0.15)'
  g.fill()
  g.beginPath()
  g.moveTo(x - r, y + r * 0.3)
  g.bezierCurveTo(x - r, y - r * 1.1, x + r, y - r * 1.1, x + r, y + r * 0.3)
  g.bezierCurveTo(x + r, y + r * 0.85, x - r, y + r * 0.85, x - r, y + r * 0.3)
  g.fillStyle = color
  g.fill()
  g.lineWidth = 4
  g.strokeStyle = '#831843'
  g.stroke()
  g.fillStyle = '#831843'
  g.beginPath()
  g.arc(x - r * 0.35, y + r * 0.05, 4.5, 0, TAU)
  g.arc(x + r * 0.35, y + r * 0.05, 4.5, 0, TAU)
  g.fill()
  g.beginPath()
  g.arc(x, y + r * 0.22, r * 0.18, 0.1 * Math.PI, 0.9 * Math.PI)
  g.lineWidth = 3
  g.stroke()
  g.fillStyle = rand() < 0.5 ? '#f43f5e' : '#fb923c'
  for (let i = 0; i < 3; i++) {
    g.beginPath()
    g.arc(x - r * 0.5 + rand() * r, y - r * 0.55 + rand() * r * 0.25, 3 + rand() * 2, 0, TAU)
    g.fill()
  }
}

function drawCakeCard(g) {
  const rand = rng(606)
  const accent = '#be185d'

  // Latar pastel dengan taburan sprinkle acak
  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#fdf2f8')
  bg.addColorStop(1, '#ecfeff')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  const sprinkle = ['#f43f5e', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#14b8a6']
  for (let i = 0; i < 520; i++) {
    g.save()
    g.translate(rand() * W, 240 + rand() * 1000)
    g.rotate(rand() * TAU)
    g.fillStyle = sprinkle[Math.floor(rand() * sprinkle.length)]
    roundRect(g, -10, -3.5, 20, 7, 3.5)
    g.fill()
    g.restore()
  }

  // Enam kotak kue (3 × 2), masing-masing 4 mochi → 24 kue
  const cols = [105, 390, 675]
  const rowsY = [300, 810]
  let n = 0
  for (const by of rowsY) {
    for (const bx of cols) {
      const lid = PASTELS[(n * 2 + 1) % PASTELS.length]
      g.fillStyle = 'rgba(0,0,0,0.12)'
      roundRect(g, bx + 8, by + 12, 250, 330, 30)
      g.fill()
      g.fillStyle = '#fffbeb'
      roundRect(g, bx, by, 250, 330, 30)
      g.fill()
      g.lineWidth = 7
      g.strokeStyle = '#831843'
      g.stroke()
      g.fillStyle = lid
      roundRect(g, bx, by, 250, 66, 30)
      g.fill()
      g.strokeStyle = '#831843'
      g.stroke()
      text(g, `kotak ${n + 1}`, bx + 125, by + 34, { size: 30, color: '#831843' })
      for (let c = 0; c < 4; c++) {
        mochi(g, rand, bx + 70 + (c % 2) * 110, by + 140 + Math.floor(c / 2) * 110, 40)
      }
      n++
    }
  }

  // Lambang operasi hitung di antara dua baris kotak
  const ops = [['+', '#f43f5e'], ['−', '#3b82f6'], ['×', '#16a34a'], ['÷', '#d97706']]
  ops.forEach(([sym, color], i) => {
    const x = 190 + i * 207
    g.beginPath()
    g.arc(x, 725, 52, 0, TAU)
    g.fillStyle = color
    g.fill()
    g.lineWidth = 7
    g.strokeStyle = '#ffffff'
    g.stroke()
    text(g, sym, x, 728, { size: 70, color: '#ffffff', stroke: '#1e1b4b', strokeWidth: 8 })
  })
  tag(g, '24 ÷ 6 = 4', 500, 1190, { fill: '#fde68a', size: 44, angle: -0.03 })

  chrome(g, {
    seed: 666,
    number: '06',
    kind: 'KUE',
    title: 'Operasi Hitung',
    titleY: 185,
    accent,
    tints: ['#fbcfe8', '#500724', '#a7f3d0', '#fde047'],
    header: 'bottom',
    logo: 'right',
    note: 'left',
    cardId: 'kue-operasi-hitung',
  })
}

// ---------------------------------------------------------------------------

const DRAWERS = {
  'pizza-pecahan-biasa': drawPizzaCard,
  'susu-pecahan-campuran': drawMilkCard,
  'piring-buah-desimal': drawFruitCard,
  'jajanan-ubah-persen': drawSnackCard,
  'pizza-urut-campuran': drawSortPizzaCard,
  'kue-operasi-hitung': drawCakeCard,
}

/** Lembar A4 PDF: kartu ukuran fisik 9 × 12,6 cm (4 per halaman), garis potong putus-putus. */
async function writePrintSheet(files, outFile) {
  const PT_PER_CM = 72 / 2.54
  const A4 = [21 * PT_PER_CM, 29.7 * PT_PER_CM]
  const cw = 9 * PT_PER_CM
  const ch = 12.6 * PT_PER_CM
  const gap = 0.8 * PT_PER_CM
  const x0 = (A4[0] - 2 * cw - gap) / 2
  const y0 = 1.4 * PT_PER_CM
  const perPage = 4
  const pdf = createCanvas(A4[0], A4[1], 'pdf')
  const g = pdf.getContext('2d')
  const pages = Math.ceil(files.length / perPage)
  for (let page = 0; page < pages; page++) {
    if (page > 0) g.addPage()
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, A4[0], A4[1])
    const slice = files.slice(page * perPage, (page + 1) * perPage)
    for (let i = 0; i < slice.length; i++) {
      const x = x0 + (i % 2) * (cw + gap)
      const y = y0 + Math.floor(i / 2) * (ch + gap)
      // Skala lewat transformasi (bukan drawImage dengan ukuran tujuan) agar PNG disisipkan pada resolusi
      // penuh (±280 dpi), bukan di-resample ke 72 dpi.
      const image = await loadImage(slice[i])
      g.save()
      g.translate(x, y)
      g.scale(cw / image.width, ch / image.height)
      g.drawImage(image, 0, 0)
      g.restore()
      g.setLineDash([4, 4])
      g.lineWidth = 0.6
      g.strokeStyle = '#64748b'
      g.strokeRect(x - 4, y - 4, cw + 8, ch + 8)
      g.setLineDash([])
    }
    if (slice.length < perPage) {
      const x = x0 + (slice.length % 2) * (cw + gap) + 12
      const y = y0 + Math.floor(slice.length / 2) * (ch + gap) + 24
      g.fillStyle = '#1e1b4b'
      g.font = `bold 13px ${FONT}`
      g.textAlign = 'left'
      g.textBaseline = 'top'
      const lines = [
        'Kartu target SEMENTARA',
        'BelajarMatika AR',
        '',
        '• Cetak di HVS, skala 100%',
        '  ("Actual size", bukan "Fit").',
        '• Jangan dilaminasi mengkilap.',
        '• Gunting di garis putus-putus.',
        '• Bukan desain kartu final.',
      ]
      lines.forEach((l, i) => g.fillText(l, x, y + i * 20))
    }
  }
  writeFileSync(outFile, pdf.toBuffer('application/pdf'))
}

async function main() {
  const manifest = loadManifest('temporary')
  const written = []
  for (const t of manifest.targets) {
    const draw = DRAWERS[t.cardId]
    if (!draw) throw new Error(`Tidak ada desain sementara untuk ${t.cardId}`)
    if (!t.image) throw new Error(`Manifest temporary: target #${t.targetIndex} tidak punya path gambar`)
    const canvas = createCanvas(W, H)
    draw(canvas.getContext('2d'))
    const file = publicFile(t.image)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, canvas.toBuffer('image/png'))
    written.push(file)
    console.log(`✓ #${t.targetIndex} ${t.cardId} → ${rel(file)}`)
  }
  const sheet = publicFile('/assets/targets/temporary/kartu-sementara-a4.pdf')
  await writePrintSheet(written, sheet)
  console.log(`✓ Lembar cetak A4 → ${rel(sheet)}`)
  console.log('\nLangkah berikutnya: npm run compile:targets')
}

main().catch((err) => {
  console.error(`✗ ${err.message}`)
  process.exit(1)
})
