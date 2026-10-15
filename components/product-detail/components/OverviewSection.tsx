"use client";

import { useState } from "react";
import type { ProductDetailData } from "@/util/types/detail";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductPurchasePanel from "./ProductPurchasePanel";
import type { AddToCartHandler } from "../cartConnection";

interface OverviewSectionProps {
  data: ProductDetailData;
  reviewHref?: string;
  galleryFit?: "contain" | "cover";
  onAddToCart?: AddToCartHandler;
}

export default function OverviewSection({
  data,
  reviewHref,
  galleryFit = "contain",
  onAddToCart,
}: OverviewSectionProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    data.images[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <section
      aria-label="상품 정보와 구매"
      className="productdetailpage-overview"
    >
      <div className="min-w-0">
        <ProductGallery
          images={data.images}
          selectedImageId={selectedImageId}
          onImageSelect={setSelectedImageId}
          fit={galleryFit}
        />
      </div>

      <div className="min-w-0 space-y-8">
        <ProductInfo
          collectionName={data.collectionName}
          reviewHref={reviewHref}
          product={data.product}
          summary={data.summary}
          highlights={data.highlights}
          reviews={data.reviews}
        />
        <ProductPurchasePanel
          productId={data.product.id}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={onAddToCart}
        />
        <p className="productdetailpage-product-notice">{data.notice}</p>
      </div>
    </section>
  );
}
