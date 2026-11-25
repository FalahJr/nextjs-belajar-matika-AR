import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AR_CARDS } from "../../config/arTargets";
import { CARD_LOOK } from "../../data/cardLook";
import { MATERI } from "../../data/materi";

export function CardsGrid() {
  return (
    <section
      id="materi"
      aria-labelledby="judul-materi"
      className="scroll-mt-20 bg-white/60 py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="judul-materi"
          className="text-center text-3xl font-black text-indigo-950"
        >
          Enam Kartu Materi
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center font-medium text-indigo-800">
          Setiap kartu punya objek 3D sendiri dan tiga soal pilihan ganda.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AR_CARDS.map((c, i) => {
            const look = CARD_LOOK[c.cardId];
            const materi = MATERI.find((m) => m.cardId === c.cardId);
            return (
              <li
                key={c.cardId}
                className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft items-center"
              >
                <span
                  className={`grid size-16 shrink-0 place-items-center rounded-2xl text-4xl ${look?.bg ?? "bg-indigo-100"}`}
                  aria-hidden="true"
                >
                  {look?.emoji}
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-500">
                    Kartu {String(i + 1).padStart(2, "0")} - {c.type}
                  </p>
                  <h3 className="text-lg font-extrabold leading-tight text-indigo-950 mt-1">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {c.topic}
                  </p>
                  {materi && (
                    <Link
                      to={`/materi/${materi.slug}`}
                      className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl text-sm font-extrabold text-indigo-700 hover:text-indigo-900"
                    >
                      <BookOpen className="size-4" aria-hidden="true" /> Baca materi
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
