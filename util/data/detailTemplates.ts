import type { DetailTemplate } from "../types/detail";

// 데이터 관리/사용: 양석호(상세 화면 구성).
// 상품 내용은 저장하지 않는다. sections 배열 순서와 kind로 컴포넌트를 선택한다.
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
        id: "features",
        kind: "features",
        payload: { title: "상품 이야기" },
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
