import { Star } from "lucide-react";

export default function RatingStars({ rating }: { rating: number | null }) {
  const percentage = Number((((rating ?? 0) / 5) * 100).toFixed(2));
  const stars = Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />);
  return <span aria-hidden="true" className="ysh-rating-stars">
    <span className="ysh-rating-empty">{stars}</span>
    <span className="ysh-rating-fill" style={{ width: `${percentage}%` }}>{stars}</span>
  </span>;
}
