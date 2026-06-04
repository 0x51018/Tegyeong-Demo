import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatWon, getReferencePrice } from "../data/catalog";
import type { Vinyl } from "../types";

interface VinylCardProps {
  vinyl: Vinyl;
  compact?: boolean;
}

export function VinylCard({ vinyl, compact = false }: VinylCardProps) {
  const referencePrice = getReferencePrice(vinyl);

  return (
    <Link to={`/vinyl/${vinyl.id}`} className={compact ? "vinyl-row" : "vinyl-card"}>
      <div className="cover-wrap">
        <img src={vinyl.cover} alt={`${vinyl.artist} ${vinyl.title} 앨범 커버`} loading="lazy" />
        <span className="cover-status">{vinyl.availability}</span>
      </div>
      <div className="vinyl-card-copy">
        <p className="vinyl-artist">{vinyl.artist}</p>
        <h3>{vinyl.title}</h3>
        <p className="vinyl-meta">
          {vinyl.year} · {vinyl.pressing}
        </p>
        <strong>{referencePrice.price ? `${referencePrice.label} ${formatWon(referencePrice.price)}` : "가격 정보 확인 중"}</strong>
      </div>
      {compact ? <ArrowUpRight size={20} aria-hidden="true" /> : null}
    </Link>
  );
}
