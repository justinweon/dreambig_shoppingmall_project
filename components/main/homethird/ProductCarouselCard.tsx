import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/util/types/product";
import type { CarouselItem } from "@/util/types/home";

export interface CarouselEntry { item: CarouselItem; product: Product; }

export default function ProductCarouselCard({ entry, tabIndex = 0 }: { entry: CarouselEntry; tabIndex?: number }) {
  const { product, item } = entry;
  return <Link href={`/product/${product.id}`} tabIndex={tabIndex} className="homethird-product-card">
    <div className="homethird-card-default">
      <h3>{product.name}</h3>
      <div className="homethird-card-media"><Image src={product.imageUrl} alt={product.name} fill sizes="280px" draggable={false} className="object-contain" /></div>
      <span className="homethird-card-cta">상품 보기</span>
    </div>
    {item.hoverImage && <div className="homethird-card-hover" aria-hidden="true">
      <Image src={item.hoverImage.src} alt="" fill sizes="280px" draggable={false} className="object-cover" />
      <div className="homethird-card-hover-copy"><h3>{product.name}</h3><p>{item.marketingDescription}</p><span>상품 보기 ↗</span></div>
    </div>}
  </Link>;
}
