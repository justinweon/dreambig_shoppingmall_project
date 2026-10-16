import type { ImageSource, ProductId } from "./product";

// 데이터 관리/사용: 양석호(메인 세 번째 영역).
// 메인 조립: 홍정기(첫 영역), 원정린(두 번째 영역). 각 영역의 문구는 해당 컴포넌트 담당.
/** 배너 버튼의 문구와 이동할 주소. 장바구니 실행 함수는 저장하지 않는다. */
export interface BannerAction {
  readonly label: string;
  readonly href: string;
}

/** 상품을 소개하는 배너. 상품명과 가격은 productId로 공통 상품에서 조회한다. */
export interface ProductBannerData {
  readonly id: string;
  readonly productId: ProductId;
  readonly headline: string;
  readonly supportingText: string;
  readonly desktopImage: { readonly src: ImageSource; readonly alt: string };
  /** 모바일 전용 이미지가 없으면 desktopImage를 사용한다. */
  readonly mobileImage?: { readonly src: ImageSource; readonly alt: string };
  readonly actions: readonly BannerAction[];
}

/** 캐러셀 노출 순서와 카드 전용 정보. 상품 원본은 복사하지 않는다. */
export interface CarouselItem {
  readonly id: string;
  readonly productId: ProductId;
  readonly hoverImage?: { readonly src: ImageSource; readonly alt: string };
  readonly marketingDescription?: string;
}
