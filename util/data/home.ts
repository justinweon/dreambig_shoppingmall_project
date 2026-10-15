import type { CarouselItem, PartnerLogo, ProductBannerData } from "../types/home";
// 양석호: 기존 상품 이미지를 배너 콘텐츠로 재사용한다.

// 데이터 관리/사용: 양석호(메인 세 번째 영역). 배열 순서가 노출 순서다.
export const productBanners: readonly ProductBannerData[] = [
  {
    id: "sejong-keyring",
    productId: 101,
    headline: "일상에 담은 작은 세종",
    supportingText: "가방과 열쇠에 더하는 나만의 세종 컬렉션",
    desktopImage: { src: "/ysh/sejong-keyring-hero.png", alt: "서재의 캔버스 가방에 걸린 세종 캐릭터 키링" },
    actions: [{ label: "자세히 보기", href: "/product/101#product-features" }, { label: "상품 보기", href: "/product/101" }],
  },
];
// 실제 파트너 자료를 제공받으면 등록한다. 미리보기용 샘플은 별도 fixture에서만 사용한다.
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
