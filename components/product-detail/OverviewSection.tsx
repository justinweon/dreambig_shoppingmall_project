import type { ProductDetailData } from "@/util/types/detail";
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
