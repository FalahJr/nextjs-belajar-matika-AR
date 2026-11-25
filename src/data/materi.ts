import type { CardId } from '../types/ar'

export type Materi = {
  /** Dipakai di URL: /materi/:slug */
  slug: string
  number: number
  title: string
  summary: string
  /** Kartu AR yang membahas materi ini. */
  cardId: CardId
  /** URL publik PDF (public/assets/materi/). */
  pdf: string
  /** Jumlah halaman PDF, untuk info di daftar materi (dicek oleh unit test). */
  pages: number
}

/**
 * Enam materi bacaan, satu per kartu AR. Sumber: PDF dari client (docs/Materi N_*.pdf),
 * disalin ke public/assets/materi/ dengan nama tanpa spasi.
 */
export const MATERI: Materi[] = [
  {
    slug: 'pecahan-biasa',
    number: 1,
    title: 'Pecahan Biasa',
    summary: 'Mengenal pecahan, pembilang, dan penyebut lewat cerita jajanan pasar.',
    cardId: 'pizza-pecahan-biasa',
    pdf: '/assets/materi/materi-1-pecahan-biasa.pdf',
    pages: 2,
  },
  {
    slug: 'pecahan-campuran',
    number: 2,
    title: 'Pecahan Campuran',
    summary: 'Pengertian dan ciri pecahan campuran, serta mengubahnya ke pecahan biasa dan sebaliknya.',
    cardId: 'susu-pecahan-campuran',
    pdf: '/assets/materi/materi-2-pecahan-campuran.pdf',
    pages: 3,
  },
  {
    slug: 'pecahan-ke-desimal',
    number: 3,
    title: 'Pecahan ke Desimal',
    summary: 'Arti desimal, nilai tempat, cara membaca, dan mengubah pecahan ke desimal.',
    cardId: 'piring-buah-desimal',
    pdf: '/assets/materi/materi-3-pecahan-ke-desimal.pdf',
    pages: 2,
  },
  {
    slug: 'pecahan-ke-persen',
    number: 4,
    title: 'Pecahan ke Persen',
    summary: 'Arti persen, hubungannya dengan pecahan, dan contoh persen dalam kehidupan sehari-hari.',
    cardId: 'jajanan-ubah-persen',
    pdf: '/assets/materi/materi-4-pecahan-ke-persen.pdf',
    pages: 7,
  },
  {
    slug: 'mengurutkan-pecahan',
    number: 5,
    title: 'Mengurutkan Pecahan',
    summary: 'Mengurutkan, membandingkan, dan mengubah bentuk pecahan lewat kue lapis, jenang, dan serabi.',
    cardId: 'pizza-urut-campuran',
    pdf: '/assets/materi/materi-5-mengurutkan-pecahan.pdf',
    pages: 2,
  },
  {
    slug: 'operasi-hitung-pecahan',
    number: 6,
    title: 'Operasi Hitung Pecahan',
    summary: 'Membandingkan, menjumlah, mengurangi, mengalikan, dan membagi pecahan.',
    cardId: 'kue-operasi-hitung',
    pdf: '/assets/materi/materi-6-operasi-hitung-pecahan.pdf',
    pages: 7,
  },
]

export function getMateriBySlug(slug: string | undefined): Materi | undefined {
  return MATERI.find((m) => m.slug === slug)
}
