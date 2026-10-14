import type { StaticImageData } from "next/image";
import keyRingImage from "../asset/sejong_key_ring.png";
import mugcupImage from "../asset/sejong_mugcup.png";

// 상세 화면 개발용 임시 계약이다. 팀 Product가 확정되면 연결부에서 교체한다.
// imageUrl의 실제 팀 타입은 미정이며, 여기서는 기존 이미지 import를 허용한다.
export interface MockDetailProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string | StaticImageData;
  description: string;
}

// 갤러리와 리뷰 사진이 공통으로 사용하는 이미지 구조다.
export interface DetailImage {
  id: string;
  src: string | StaticImageData;
  alt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string;
  images: readonly DetailImage[];
}

export interface ProductDetailData {
  product: MockDetailProduct;
  templateId: string;
  currency: "KRW" | "USD";
  images: readonly DetailImage[];
  specifications: readonly ProductSpecification[];
  reviews: readonly ProductReview[];
}

// 상품명과 가격 숫자는 기존 mockMerch를 참고했다.
// ID 101/102, 분류, 설명, 사양, 리뷰는 상세 개발용 가상 데이터다.
// KRW와 원 단위 표시는 임시 선택이며 팀 가격 계약이 확정된 것은 아니다.
// 팀 상품 데이터가 준비되면 이 배열의 상품 정보를 실제 ID 기준으로 연결한다.
export const mockProductDetails: readonly ProductDetailData[] = [
  {
    product: {
      id: 101,
      name: "키링",
      price: 8000,
      category: "개발용 굿즈",
      imageUrl: keyRingImage,
      description: "상세 화면 구성을 확인하기 위한 키링 예시 상품입니다.",
    },
    templateId: "standard-product",
    currency: "KRW",
    images: [
      { id: "key-ring-main", src: keyRingImage, alt: "키링 상품 이미지" },
    ],
    specifications: [
      { label: "데이터 구분", value: "화면 확인용 임시 사양" },
      { label: "표시 예시", value: "실제 상품 사양은 팀 데이터로 교체합니다." },
    ],
    // 가상 리뷰 5개로 페이지 크기 4일 때 4개 + 1개 표시를 확인할 수 있다.
    // 아래 사진도 실제 구매자 사진이 아닌 기존 상품 이미지다.
    reviews: [
      {
        id: "mock-review-101-1",
        authorName: "테스트 작성자 1",
        rating: 5,
        body: "사진 확대 동작을 확인하기 위한 가상 리뷰입니다.",
        createdAt: "2026-10-14T00:00:00.000Z",
        images: [
          {
            id: "mock-review-image-101-1",
            src: keyRingImage,
            alt: "리뷰 사진 확대 테스트용 키링 이미지",
          },
        ],
      },
      {
        id: "mock-review-101-2",
        authorName: "테스트 작성자 2",
        rating: 4,
        body: "사진이 없는 리뷰의 표시를 확인하기 위한 가상 리뷰입니다.",
        createdAt: "2026-10-14T00:00:00.000Z",
        images: [],
      },
      {
        id: "mock-review-101-3",
        authorName: "테스트 작성자 3",
        rating: 3,
        body: "별점 표시를 확인하기 위한 가상 리뷰입니다.",
        createdAt: "2026-10-14T00:00:00.000Z",
        images: [],
      },
      {
        id: "mock-review-101-4",
        authorName: "테스트 작성자 4",
        rating: 5,
        body: "첫 페이지의 마지막 항목을 확인하기 위한 가상 리뷰입니다.",
        createdAt: "2026-10-14T00:00:00.000Z",
        images: [],
      },
      {
        id: "mock-review-101-5",
        authorName: "테스트 작성자 5",
        rating: 4,
        body: "두 번째 페이지의 첫 항목을 확인하기 위한 가상 리뷰입니다.",
        createdAt: "2026-10-14T00:00:00.000Z",
        images: [],
      },
    ],
  },
  {
    product: {
      id: 102,
      name: "머그컵",
      price: 15000,
      category: "개발용 굿즈",
      imageUrl: mugcupImage,
      description: "같은 템플릿에서 다른 상품을 표시하기 위한 머그컵 예시입니다.",
    },
    templateId: "standard-product",
    currency: "KRW",
    images: [
      { id: "mugcup-main", src: mugcupImage, alt: "머그컵 상품 이미지" },
    ],
    // 사양과 리뷰가 없는 상품의 빈 상태 확인용이다.
    specifications: [],
    reviews: [],
  },
];
