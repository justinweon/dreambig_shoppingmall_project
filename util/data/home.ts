import type { CarouselItem, PartnerLogo, ProductBannerData } from "../types/home";
// 양석호: 기존 상품 이미지를 배너 콘텐츠로 재사용한다.
import keyRingImage from "@/shared/asset/sejong_key_ring.png";

// 데이터 관리/사용: 양석호(메인 세 번째 영역). 배열 순서가 노출 순서다.
export const productBanners: readonly ProductBannerData[] = [
  {
    id: "sejong-keyring",
    productId: 101,
    headline: "작은 소품에 담은 세종의 이야기",
    supportingText: "매일 손이 가는 물건에 좋아하는 이야기를 더해 보세요. DreamBig의 세종 컬렉션을 만나보세요.",
    desktopImage: { src: keyRingImage, alt: "세종 캐릭터 키링" },
    mobileImage: { src: keyRingImage, alt: "세종 캐릭터 키링" },
    actions: [{ label: "키링 자세히 보기", href: "/product/101" }, { label: "상품 둘러보기", href: "/product" }],
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
