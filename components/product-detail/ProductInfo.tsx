import { ProductDetailData } from "@/shared/product-detail/detailData";

interface ProdcutInfoProps{
  product: ProductDetailData["product"],
  currency : ProductDetailData["currency"],
}

export default function ProductInfo({product, currency} : ProdcutInfoProps) {
  return null;
}
