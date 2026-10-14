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
    <div className="space-y-4">
      <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
        {product.name}
      </h1>
      <p className="text-xl font-semibold tabular-nums sm:text-2xl">
        {formatted_price}
      </p>
      <p className="whitespace-pre-wrap break-words leading-7 text-muted-foreground">
        {product.description}
      </p>
    </div>
  );
}
