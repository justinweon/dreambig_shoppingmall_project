import type { StaticImageData } from "next/image";

// 데이터 관리: 양석호 / 사용: 홍정기(상품 목록), 양석호(상세/메인), 장바구니 담당자.
// 상품 ID는 배열 위치와 무관한 고정 번호다. 기존 101(키링), 102(머그컵)는 유지한다.
export type ProductId = number;
export type Currency = "KRW" | "USD" | "JPY";
export type ImageSource = string | StaticImageData;

/** 모든 화면이 함께 사용하는 상품 원본. 이름과 가격을 다른 데이터에 복사하지 않는다. */
export interface Product {
  /** 목록 링크, 상세 조회, 장바구니에서 함께 사용하는 상품 식별자. */
  readonly id: ProductId;
  readonly name: string;
  /** 표시 단위 금액: KRW 원, USD 달러, JPY 엔. 환율 변환 값이 아니다. */
  readonly price: number;
  readonly currency: Currency;
  /** 화면에 표시할 상품 분류. */
  readonly category: string;
  /** 목록 카드의 대표 이미지. 갤러리 사진 목록과는 구분한다. */
  readonly imageUrl: ImageSource;
  readonly eraseImageUrl: ImageSource;
  
  /** 상세 상단에서 보여주는 상품 소개. */
  readonly description: string;


}

/** 이미지 선택과 리뷰 사진 확대에 쓰는 이미지 한 장. 배열 순서가 표시 순서다. */
export interface DetailImage {
  readonly id: string;
  readonly src: ImageSource;
  /** 이미지를 볼 수 없을 때 대신 전달할 설명. */
  readonly alt: string;
}
