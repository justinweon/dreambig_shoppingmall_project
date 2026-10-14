import type { ProductDetailData } from "@/shared/product-detail/detailData";
import ProductInfo from "./ProductInfo";

interface OverviewSectionpProps{
  data : ProductDetailData;
}

export default function OverviewSection({data} : OverviewSectionpProps) {
  return (
    <section>
      <ProductInfo product={data.product} currency={data.currency}/>
    </section>
  );
}
