import type { CardId } from '../types/ar'

/** Ikon dan warna latar tiap kartu/materi (dipakai di landing page dan halaman Materi). */
export const CARD_LOOK: Record<CardId, { emoji: string; bg: string }> = {
  'pizza-pecahan-biasa': { emoji: '🍕', bg: 'bg-rose-100' },
  'susu-pecahan-campuran': { emoji: '🥛', bg: 'bg-sky-100' },
  'piring-buah-desimal': { emoji: '🍓', bg: 'bg-emerald-100' },
  'jajanan-ubah-persen': { emoji: '🍬', bg: 'bg-violet-100' },
  'pizza-urut-campuran': { emoji: '🍕', bg: 'bg-amber-100' },
  'kue-operasi-hitung': { emoji: '🧁', bg: 'bg-pink-100' },
}
