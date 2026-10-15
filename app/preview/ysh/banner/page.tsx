import ProductBanner from "@/components/main/ProductBanner";
import { productBanners } from "@/util/data/home";
import { getProductById } from "@/util/product";

export const metadata = { title: "세종 상품 배너 미리보기", robots: { index: false, follow: false } };
export default function BannerPreviewPage() {
  const banner = productBanners[0];
  const product = getProductById(banner.productId);
  return <main>{product && <ProductBanner banner={banner} product={product} />}</main>;
}
