import {
  AmbientLight,
  AnimationMixer,
  Box3,
  BoxGeometry,
  Clock,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  Object3D,
  Texture,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { MindARAnchor, MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js'
import { AR_START_TIMEOUT_MS, MIND_TARGET_URL, MINDAR_TUNING, TARGET_LOST_GRACE_MS } from '../data/arConfig'
import type { ARCardConfig, ARStatus } from '../types/ar'
import { assetExists } from './assets'

export type ModelState = 'loading' | 'ready' | 'missing' | 'error'

export type AREngineCallbacks = {
  onStatus: (status: ARStatus, message?: string) => void
  /** Kartu yang sedang/terakhir terdeteksi. Dipanggil setiap kali sebuah target ditemukan. */
  onCardFound: (cardId: string) => void
  onModelState: (cardId: string, state: ModelState) => void
}

class AREngineError extends Error {}

/**
 * Engine AR (tanpa React): mengelola kamera, MindAR, scene Three.js, dan pemuatan GLB.
 * Sengaja terpisah dari state kuis — memilih jawaban tidak pernah menyentuh engine ini.
 *
 * Catatan perilaku MindAR 1.2.5 yang ditangani di sini (diverifikasi dari sumbernya):
 * - `stop()` bawaan tidak membuang renderer/scene dan melempar error bila dipanggil terlalu dini.
 * - `start()` bisa menggantung bila file .mind hilang/rusak (error di executor Promise tidak di-reject),
 *   sehingga file diperiksa lebih dulu dan ada batas waktu.
 * - Listener `resize` window tidak pernah dilepas; instance "dinetralkan" saat dispose.
 */
export class AREngine {
  private readonly container: HTMLElement
  private readonly cards: readonly ARCardConfig[]
  private readonly cb: AREngineCallbacks

  private mindar: MindARThree | null = null
  private resizeObserver: ResizeObserver | null = null
  private abort = new AbortController()
  private started = false
  private disposed = false
  private ready = false

  private readonly visible = new Set<string>()
  private lostTimer: ReturnType<typeof setTimeout> | undefined
  private readonly modelStates = new Map<string, ModelState>()
  private readonly mixers: AnimationMixer[] = []
  private readonly clock = new Clock()
  private readonly loader = new GLTFLoader()

  constructor(container: HTMLElement, cards: readonly ARCardConfig[], callbacks: AREngineCallbacks) {
    this.container = container
    this.cards = cards
    this.cb = callbacks
  }

  /** Memulai sesi. Aman dipanggil berulang: hanya panggilan pertama yang berjalan. */
  async start(): Promise<void> {
    if (this.started || this.disposed) return
    this.started = true
    const { signal } = this.abort

    try {
      this.emit('loading', 'Memeriksa file target kartu…')
      if (!(await assetExists(MIND_TARGET_URL, signal))) {
        this.finish('assets-missing', `File target ${MIND_TARGET_URL} belum tersedia.`)
        return
      }

      this.emit('requesting-permission')
      await this.requestCameraPermission()
      if (this.disposed) return

      this.emit('loading', 'Memuat engine AR dan target kartu…')
      const { MindARThree } = await import('mind-ar/dist/mindar-image-three.prod.js')
      if (this.disposed) return

      const mindar = new MindARThree({
        container: this.container,
        imageTargetSrc: MIND_TARGET_URL,
        // UI bawaan MindAR dimatikan; status ditampilkan oleh komponen React.
        uiLoading: 'no',
        uiScanning: 'no',
        uiError: 'no',
        ...MINDAR_TUNING,
      })
      this.mindar = mindar

      mindar.scene.add(new AmbientLight(0xffffff, 1.6))
      const sun = new DirectionalLight(0xffffff, 1.8)
      sun.position.set(0.5, -1, 2)
      mindar.scene.add(sun)

      for (const card of this.cards) {
        const anchor = mindar.addAnchor(card.targetIndex)
        anchor.onTargetFound = () => this.handleFound(card, anchor)
        anchor.onTargetLost = () => this.handleLost(card)
      }

      mindar.renderer.setAnimationLoop(() => {
        const dt = this.clock.getDelta()
        for (const m of this.mixers) m.update(dt)
        mindar.renderer.render(mindar.scene, mindar.camera)
      })

      await this.startMindAR(mindar)
      if (this.disposed) return

      this.ready = true
      this.resizeObserver = new ResizeObserver(() => {
        if (!this.disposed && this.ready) this.mindar?.resize()
      })
      this.resizeObserver.observe(this.container)
      this.emit('scanning')
    } catch (err) {
      if (this.disposed) return
      this.finish('error', err instanceof AREngineError ? err.message : 'Terjadi kesalahan saat memulai AR.')
    }
  }

  /** Beralih antara kamera belakang dan depan (bila perangkat punya lebih dari satu). */
  async switchCamera(): Promise<void> {
    const mindar = this.mindar
    if (!mindar || !this.ready || this.disposed) return
    this.ready = false
    try {
      this.resetTracking()
      this.emit('loading', 'Mengganti kamera…')
      this.stopCamera()
      mindar.shouldFaceUser = !mindar.shouldFaceUser
      await this.startMindAR(mindar)
      if (this.disposed) return
      this.ready = true
      this.emit('scanning')
    } catch (err) {
      if (this.disposed) return
      this.finish('error', err instanceof AREngineError ? err.message : 'Gagal mengganti kamera.')
    }
  }

  async hasMultipleCameras(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter((d) => d.kind === 'videoinput').length > 1
    } catch {
      return false
    }
  }

  /** Menghentikan kamera dan membersihkan semua resource. Idempotent. */
  stop(): void {
    if (this.disposed) return
    this.teardown()
    this.cb.onStatus('stopped')
  }

  // ---------------------------------------------------------------------------

  private emit(status: ARStatus, message?: string) {
    if (!this.disposed) this.cb.onStatus(status, message)
  }

  /** Membersihkan semua resource lalu melaporkan status akhir (error / aset hilang). */
  private finish(status: ARStatus, message: string) {
    this.teardown()
    this.cb.onStatus(status, message)
  }

  /**
   * Izin kamera diminta sendiri lebih dulu agar penyebab kegagalan (ditolak, tidak ada kamera,
   * dipakai aplikasi lain, bukan HTTPS) bisa dijelaskan — MindAR hanya me-reject tanpa alasan.
   */
  private async requestCameraPermission(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new AREngineError(
        window.isSecureContext
          ? 'Browser ini tidak mendukung akses kamera.'
          : 'Akses kamera membutuhkan HTTPS (atau localhost saat pengembangan).',
      )
    }
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      })
    } catch (err) {
      throw new AREngineError(describeCameraError(err))
    }
    // Hanya untuk meminta izin; MindAR membuka kameranya sendiri.
    stream.getTracks().forEach((t) => t.stop())
  }

  private startMindAR(mindar: MindARThree): Promise<void> {
    const startPromise = mindar.start()
    // Bila sesi dihentikan saat start masih berjalan, MindAR tetap bisa menyelesaikan start()
    // belakangan (membuat controller/worker dan menyalakan kamera). Bersihkan lagi saat itu terjadi.
    const sweepIfDisposed = () => {
      if (this.disposed) this.stopCamera()
    }
    startPromise.then(sweepIfDisposed, sweepIfDisposed)

    return new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout)
        window.removeEventListener('unhandledrejection', onUnhandled)
        this.abort.signal.removeEventListener('abort', onAbort)
      }
      const fail = (message: string) => {
        cleanup()
        reject(new AREngineError(message))
      }
      const timeout = setTimeout(
        () => fail('Memuat AR terlalu lama. Periksa koneksi dan file target (.mind), lalu coba lagi.'),
        AR_START_TIMEOUT_MS,
      )
      // MindAR tidak me-reject bila file .mind rusak (error di executor Promise); tangkap di sini.
      const onUnhandled = () => fail('File target (.mind) tidak dapat dibaca. Pastikan file valid.')
      const onAbort = () => {
        cleanup()
        resolve()
      }
      window.addEventListener('unhandledrejection', onUnhandled)
      this.abort.signal.addEventListener('abort', onAbort)

      startPromise.then(
        () => {
          cleanup()
          resolve()
        },
        () => fail('Kamera gagal dimulai. Pastikan izin kamera diberikan dan kamera tidak dipakai aplikasi lain.'),
      )
    })
  }

  private handleFound(card: ARCardConfig, anchor: MindARAnchor) {
    if (this.disposed) return
    clearTimeout(this.lostTimer)
    this.visible.delete(card.cardId)
    this.visible.add(card.cardId)
    this.emit('target-found')
    this.cb.onCardFound(card.cardId)
    void this.ensureModel(card, anchor)
  }

  private handleLost(card: ARCardConfig) {
    if (this.disposed) return
    this.visible.delete(card.cardId)
    const remaining = [...this.visible]
    if (remaining.length > 0) {
      this.cb.onCardFound(remaining[remaining.length - 1])
      return
    }
    // Toleransi singkat: status "hilang sementara" baru tampil setelah jeda; progres kuis tidak disentuh.
    clearTimeout(this.lostTimer)
    this.lostTimer = setTimeout(() => this.emit('target-lost'), TARGET_LOST_GRACE_MS)
  }

  private resetTracking() {
    clearTimeout(this.lostTimer)
    this.visible.clear()
    for (const a of this.mindar?.anchors ?? []) {
      a.visible = false
      a.group.visible = false
    }
  }

  private setModelState(cardId: string, state: ModelState) {
    this.modelStates.set(cardId, state)
    this.cb.onModelState(cardId, state)
  }

  /** Memuat model sekali per kartu saat target pertama kali ditemukan. */
  private async ensureModel(card: ARCardConfig, anchor: MindARAnchor) {
    if (this.modelStates.has(card.cardId)) return
    this.setModelState(card.cardId, 'loading')
    const { signal } = this.abort

    if (!(await assetExists(card.modelUrl, signal))) {
      if (this.disposed) return
      // Kotak kawat penanda: membuktikan tracking bekerja walau model belum tersedia.
      anchor.group.add(createPlaceholder())
      this.setModelState(card.cardId, 'missing')
      return
    }

    try {
      const gltf = await this.loader.loadAsync(card.modelUrl)
      if (this.disposed) {
        disposeObject(gltf.scene)
        return
      }
      anchor.group.add(this.buildHolder(card, gltf.scene))
      if (gltf.animations.length > 0) {
        const mixer = new AnimationMixer(gltf.scene)
        for (const clip of gltf.animations) mixer.clipAction(clip).play()
        this.mixers.push(mixer)
      }
      this.setModelState(card.cardId, 'ready')
    } catch {
      if (this.disposed) return
      anchor.group.add(createPlaceholder())
      this.setModelState(card.cardId, 'error')
    }
  }

  /** Memusatkan model di kartu, menempelkan dasarnya ke permukaan, dan menskalakan agar muat. */
  private buildHolder(card: ARCardConfig, root: Object3D): Group {
    const box = new Box3().setFromObject(root)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    root.position.set(-center.x, -box.min.y, -center.z)

    const holder = new Group()
    holder.add(root)
    const footprint = Math.max(size.x, size.z) || 1
    holder.scale.setScalar((0.8 * (card.modelScale ?? 1)) / footprint)
    holder.rotation.set(...(card.modelRotation ?? [Math.PI / 2, 0, 0]))
    holder.position.set(...(card.modelOffset ?? [0, 0, 0]))
    return holder
  }

  /** Menghentikan track kamera, controller MindAR, dan elemen video. Aman dipanggil berulang. */
  private stopCamera() {
    const mindar = this.mindar
    if (!mindar) return
    try {
      mindar.controller?.dispose()
    } catch {
      // controller mungkin belum selesai dibuat; tidak ada yang perlu dibersihkan
    }
    const video = mindar.video
    if (video) {
      const stream = video.srcObject
      if (stream instanceof MediaStream) stream.getTracks().forEach((t) => t.stop())
      video.srcObject = null
      video.remove()
    }
  }

  private teardown() {
    if (this.disposed) return
    this.disposed = true
    this.ready = false
    this.abort.abort()
    clearTimeout(this.lostTimer)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.visible.clear()

    const mindar = this.mindar
    if (mindar) {
      mindar.renderer.setAnimationLoop(null)
      this.stopCamera()
      for (const m of this.mixers) m.stopAllAction()
      this.mixers.length = 0
      disposeObject(mindar.scene)
      mindar.scene.clear()
      mindar.renderer.dispose()
      mindar.renderer.forceContextLoss()
      mindar.renderer.domElement.remove()
      // Listener resize window bawaan MindAR tidak bisa dilepas; `resize()` langsung berhenti bila video kosong.
      mindar.video = undefined
      mindar.controller = undefined
      this.mindar = null
    }
  }
}

function createPlaceholder(): Group {
  const group = new Group()
  const geometry = new EdgesGeometry(new BoxGeometry(0.5, 0.5, 0.5))
  const lines = new LineSegments(geometry, new LineBasicMaterial({ color: 0xfacc15 }))
  lines.position.z = 0.25
  group.add(lines)
  return group
}

function disposeMaterial(material: Material) {
  for (const value of Object.values(material)) {
    if (value instanceof Texture) value.dispose()
  }
  material.dispose()
}

/** Membuang geometry, material, dan tekstur seluruh turunan objek. */
function disposeObject(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh
    mesh.geometry?.dispose()
    const material = mesh.material as Material | Material[] | undefined
    if (Array.isArray(material)) material.forEach(disposeMaterial)
    else if (material) disposeMaterial(material)
  })
}

function describeCameraError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : ''
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Izin kamera ditolak. Izinkan akses kamera di pengaturan browser, lalu coba lagi.'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'Kamera tidak ditemukan di perangkat ini.'
    case 'NotReadableError':
    case 'AbortError':
      return 'Kamera tidak bisa dibuka. Tutup aplikasi lain yang memakai kamera, lalu coba lagi.'
    default:
      return 'Kamera gagal dimulai. Coba muat ulang halaman.'
  }
}
