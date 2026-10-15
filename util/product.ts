import { products } from "./data/products";
import { productDetailConfigs } from "./data/productDetails";
import { productReviews } from "./data/reviews";
import type { ProductDetailData } from "./types/detail";
import type { ProductId } from "./types/product";

// 관리: 양석호 / 사용: 상품 ID로 내용을 조회하는 목록, 상세, 메인, 장바구니 담당자.
/** 존재하지 않는 ID는 undefined. 배열 index나 상품명으로 상품을 찾지 않는다. */
export function getProductById(productId: ProductId) {
  return products.find((product) => product.id === productId);
}

/** 상세용 조회. 상품 원본과 상세 설정, 리뷰를 ID로 연결하며 원본 배열을 수정하지 않는다. */
export function getProductDetailData(productId: ProductId): ProductDetailData | undefined {
  const product = getProductById(productId);
  const config = productDetailConfigs.find((detail) => detail.productId === productId);
  // 상품이나 설정 누락을 임의의 다른 상품으로 대체하지 않는다.
  if (!product || !config) return undefined;

  return {
    product,
    templateId: config.templateId,
    currency: product.currency,
    // 갤러리 미등록 상품도 대표 이미지는 표시한다. 추가 사진은 상세 설정에 등록한다.
    images: config.images.length > 0 ? config.images : [
      { id: `${product.id}-main`, src: product.imageUrl, alt: `${product.name} 상품 이미지` },
    ],
    specifications: config.specifications,
    summary: config.summary,
    highlights: config.highlights,
    features: config.features,
    notice: config.notice,
    reviews: productReviews.filter((review) => review.productId === productId),
  };
}
