import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-16 bg-indigo-950 text-indigo-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-indigo-200">
            Belajar matematika SD dengan kartu dan objek 3D Augmented Reality. Tanpa login, tanpa
            menyimpan data — nilai hanya tampil selama sesi.
          </p>
        </div>
        <nav aria-label="Navigasi footer">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-amber-300">Menu</h2>
          <ul className="grid gap-2 font-semibold">
            <li><Link className="hover:text-white" to="/">Beranda</Link></li>
            <li><Link className="hover:text-white" to="/scan">Scan AR</Link></li>
            <li><Link className="hover:text-white" to="/latihan">Latihan Soal</Link></li>
            <li><Link className="hover:text-white" to="/#tentang">Tentang</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-amber-300">Catatan</h2>
          <p className="text-sm leading-relaxed text-indigo-200">
            Akses kamera memerlukan izin pengguna dan koneksi HTTPS (atau localhost saat pengembangan).
          </p>
        </div>
      </div>
      <div className="border-t border-indigo-900 py-4 text-center text-xs text-indigo-300">
        © {new Date().getFullYear()} BelajarMatika AR. Dibuat untuk pembelajaran matematika SD.
      </div>
    </footer>
  )
}
