import type { Question } from "./quiz";

export const CARD_IDS = [
  "pizza-pecahan-biasa",
  "susu-pecahan-campuran",
  "piring-buah-desimal",
  "jajanan-ubah-persen",
  "pizza-urut-campuran",
  "kue-operasi-hitung",
] as const;

export type CardId = (typeof CARD_IDS)[number];

/** Materi & soal satu kartu (src/data/arCards.ts). Tidak berisi info target/model. */
export type ARCardContent = {
  cardId: CardId;
  title: string;
  type: string;
  /** Ringkasan materi untuk kartu di landing page. */
  topic: string;
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

export type ModelStatus = "available" | "missing";

/** Kartu lengkap hasil gabungan materi + model + set target aktif (src/config/arTargets.ts). */
export type ARCardConfig = ARCardContent & {
  /** Indeks target di file .mind aktif; `null` = kartu ini tidak ada di file .mind. */
  targetIndex: number | null;
  /** Gambar sumber target (URL publik); `null` bila tidak ada / tidak diketahui. */
  targetSource: string | null;
  /** Path GLB yang dimuat; `null` = model belum tersedia dan tidak pernah di-fetch. */
  modelPath: string | null;
  /** Nama file yang direncanakan (dokumentasi saja, tidak dimuat bila model belum tersedia). */
  plannedModelPath: string;
  modelStatus: ModelStatus;
};

/** Satu entri pemetaan di manifest set target (src/config/targets/*.json). */
export type TargetEntry = {
  targetIndex: number;
  cardId: string;
  /** URL publik gambar sumber (mis. /assets/targets/temporary/01-x.png) atau null. */
  image: string | null;
};

export type TargetSetManifest = {
  id: string;
  label: string;
  /** URL publik file .mind. */
  mindUrl: string;
  description?: string;
  targets: TargetEntry[];
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
