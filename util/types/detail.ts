import type { DetailImage, Product, ProductId } from "./product";

// 데이터 관리/사용: 양석호(상품 상세). 공통 상품 정보는 Product 타입을 사용한다.
/** 화면에 표시할 사양 한 줄. value에는 필요한 단위를 함께 적는다. */
export interface ProductSpecification {
  readonly label: string;
  readonly value: string;
}

/** 상품에 연결되는 리뷰. 현재 리뷰 데이터는 실제 구매 후기가 아닌 개발 예제다. */
export interface ProductReview {
  readonly id: string;
  readonly productId: ProductId;
  readonly authorName: string;
  readonly isExample?: boolean;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly body: string;
  /** ISO 8601 형식 작성 시각. */
  readonly createdAt: string;
  /** 사진 없는 리뷰는 빈 배열. */
  readonly images: readonly DetailImage[];
}

/** 상품마다 달라지는 상세 설정. 이름, 가격, 통화는 공통 상품에만 저장한다. */
export interface ProductDetailConfig {
  readonly productId: ProductId;
  readonly templateId: string;
  readonly images: readonly DetailImage[];
  readonly specifications: readonly ProductSpecification[];
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly features: readonly ProductFeature[];
  readonly notice: string;
  readonly collectionName: string;
}

/** 설명 사진은 갤러리 사진과 별도로 배정한다. */
export interface ProductFeature {
  readonly id: string;
  readonly title: string;
  readonly points: readonly string[];
  readonly image: DetailImage;
}

/** 조회 함수가 상품, 설정, 리뷰를 조합한 화면 전달 객체. 별도로 저장하지 않는다. */
export interface ProductDetailData {
  readonly product: Product;
  readonly templateId: string;
  readonly images: readonly DetailImage[];
  readonly specifications: readonly ProductSpecification[];
  readonly reviews: readonly ProductReview[];
  readonly reviewNotice?: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly features: readonly ProductFeature[];
  readonly notice: string;
  readonly collectionName: string;
}

export interface FeaturesSectionTemplate {
  readonly id: string;
  readonly kind: "features";
  readonly payload: { readonly title: string };
}

/** 상세 상단: 갤러리와 상품 정보, 구매 영역의 묶음. */
export interface OverviewSectionTemplate {
  readonly id: string;
  readonly kind: "overview";
  readonly payload: { readonly galleryFit: "contain" | "cover" };
}

/** 사양 섹션 제목 설정. 사양 내용은 ProductDetailConfig에 둔다. */
export interface SpecificationsSectionTemplate {
  readonly id: string;
  readonly kind: "specifications";
  readonly payload: { readonly title: string };
}

/** 리뷰 섹션 제목과 한 페이지에 표시할 개수. */
export interface ReviewsSectionTemplate {
  readonly id: string;
  readonly kind: "reviews";
  readonly payload: { readonly title: string; readonly pageSize: number };
}

// kind는 컴포넌트 종류, id는 템플릿 안에서 유일한 React key다.
export type DetailSection =
  | OverviewSectionTemplate
  | FeaturesSectionTemplate
  | SpecificationsSectionTemplate
  | ReviewsSectionTemplate;

/** 화면 구성만 저장한다. sections 배열 순서가 실제 렌더링 순서다. */
export interface DetailTemplate {
  readonly id: string;
  readonly name: string;
  readonly sections: readonly DetailSection[];
}
