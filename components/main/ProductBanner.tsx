import Image from "next/image";
import Link from "next/link";
import type { ProductBannerData } from "@/util/types/home";
import type { Product } from "@/util/types/product";
import "./homeThird.css";

export default function ProductBanner({ banner, product }: { banner: ProductBannerData; product: Product }) {
  return <section aria-label={banner.headline} className="ysh-product-hero">
    <Image src={banner.desktopImage.src} alt={banner.desktopImage.alt} fill sizes="100vw"
      className={`ysh-hero-image ${banner.mobileImage ? "ysh-hero-desktop" : ""}`} />
    {banner.mobileImage && <Image src={banner.mobileImage.src} alt={banner.mobileImage.alt} fill sizes="100vw" className="ysh-hero-image ysh-hero-mobile" />}
    <div className="ysh-hero-shade" />
    <div className="ysh-hero-content">
      <p>{banner.supportingText}</p>
      <h2>{banner.headline}<br /><span className="ysh-hero-price">{new Intl.NumberFormat("ko-KR", { style: "currency", currency: product.currency }).format(product.price)}</span></h2>
      <div className="ysh-hero-actions">{banner.actions.map((action, index) => <Link key={action.href} href={action.href} className={index === 0 ? "ysh-hero-outline" : "ysh-hero-primary"}>{action.label}</Link>)}</div>
    </div>
  </section>;
}
