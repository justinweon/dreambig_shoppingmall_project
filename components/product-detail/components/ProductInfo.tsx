import type { ProductDetailData } from "@/util/types/detail";
import RatingStars from "./RatingStars";
import { getReviewSummary } from "../reviewModel";

type ProductInfoProps = Pick<ProductDetailData, "product" | "currency" | "summary" | "highlights" | "reviews" | "collectionName"> & { reviewHref?: string };

export default function ProductInfo({ product, currency, summary, highlights, reviews, collectionName, reviewHref }: ProductInfoProps) {
  const rating = getReviewSummary(reviews);
  const ReviewSummary = reviewHref ? "a" : "div";
  return <div className="ysh-product-info">
    <p className="ysh-product-eyebrow">{collectionName}</p>
    <h1>{product.name}</h1>
    <ReviewSummary href={reviewHref} className="ysh-review-shortcut">
      <RatingStars rating={rating.average} />
      {rating.average === null ? "등록된 후기 없음" : `${rating.average.toFixed(1)} / 5, 후기 ${rating.count}개`}
    </ReviewSummary>
    <p className="ysh-product-price">{new Intl.NumberFormat("ko-KR", { style: "currency", currency }).format(product.price)}</p>
    <p className="ysh-product-summary">{summary}</p>
    <ul className="ysh-product-highlights" aria-label="상품 주요 특징">
      {highlights.map((point) => <li key={point}>{point}</li>)}
    </ul>
  </div>;
}
