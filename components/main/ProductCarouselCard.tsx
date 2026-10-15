import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/util/types/product";
import type { CarouselItem } from "@/util/types/home";

export interface CarouselEntry {
  item: CarouselItem;
  product: Product;
}

export default function ProductCarouselCard({ entry, tabIndex = 0 }: { entry: CarouselEntry; tabIndex?: number }) {
  const { product, item } = entry;
  return (
    <Link href={`/product/${product.id}`} tabIndex={tabIndex}
      className="group flex h-full min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5 text-stone-950 outline-offset-4 focus-visible:outline-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-50">
        <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          draggable={false} className={`object-contain p-4 transition-opacity duration-300 motion-reduce:transition-none ${item.hoverImage ? "group-hover:opacity-0 group-focus-visible:opacity-0" : ""}`} />
        {item.hoverImage && <Image src={item.hoverImage.src} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw"
          draggable={false} className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />}
      </div>
      <h3 className="mt-5 break-words text-xl font-semibold">{product.name}</h3>
      <p className="mt-2 font-medium tabular-nums">{new Intl.NumberFormat("ko-KR", { style: "currency", currency: product.currency }).format(product.price)}</p>
      <p className="mt-3 flex-1 break-words text-sm leading-6 text-stone-600">{item.marketingDescription ?? product.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-semibold">상품 보기 <span aria-hidden="true">↗</span></span>
    </Link>
  );
}
