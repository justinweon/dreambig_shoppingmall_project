import Image from "next/image";
import Link from "next/link";
import type { ProductBannerData } from "@/util/types/home";
import type { Product } from "@/util/types/product";

export default function ProductBanner({ banner, product }: { banner: ProductBannerData; product: Product }) {
  return (
    <section aria-label={banner.headline} className="overflow-hidden rounded-3xl bg-[#f5efe5] text-stone-950">
      <div className="grid items-center lg:grid-cols-2">
        <div className="relative aspect-[16/10] min-w-0 lg:order-2 lg:aspect-square">
          <Image src={banner.desktopImage.src} alt={banner.desktopImage.alt} fill
            sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover ${banner.mobileImage ? "hidden sm:block" : ""}`} />
          {banner.mobileImage && <Image src={banner.mobileImage.src} alt={banner.mobileImage.alt} fill sizes="100vw" className="object-contain sm:hidden" />}
        </div>
        <div className="min-w-0 px-6 py-10 sm:p-10 lg:p-14">
          <p className="text-sm font-semibold tracking-[0.2em]">DREAMBIG COLLECTION</p>
          <h2 className="mt-4 break-words text-3xl leading-tight font-bold sm:text-4xl">{banner.headline}</h2>
          <p className="mt-5 max-w-lg break-words leading-7 text-stone-600">{banner.supportingText}</p>
          <p className="mt-6 font-medium">{product.name} <span className="ml-2 tabular-nums">{new Intl.NumberFormat("ko-KR", { style: "currency", currency: product.currency }).format(product.price)}</span></p>
          <div className="mt-7 flex flex-wrap gap-3">
            {banner.actions.map((action, index) => <Link key={`${action.href}-${index}`} href={action.href}
              className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 ${index === 0 ? "bg-stone-950 text-white hover:bg-stone-700" : "border border-stone-400 hover:bg-white"}`}>
              {action.label}
            </Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}
