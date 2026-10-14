import type { ProductReview } from "../types/detail";
import keyRingImage from "@/shared/asset/sejong_key_ring.png";

// 데이터 관리/사용: 양석호(상세 리뷰와 사진 확대).
// 아래 5개는 기존 페이지 이동/사진 확대 테스트용 가상 리뷰이며 실제 구매 후기가 아니다.
// productId로 상품을 연결한다. 사진은 기존 상품 이미지를 재사용한 개발 예제다.
export const productReviews: readonly ProductReview[] = [
  {
    "id": "mock-review-101-1",
    "authorName": "테스트 작성자 1",
    "rating": 5,
    "body": "사진 확대 동작을 확인하기 위한 가상 리뷰입니다.",
    "createdAt": "2026-10-14T00:00:00.000Z",
    "images": [
      {
        "id": "mock-review-image-101-1",
        "src": keyRingImage,
        "alt": "리뷰 사진 확대 테스트용 키링 이미지"
      }
    ],
    "productId": 101
  },
  {
    "id": "mock-review-101-2",
    "authorName": "테스트 작성자 2",
    "rating": 4,
    "body": "사진이 없는 리뷰의 표시를 확인하기 위한 가상 리뷰입니다.",
    "createdAt": "2026-10-14T00:00:00.000Z",
    "images": [],
    "productId": 101
  },
  {
    "id": "mock-review-101-3",
    "authorName": "테스트 작성자 3",
    "rating": 3,
    "body": "별점 표시를 확인하기 위한 가상 리뷰입니다.",
    "createdAt": "2026-10-14T00:00:00.000Z",
    "images": [],
    "productId": 101
  },
  {
    "id": "mock-review-101-4",
    "authorName": "테스트 작성자 4",
    "rating": 5,
    "body": "첫 페이지의 마지막 항목을 확인하기 위한 가상 리뷰입니다.",
    "createdAt": "2026-10-14T00:00:00.000Z",
    "images": [],
    "productId": 101
  },
  {
    "id": "mock-review-101-5",
    "authorName": "테스트 작성자 5",
    "rating": 4,
    "body": "두 번째 페이지의 첫 항목을 확인하기 위한 가상 리뷰입니다.",
    "createdAt": "2026-10-14T00:00:00.000Z",
    "images": [],
    "productId": 101
  }
];
