// Deklarasi tipe minimal untuk bundel browser MindAR (paket ini tidak menyertakan tipe).
// Diverifikasi terhadap mind-ar@1.2.5 (src/image-target/three.js).
declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  import type { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

  export type MindARAnchor = {
    group: Group
    targetIndex: number
    onTargetFound: null | (() => void)
    onTargetLost: null | (() => void)
    onTargetUpdate: null | (() => void)
    css: boolean
    visible: boolean
  }

  export type MindARThreeOptions = {
    container: HTMLElement
    imageTargetSrc: string
    maxTrack?: number
    filterMinCF?: number | null
    filterBeta?: number | null
    warmupTolerance?: number | null
    missTolerance?: number | null
    uiLoading?: string
    uiScanning?: string
    uiError?: string
    userDeviceId?: string | null
    environmentDeviceId?: string | null
  }

  export class MindARThree {
    constructor(options: MindARThreeOptions)
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera
    video: HTMLVideoElement | undefined
    controller:
      | {
          dispose(): void
          stopProcessVideo(): void
          /** `[lebar, tinggi]` tiap target di file .mind (terisi setelah `start()`); panjangnya = jumlah target. */
          markerDimensions: [number, number][] | null
        }
      | undefined
    shouldFaceUser: boolean
    start(): Promise<void>
    stop(): void
    anchors: MindARAnchor[]
    switchCamera(): void
    resize(): void
    addAnchor(targetIndex: number): MindARAnchor
  }
}
