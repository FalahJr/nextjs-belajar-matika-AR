import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { AR_CARDS } from '../config/arTargets'
import { MATERI, getMateriBySlug } from './materi'

const publicPath = (url: string) => resolve('public', url.replace(/^\//, ''))

describe('data materi', () => {
  it('enam materi, satu per kartu AR, urut 1–6', () => {
    expect(MATERI.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6])
    expect(MATERI.map((m) => m.cardId)).toEqual(AR_CARDS.map((c) => c.cardId))
  })

  it('slug unik dan aman untuk URL', () => {
    const slugs = MATERI.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    expect(getMateriBySlug('pecahan-biasa')?.number).toBe(1)
    expect(getMateriBySlug('tidak-ada')).toBeUndefined()
  })

  it('setiap file PDF ada di public/ dan berformat PDF', () => {
    for (const m of MATERI) {
      const file = publicPath(m.pdf)
      expect(existsSync(file), m.pdf).toBe(true)
      expect(readFileSync(file).subarray(0, 5).toString(), m.pdf).toBe('%PDF-')
    }
  })

  it('jumlah halaman sesuai file PDF', async () => {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    for (const m of MATERI) {
      const data = new Uint8Array(readFileSync(publicPath(m.pdf)))
      const task = pdfjs.getDocument({ data, verbosity: 0 })
      expect((await task.promise).numPages, m.pdf).toBe(m.pages)
      await task.destroy()
    }
  })
})
