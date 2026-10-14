export interface OverviewSectionTemplate {
  id: string;
  kind: "overview";
  payload: {
    galleryFit: "contain" | "cover";
  };
}

export interface SpecificationsSectionTemplate {
  id: string;
  kind: "specifications";
  payload: {
    title: string;
  };
}

export interface ReviewsSectionTemplate {
  id: string;
  kind: "reviews";
  payload: {
    title: string;
    pageSize: number;
  };
}

// kind를 확인하면 해당 섹션의 payload 타입도 함께 결정된다.
export type DetailSection =
  | OverviewSectionTemplate
  | SpecificationsSectionTemplate
  | ReviewsSectionTemplate;

export interface DetailTemplate {
  id: string;
  name: string;
  sections: readonly DetailSection[];
}

// 배열 순서가 화면 표시 순서다. 상품 내용이나 UI 상태는 저장하지 않는다.
export const detailTemplates: readonly DetailTemplate[] = [
  {
    id: "standard-product",
    name: "기본 상품 상세",
    sections: [
      {
        id: "overview",
        kind: "overview",
        payload: { galleryFit: "contain" },
      },
      {
        id: "specifications",
        kind: "specifications",
        payload: { title: "상품 사양" },
      },
      {
        id: "reviews",
        kind: "reviews",
        payload: { title: "구매 후기", pageSize: 4 },
      },
    ],
  },
];
