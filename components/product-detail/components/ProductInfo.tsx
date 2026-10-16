import type { ProductDetailData } from "@/util/types/detail";
import RatingStars from "./RatingStars";
import { getReviewSummary } from "../reviewModel";

interface ProductInfoProps extends Pick<
  ProductDetailData,
  "product" | "summary" | "highlights" | "reviews" | "collectionName"
> {
  reviewHref?: string;
}

export default function ProductInfo({
  product,
  summary,
  highlights,
  reviews,
  collectionName,
  reviewHref,
}: ProductInfoProps) {
  const rating = getReviewSummary(reviews);
  const ReviewSummary = reviewHref ? "a" : "div";
  // 상품에 저장된 통화를 기준으로 가격 표시 형식만 바꾼다.
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  return (
    <div className="productdetailpage-product-info">
      <p className="productdetailpage-product-eyebrow">{collectionName}</p>
      <h1>{product.name}</h1>
      <ReviewSummary href={reviewHref} className="productdetailpage-review-shortcut">
        <RatingStars rating={rating.average} />
        {rating.average === null ? "등록된 후기 없음" : `${rating.average.toFixed(1)} / 5, 후기 ${rating.count}개`}
      </ReviewSummary>
      <p className="productdetailpage-product-price">{formattedPrice}</p>
      <p className="productdetailpage-product-summary">{summary}</p>
      <ul className="productdetailpage-product-highlights" aria-label="상품 주요 특징">
        {highlights.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
