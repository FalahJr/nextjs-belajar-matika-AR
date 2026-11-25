/**
 * PDF.js dimuat malas (dynamic import) hanya di halaman Materi, agar landing, latihan, dan AR tetap ringan.
 * Memakai build `legacy` supaya tetap jalan di browser HP lama yang sering dipakai murid.
 */
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

export type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs'

export function loadPdf(url: string) {
  return pdfjs.getDocument({ url })
}
