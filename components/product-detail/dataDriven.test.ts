import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";

// Node 렌더링 검증에서는 스타일을 읽지 않는다. 실제 CSS는 빌드와 브라우저에서 확인한다.
const requireComponent = createRequire(import.meta.url);
requireComponent.extensions[".css"] = () => {};
const ProductDetailPage = (requireComponent("./route/ProductDetailPage") as typeof import("./route/ProductDetailPage")).default;
import type { DetailTemplate, ProductDetailData, ProductReview } from "@/util/types/detail";

const reviews: ProductReview[] = [5, 4, 3, 5, 4].map((rating, index) => ({
  id: String(index), productId: 1, authorName: "작성자", rating: rating as ProductReview["rating"],
  body: "후기", createdAt: "2026-10-15", images: [],
}));
const data: ProductDetailData = {
  product: { id: 1, name: "테스트", price: 100, currency: "KRW", category: "굿즈", imageUrl: "/test.png", description: "" },
  templateId: "test", currency: "KRW", images: [], reviews, summary: "", highlights: [],
  features: [{ id: "story", title: "특징", points: ["설명"], image: { id: "photo", src: "/test.png", alt: "사진" } }],
  specifications: [{ label: "재질", value: "금속" }], notice: "", collectionName: "다른 컬렉션",
};
const template: DetailTemplate = { id: "test", name: "test", sections: [
  { id: "overview", kind: "overview", payload: { galleryFit: "contain" } },
  { id: "customer-voices", kind: "reviews", payload: { title: "고객 의견", pageSize: 4 } },
  { id: "materials", kind: "specifications", payload: { title: "재료 안내" } },
  { id: "story", kind: "features", payload: { title: "제작 이야기" } },
] };
const render = (value = data, layout = template) => renderToStaticMarkup(createElement(ProductDetailPage, { data: value, template: layout }));

test("목차의 순서와 제목, 링크 대상은 변경된 템플릿과 일치한다", () => {
  const html = render();
  const nav = html.match(/<nav class="ysh-detail-nav"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
  assert.ok(nav.indexOf("고객 의견") < nav.indexOf("재료 안내"));
  assert.ok(nav.indexOf("재료 안내") < nav.indexOf("제작 이야기"));
  for (const id of ["customer-voices", "materials", "story"]) {
    assert.ok(nav.includes('href="#product-' + id + '"'));
    assert.ok(html.includes('id="product-' + id + '"'));
  }
  assert.ok(html.includes("다른 컬렉션"));
});

test("빈 설명과 사양 및 제거된 리뷰 섹션은 목차와 바로가기에서도 빠진다", () => {
  const html = render({ ...data, features: [], specifications: [] }, {
    ...template, sections: template.sections.filter((section) => section.kind !== "reviews"),
  });
  assert.ok(!html.includes('class="ysh-detail-nav"'));
  assert.ok(!html.includes('href="#product-'));
});

test("평균 4.2는 84퍼센트 별점이며 후기 없음은 빈 별이다", () => {
  const populated = render();
  assert.ok(populated.includes("width:84%"));
  assert.ok(populated.includes("4.2 / 5, 후기 5개"));
  const empty = render({ ...data, reviews: [] });
  assert.ok(empty.includes("width:0%"));
  assert.ok(empty.includes("등록된 후기 없음"));
  assert.ok(empty.includes('id="product-customer-voices"'));
});

test("예시 후기 안내는 전달된 데이터가 있을 때만 나온다", () => {
  const notice = "예시 데이터 안내";
  assert.ok(render({ ...data, reviewNotice: notice }).includes(notice));
  assert.ok(!render().includes(notice));
  assert.ok(!render().includes("실제 구매 후기가 아닙니다"));
});
