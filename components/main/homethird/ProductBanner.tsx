import Image from "next/image";
import Link from "next/link";
import type { ProductBannerData } from "@/util/types/home";
import type { Product } from "@/util/types/product";
import "./homethird.css";

export default function ProductBanner({ banner, product }: { banner: ProductBannerData; product: Product }) {
  return <section aria-label={banner.headline} className="homethird-product-hero">
    <Image src={banner.desktopImage.src} alt={banner.desktopImage.alt} fill sizes="100vw"
      className={`homethird-hero-image ${banner.mobileImage ? "homethird-hero-desktop" : ""}`} />
    {banner.mobileImage && <Image src={banner.mobileImage.src} alt={banner.mobileImage.alt} fill sizes="100vw" className="homethird-hero-image homethird-hero-mobile" />}
    <div className="homethird-hero-shade" />
    <div className="homethird-hero-content">
      <p>{banner.supportingText}</p>
      <h2>{banner.headline}<br /><span className="homethird-hero-price">{new Intl.NumberFormat("ko-KR", { style: "currency", currency: product.currency }).format(product.price)}</span></h2>
      <div className="homethird-hero-actions">{banner.actions.map((action, index) => <Link key={action.href} href={action.href} className={index === 0 ? "homethird-hero-outline" : "homethird-hero-primary"}>{action.label}</Link>)}</div>
    </div>
  </section>;
}
