import type { ProductDetailData } from "@/util/types/detail";
import type { DetailTemplate } from "@/util/types/detail";
import OverviewSection from "./OverviewSection";
import ProductSpecifications from "./ProductSpecifications";
import ReviewsSection from "./ReviewsSection";

interface ProductDetailPageProps {
  data: ProductDetailData;
  template: DetailTemplate;
}

export default function ProductDetailPage({data, template}: ProductDetailPageProps) {
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

  // ProductInfo로 이전 계획중
  //const formatted_price = new Intl.NumberFormat("ko-KR", {
  //  style: "currency",
  //  currency: data.currency,
  //}).format(product.price);

  return (
    <main>
      {template.sections.map((section)=>{
        switch(section.kind){
          case "overview":
            return <OverviewSection key={`${data.product.id}-${section.id}`} data={data}/>;
          case "specifications":
            return <ProductSpecifications key={section.id}/>;
          case "reviews":
            return <ReviewsSection key={section.id}/>;
        }
      })}
    </main>
  );
}
