import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, LoaderCircle, TriangleAlert, ZoomIn, ZoomOut } from 'lucide-react'
import type { PDFDocumentProxy, RenderTask } from '../../lib/pdf'

/** Tingkat zoom relatif terhadap "pas selebar layar". */
const ZOOM_LEVELS = [1, 1.25, 1.5, 2] as const
/** Lebar maksimum halaman (px CSS) saat zoom 100%, agar di desktop tidak terlalu lebar. */
const MAX_FIT_WIDTH = 820
/** Batas piksel kanvas per sisi agar memori HP tetap aman. */
const MAX_CANVAS_PX = 2400

type Props = {
  url: string
  title: string
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; doc: PDFDocumentProxy; ratio: number }

/**
 * Penampil PDF berbasis PDF.js (kanvas). Dipakai sebagai ganti <iframe>/<embed> karena PDF tertanam
 * tidak tampil di Chrome Android dan sering bermasalah di Safari iPhone.
 */
export function PdfViewer({ url, title }: Props) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [zoomIndex, setZoomIndex] = useState(0)
  const fitWidth = useFitWidth()
  const zoom = ZOOM_LEVELS[zoomIndex]

  useEffect(() => {
    let cancelled = false
    let destroy: (() => void) | undefined
    setState({ status: 'loading' })
    import('../../lib/pdf')
      .then(async ({ loadPdf }) => {
        if (cancelled) return
        const task = loadPdf(url)
        destroy = () => void task.destroy()
        const doc = await task.promise
        const first = (await doc.getPage(1)).getViewport({ scale: 1 })
        if (!cancelled) setState({ status: 'ready', doc, ratio: first.height / first.width })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
      destroy?.()
    }
  }, [url])

  const pageWidth = Math.round(fitWidth.width * zoom)

  return (
    // minmax(0,1fr) + min-w-0: halaman yang diperbesar tidak boleh ikut melebarkan kolom (yang juga dipakai
    // untuk mengukur lebar "pas layar"), supaya geser-samping terjadi di dalam area PDF saja.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div className="sticky top-[4.25rem] z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/95 p-2 shadow-soft backdrop-blur">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
            disabled={zoomIndex === 0}
            aria-label="Perkecil"
            className="grid size-11 place-items-center rounded-xl text-indigo-800 hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            <ZoomOut className="size-5" aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-sm font-extrabold text-indigo-900" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Perbesar"
            className="grid size-11 place-items-center rounded-xl text-indigo-800 hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            <ZoomIn className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={url}
            target="_blank"
            rel="noopener"
            aria-label="Buka PDF di tab baru"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-bold text-indigo-800 hover:bg-indigo-50 sm:px-3"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Buka di tab baru</span>
          </a>
          <a
            href={url}
            download
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <Download className="size-4" aria-hidden="true" /> Unduh<span className="hidden sm:inline"> PDF</span>
          </a>
        </div>
      </div>

      <div ref={fitWidth.ref} className="w-full min-w-0">
        {state.status === 'loading' && (
          <p role="status" className="grid min-h-64 place-items-center rounded-2xl bg-white font-bold text-indigo-800 shadow-soft">
            <span className="flex items-center gap-2">
              <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Memuat materi…
            </span>
          </p>
        )}
        {state.status === 'error' && (
          <div role="alert" className="grid justify-items-center gap-2 rounded-2xl bg-amber-50 p-6 text-center">
            <TriangleAlert className="size-8 text-amber-600" aria-hidden="true" />
            <p className="font-bold text-amber-900">Materi belum bisa ditampilkan di perangkat ini.</p>
            <p className="text-sm font-medium text-amber-900">Coba muat ulang halaman, atau buka/unduh file PDF-nya.</p>
          </div>
        )}
        {state.status === 'ready' && pageWidth > 0 && (
          // Saat diperbesar, halaman lebih lebar dari layar: geser ke samping di area ini.
          <div className="w-full overflow-x-auto pb-2">
            <ol aria-label={`${title}, ${state.doc.numPages} halaman`} className="mx-auto grid w-max gap-3">
              {Array.from({ length: state.doc.numPages }, (_, i) => (
                <PdfPage
                  key={i + 1}
                  doc={state.doc}
                  pageNumber={i + 1}
                  total={state.doc.numPages}
                  width={pageWidth}
                  ratio={state.ratio}
                />
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

type PageProps = {
  doc: PDFDocumentProxy
  pageNumber: number
  total: number
  /** Lebar halaman dalam px CSS. */
  width: number
  /** Rasio tinggi/lebar halaman pertama, untuk placeholder sebelum halaman dirender. */
  ratio: number
}

/** Satu halaman PDF; baru dirender saat mendekati layar dan dirender ulang bila lebarnya berubah. */
function PdfPage({ doc, pageNumber, total, width, ratio }: PageProps) {
  const holderRef = useRef<HTMLLIElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visible, setVisible] = useState(false)
  /** Rasio tinggi/lebar halaman ini setelah dimuat (bisa beda dari halaman pertama). */
  const [pageRatio, setPageRatio] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  const height = Math.round(width * (pageRatio ?? ratio))

  useEffect(() => {
    const el = holderRef.current
    if (!el || visible) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true)
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible) return
    let cancelled = false
    let task: RenderTask | undefined
    doc
      .getPage(pageNumber)
      .then((page) => {
        const canvas = canvasRef.current
        if (cancelled || !canvas) return
        const base = page.getViewport({ scale: 1 })
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const pixelScale = Math.min((width / base.width) * dpr, MAX_CANVAS_PX / Math.max(base.width, base.height))
        const viewport = page.getViewport({ scale: pixelScale })
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        setPageRatio(base.height / base.width)
        task = page.render({ canvas, viewport })
        return task.promise
      })
      .then(() => {
        if (!cancelled) setFailed(false)
      })
      .catch((err: unknown) => {
        // Render dibatalkan karena lebar/zoom berubah atau halaman ditutup: bukan kesalahan.
        const name = (err as { name?: string } | null)?.name
        if (!cancelled && name !== 'RenderingCancelledException') setFailed(true)
      })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, pageNumber, width, visible])

  return (
    <li
      ref={holderRef}
      className="relative overflow-hidden rounded-xl bg-white shadow-soft"
      style={{ width, height }}
      aria-label={`Halaman ${pageNumber} dari ${total}`}
    >
      <canvas ref={canvasRef} className="block size-full" />
      {failed && (
        <p className="absolute inset-0 grid place-items-center p-4 text-center text-sm font-bold text-amber-900">
          Halaman {pageNumber} gagal dimuat. Coba muat ulang halaman.
        </p>
      )}
    </li>
  )
}

/** Lebar kontainer (px CSS) yang dipakai sebagai lebar halaman saat zoom 100%. */
function useFitWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: number | undefined
    const measure = () => setWidth(Math.min(Math.floor(el.clientWidth), MAX_FIT_WIDTH))
    measure()
    // Debounce: render ulang kanvas cukup sekali setelah ukuran layar berhenti berubah (mis. rotasi HP).
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 150)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return { ref, width }
}
