import type { CarouselItem, PartnerLogo, ProductBannerData } from "../types/home";

// 데이터 관리/사용: 양석호(메인 세 번째 영역). 배열 순서가 노출 순서다.
// 배너와 파트너 로고 콘텐츠는 아직 등록하지 않았다. 가짜 브랜드/링크를 만들지 않는다.
export const productBanners: readonly ProductBannerData[] = [];
export const partnerLogos: readonly PartnerLogo[] = [];

// 기존 목록의 여섯 상품 순서. 이름/가격/대표 이미지는 products.ts에서 ID로 조회한다.
export const carouselItems: readonly CarouselItem[] = [
  { id: "carousel-101", productId: 101 },
  { id: "carousel-103", productId: 103 },
  { id: "carousel-104", productId: 104 },
  { id: "carousel-102", productId: 102 },
  { id: "carousel-105", productId: 105 },
  { id: "carousel-106", productId: 106 },
];
