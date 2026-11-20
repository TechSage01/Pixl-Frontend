import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");

export default function ListingCard({ listing: l, isFav, onToggleFav, onOpen }) {
  const blurb = l.note || l.description;

  const handleHeart = (e) => {
    e.preventDefault();   // the whole card is a link, so stop the click from navigating
    e.stopPropagation();
    onToggleFav?.(l.id);
  };

  return (
    <Link
      to={`/listing/${l.id}`}
      onClick={(e) => {
        if (onOpen) { e.preventDefault(); onOpen(l); } // e.g. visitors get sent to sign up
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-10px_rgba(16,24,20,.2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {l.img ? (
          <img
            src={l.img}
            alt={l.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-100 text-5xl font-bold text-brand-700">
            {l.title?.[0]}
          </div>
        )}

        <button
          type="button"
          onClick={handleHeart}
          aria-label={isFav ? "Remove from saved" : "Save item"}
          aria-pressed={!!isFav}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-black/5 transition hover:scale-110 active:scale-95"
        >
          <Heart size={20} className={isFav ? "fill-rose-500 text-rose-500" : "text-stone-700"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-night">{l.title}</h3>
        <p className="mt-1 truncate text-sm text-stone-500">{l.seller || "Vendor"}</p>
        {blurb && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">{blurb}</p>}

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-lg font-bold text-night">{naira(l.price)}</span>
          <span className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-700">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}