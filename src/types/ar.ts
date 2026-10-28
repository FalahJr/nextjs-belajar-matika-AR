import type { Question } from "./quiz";

export type ARCardConfig = {
  cardId: string;
  /** Indeks target di file .mind. Harus sama dengan urutan gambar saat dikompilasi. */
  targetIndex: number;
  title: string;
  type: string;
  /** Ringkasan materi untuk kartu di landing page. */
  topic: string;
  modelUrl: string;
  /**
   * Penyesuaian model terhadap kartu (sesuaikan setelah GLB final tersedia).
   * Satuan = lebar kartu. Model otomatis diskalakan agar muat (±80% lebar kartu) lalu dikalikan `modelScale`.
   * `modelRotation` (radian) default `[Math.PI / 2, 0, 0]` agar sumbu atas glTF (Y) menghadap keluar dari kartu.
   */
  modelScale?: number;
  modelOffset?: [number, number, number];
  modelRotation?: [number, number, number];
  questions: Question[];
};

export type ARStatus =
  | "idle"
  | "requesting-permission"
  | "loading"
  | "scanning"
  | "target-found"
  | "target-lost"
  | "assets-missing"
  | "error"
  | "stopped";
