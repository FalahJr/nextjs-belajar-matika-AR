import { Group, Quaternion, Vector3 } from 'three'

export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 3
/** Radian per piksel geser: ±360° untuk geser sekitar 790 px. */
const ROTATE_SPEED = 0.008
/** Kecepatan peredaman gerak (semakin besar = semakin responsif). */
const SMOOTHING = 14

/**
 * Keadaan "lihat dari sudut lain" sebuah model: rotasi bebas 360° dan zoom, dengan gerak diperhalus.
 * `spin` berada di pusat model (titik putar), jadi model berputar di tempat dan tidak menembus kartu.
 * Nilai yang dipertahankan per model, sehingga sudut dan zoom tidak hilang saat kartu hilang sesaat.
 */
export class ModelView {
  readonly spin = new Group()
  private readonly targetQ = new Quaternion()
  private targetZoom = 1

  /** Memutar sebesar `angle` radian terhadap `axis` (sumbu di ruang lokal anchor). */
  rotate(axis: Vector3, angle: number) {
    this.targetQ.premultiply(new Quaternion().setFromAxisAngle(axis.normalize(), angle))
  }

  zoomBy(factor: number) {
    this.targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.targetZoom * factor))
  }

  reset() {
    this.targetQ.identity()
    this.targetZoom = 1
  }

  update(dt: number) {
    const k = 1 - Math.exp(-SMOOTHING * dt)
    this.spin.quaternion.slerp(this.targetQ, k)
    this.spin.scale.setScalar(this.spin.scale.x + (this.targetZoom - this.spin.scale.x) * k)
  }
}

/** Mengubah geser piksel di layar menjadi sudut putar. */
export const pixelsToRadians = (px: number) => px * ROTATE_SPEED

type GestureHooks = {
  /** Geser satu jari / mouse (dalam piksel). */
  onRotate: (dx: number, dy: number) => void
  /** Faktor pengali zoom: >1 memperbesar, <1 memperkecil. */
  onZoom: (factor: number) => void
  onReset: () => void
}

/**
 * Gestur pada area kamera: geser = putar, cubit dua jari / scroll = zoom, klik dua kali = reset.
 * Memakai Pointer Events (satu kode untuk sentuh dan mouse). Elemen target perlu `touch-action: none`
 * agar browser tidak ikut menggulir halaman. Semua listener dilepas lewat `dispose()`.
 */
export class ModelGestures {
  private readonly pointers = new Map<number, { x: number; y: number }>()
  private pinchDistance = 0
  private readonly abort = new AbortController()

  private readonly el: HTMLElement
  private readonly hooks: GestureHooks

  constructor(el: HTMLElement, hooks: GestureHooks) {
    this.el = el
    this.hooks = hooks
    const { signal } = this.abort
    el.addEventListener('pointerdown', this.onDown, { signal })
    el.addEventListener('pointermove', this.onMove, { signal })
    el.addEventListener('pointerup', this.onUp, { signal })
    el.addEventListener('pointercancel', this.onUp, { signal })
    el.addEventListener('wheel', this.onWheel, { signal, passive: false })
    el.addEventListener('dblclick', () => this.hooks.onReset(), { signal })
  }

  dispose() {
    this.abort.abort()
    this.pointers.clear()
    this.pinchDistance = 0
  }

  private distance() {
    const [a, b] = [...this.pointers.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  private onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    try {
      this.el.setPointerCapture(e.pointerId)
    } catch {
      // pointer sudah tidak aktif; abaikan
    }
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (this.pointers.size === 2) this.pinchDistance = this.distance()
  }

  private onMove = (e: PointerEvent) => {
    const prev = this.pointers.get(e.pointerId)
    if (!prev) return
    const dx = e.clientX - prev.x
    const dy = e.clientY - prev.y
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (this.pointers.size === 1) {
      this.hooks.onRotate(dx, dy)
    } else if (this.pointers.size === 2) {
      const next = this.distance()
      if (this.pinchDistance > 0 && next > 0) this.hooks.onZoom(next / this.pinchDistance)
      this.pinchDistance = next
    }
  }

  private onUp = (e: PointerEvent) => {
    if (!this.pointers.delete(e.pointerId)) return
    try {
      this.el.releasePointerCapture(e.pointerId)
    } catch {
      // sudah dilepas
    }
    if (this.pointers.size < 2) this.pinchDistance = 0
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    // deltaMode 1 = baris (Firefox); samakan ke piksel.
    const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    this.hooks.onZoom(Math.exp(-delta * 0.0015))
  }
}
