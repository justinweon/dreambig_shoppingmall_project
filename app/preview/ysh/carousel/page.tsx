import ProductCarousel from "@/components/main/ProductCarousel";
import { carouselItems } from "@/util/data/home";
import { getProductById } from "@/util/product";

export const metadata = { title: "세종 상품 캐러셀 미리보기", robots: { index: false, follow: false } };
export default function CarouselPreviewPage() {
  const entries = carouselItems.flatMap((item) => { const product = getProductById(item.productId); return product ? [{ item, product }] : []; });
  return <main><ProductCarousel entries={entries} /></main>;
}
