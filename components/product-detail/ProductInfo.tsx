import type { ProductDetailData } from "@/util/types/detail";

interface ProdcutInfoProps{
  product: ProductDetailData["product"],
  currency : ProductDetailData["currency"],
}

export default function ProductInfo({product, currency} : ProdcutInfoProps) {
  const formatted_price = new Intl.NumberFormat("ko-KR", {
    style : "currency",
    currency,
  }).format(product.price);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{formatted_price}</p>
      <p>{product.description}</p>
    </div>
  );
}
