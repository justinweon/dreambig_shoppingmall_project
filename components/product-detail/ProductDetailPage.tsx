import Image from "next/image";
import type { ProductDetailData } from "@/shared/product-detail/detailData";

interface ProductDetailPageProps {
  data: ProductDetailData;
}

export default function ProductDetailPage({data,}: ProductDetailPageProps) {
  const { product } = data;

  // 가격 숫자를 통화 형식의 문자열로 바꾸는 코드
  // 달러 → "$8,000.00"
  //new Intl.NumberFormat("en-US", {
  //  style: "currency",
  //  currency: "USD",
  //}).format(8000);

  // 엔화 → "￥8,000"
  //new Intl.NumberFormat("ja-JP", {
  //  style: "currency",
  //  currency: "JPY",
  //}).format(8000);

  const formatted_price = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: data.currency,
  }).format(product.price);

  return (
    <main>
      <h1>{product.name}</h1>

      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        className="h-auto max-w-full"
      />

      <p>{formatted_price}</p>
      <p>{product.description}</p>
    </main>
  );
}
