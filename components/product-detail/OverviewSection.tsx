"use client"

import { useState } from "react";
import type { ProductDetailData } from "@/util/types/detail";
import type { AddToCartRequest } from "@/util/types/cart";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductPurchasePanel from "./ProductPurchasePanel";

interface OverviewSectionProps {
  data: ProductDetailData;
}

export default function OverviewSection({ data }: OverviewSectionProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    data.images[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart(request: AddToCartRequest) {
    // 원정린님 장바구니 함수가 준비되면 이곳에서 호출한다.
    console.log("장바구니 담기 요청:", request);
  }


  return (
    <section
      aria-label="상품 정보와 구매"
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12"
    >
      <div className="min-w-0">
        <ProductGallery
          images={data.images}
          selectedImageId={selectedImageId}
          onImageSelect={setSelectedImageId}
        />
      </div>

      <div className="min-w-0 space-y-8">
        <ProductInfo product={data.product} currency={data.currency} />
        <ProductPurchasePanel
          productId={data.product.id}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>
    </section>
  );
}
