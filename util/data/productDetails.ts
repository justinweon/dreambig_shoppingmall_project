import type { ProductDetailConfig } from "../types/detail";

// 데이터 관리/사용: 양석호(상세). productId는 products.ts의 고정 ID를 참조한다.
// 이름/가격/통화를 복사하지 않는다. images가 비어 있으면 조회 함수가 대표 이미지를 사용한다.
// 사양이 비어 있으면 화면에서 사양 섹션을 생략할 수 있다.
export const productDetailConfigs: readonly ProductDetailConfig[] = [
  {
    productId: 101,
    templateId: "standard-product",
    images: [],
    specifications: [
      { label: "데이터 구분", value: "화면 확인용 임시 사양" },
      { label: "표시 예시", value: "실제 상품 사양은 팀 데이터로 교체합니다." },
    ],
  },
  { productId: 102, templateId: "standard-product", images: [], specifications: [] },
  { productId: 103, templateId: "standard-product", images: [], specifications: [] },
  { productId: 104, templateId: "standard-product", images: [], specifications: [] },
  { productId: 105, templateId: "standard-product", images: [], specifications: [] },
  { productId: 106, templateId: "standard-product", images: [], specifications: [] },
];
