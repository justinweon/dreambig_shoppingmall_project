import { test } from "node:test";
import assert from "node:assert/strict";
import type { ProductReview } from "@/util/types/detail";
import { getReviewPage, getReviewSummary } from "./reviewModel";

const reviews: ProductReview[] = [5, 4, 3, 5, 4].map((rating, i) => ({ id: String(i), productId: 101, authorName: "검증", rating: rating as ProductReview["rating"], body: "", createdAt: "2026-10-15", images: [] }));

test("리뷰 0/4/5개 경계와 마지막 페이지를 처리한다", () => {
  assert.deepEqual(getReviewPage([], 1, 4), { page: 1, totalPages: 1, items: [] });
  assert.equal(getReviewPage(reviews.slice(0, 4), 1, 4).totalPages, 1);
  assert.deepEqual(getReviewPage(reviews, 2, 4).items, [reviews[4]]);
});
test("데이터 감소와 잘못된 페이지 설정을 보정한다", () => {
  assert.equal(getReviewPage(reviews.slice(0, 4), 2, 4).page, 1);
  assert.equal(getReviewPage(reviews, -2, 0).items.length, 4);
  assert.equal(getReviewPage(reviews, NaN, NaN).page, 1);
});
test("평균과 개수는 현재 페이지가 아닌 전체 리뷰 기준이다", () => {
  assert.deepEqual(getReviewSummary(reviews), { count: 5, average: 4.2 });
  assert.deepEqual(getReviewSummary([]), { count: 0, average: null });
});
