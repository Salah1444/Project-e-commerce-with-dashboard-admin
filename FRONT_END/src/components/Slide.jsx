import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const imgs = [
  { id: 1, name: "Parfum For Your Beauty", url: "assets/images/img_3_food.png" },
  { id: 2, name: "Home Furniture",          url: "assets/images/img_2_room.png" },
  { id: 3, name: "Food to Your Health",     url: "assets/images/img_3_food.png" },
];

function Slide() {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i === 0 ? imgs.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setIndex((i) => (i === imgs.length - 1 ? 0 : i + 1)),
    []
  );

  /* auto-advance */
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="mt-16 overflow-hidden relative select-none">

      {/* ── Slides strip ──────────────────────────────── */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {imgs.map((img) => (
          <div key={img.id} className="w-screen h-screen flex-shrink-0 relative">
            <img
              src={img.url}
              className="w-full h-full object-cover"
              alt={img.name}
            />

            {/* dark overlay so text is always readable */}
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

            {/* slide caption */}
            <div className="absolute top-1/3 left-10 max-w-md">
              <span className="block mb-2 text-xs font-semibold tracking-[0.18em] uppercase
                               text-amber-400">
                Featured
              </span>
              <h2 className="text-4xl font-extrabold text-white leading-tight
                             font-['Playfair_Display'] drop-shadow-lg">
                {img.name}
              </h2>
              <div className="mt-3 h-[3px] w-12 rounded-full bg-amber-400" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Prev / Next buttons ───────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full cursor-pointer
                   bg-black/50 dark:bg-slate-900/70
                   text-white hover:bg-amber-500 dark:hover:bg-amber-500
                   border border-white/10 dark:border-slate-700
                   transition-colors duration-200 shadow-lg"
      >
        <FaChevronLeft size={16} />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full cursor-pointer
                   bg-black/50 dark:bg-slate-900/70
                   text-white hover:bg-amber-500 dark:hover:bg-amber-500
                   border border-white/10 dark:border-slate-700
                   transition-colors duration-200 shadow-lg"
      >
        <FaChevronRight size={16} />
      </button>

      {/* ── Bottom gradient + dots ────────────────────── */}
      <div className="absolute bottom-0 w-full h-1/4
                      bg-gradient-to-t from-black/70 dark:from-slate-950/80 to-transparent
                      flex justify-center items-end pb-7 gap-2">
        {imgs.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer
              ${i === index
                ? "w-6 h-3 bg-amber-400"        /* active: pill shape */
                : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slide;