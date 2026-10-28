# nextjs-belajar-matika-AR

BelajarMatika AR — website pembelajaran Matematika (pecahan) siswa SD berbasis Augmented Reality.
React + TypeScript + Vite, MindAR (image tracking) + Three.js.

```bash
npm install
npm run dev               # http://localhost:5173 — halaman scan: /scan
npm run typecheck && npm run lint && npm test && npm run build
```

Aset AR (target `.mind`, gambar kartu, model GLB):

```bash
npm run targets:generate  # buat ulang 3 kartu target SEMENTARA (PNG + PDF A4)
npm run compile:targets   # kompilasi gambar target → public/assets/targets/temporary-targets.mind
npm run verify:targets    # validasi .mind, urutan targetIndex, dan model GLB
```

Panduan lengkap (mengganti kartu sementara, memakai `.mind` dari Wildan, HTTPS, batasan): [docs/ASET.md](docs/ASET.md).
