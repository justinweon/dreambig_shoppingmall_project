import { products as defaultProducts } from "@/util/data/products";
import { productBanners, carouselItems } from "@/util/data/home";
import type { Product } from "@/util/types/product";
import type { ProductBannerData, CarouselItem } from "@/util/types/home";
import ProductBanner from "./ProductBanner";
import ProductCarousel from "./ProductCarousel";
import HunminJeongeumMarquee from "./HunminJeongeumMarquee";

interface HomeThirdSectionProps {
  products?: readonly Product[];
  banners?: readonly ProductBannerData[];
  items?: readonly CarouselItem[];
}

/** 양석호 담당 영역. 메인 담당자는 원하는 위치에서 이 컴포넌트 하나를 렌더링한다. */
export default function HomeThirdSection({ products = defaultProducts, banners = productBanners, items = carouselItems }: HomeThirdSectionProps) {
  const product_by_id = new Map(products.map((product) => [product.id, product]));
  const entries = items.flatMap((item) => {
    const product = product_by_id.get(item.productId);
    return product ? [{ item, product }] : [];
  });
  return (
    <div className="homethird">
      {banners.map((banner) => {
        const product = product_by_id.get(banner.productId);
        return product ? <ProductBanner key={banner.id} banner={banner} product={product} /> : null;
      })}
      <ProductCarousel entries={entries} />
      <HunminJeongeumMarquee />
    </div>
  );
}
