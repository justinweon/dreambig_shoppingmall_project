import type { ProductDetailData } from "@/util/types/detail";
import { getReviewSummary } from "./reviewModel";

type ProductInfoProps = Pick<ProductDetailData, "product" | "currency" | "summary" | "highlights" | "reviews">;

export default function ProductInfo({ product, currency, summary, highlights, reviews }: ProductInfoProps) {
  const rating = getReviewSummary(reviews);
  return <div className="ysh-product-info">
    <p className="ysh-product-eyebrow">DREAMBIG / SEJONG COLLECTION</p>
    <h1>{product.name}</h1>
    <a href="#product-reviews" className="ysh-review-shortcut">
      <span aria-hidden="true">★★★★★</span>
      {rating.average === null ? "등록된 후기 없음" : `${rating.average.toFixed(1)} / 5, 후기 ${rating.count}개`}
    </a>
    <p className="ysh-product-price">{new Intl.NumberFormat("ko-KR", { style: "currency", currency }).format(product.price)}</p>
    <p className="ysh-product-summary">{summary}</p>
    <ul className="ysh-product-highlights" aria-label="상품 주요 특징">
      {highlights.map((point) => <li key={point}>{point}</li>)}
    </ul>
  </div>;
}
