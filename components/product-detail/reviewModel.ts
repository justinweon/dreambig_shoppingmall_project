import type { ProductReview } from "@/util/types/detail";

export function getReviewSummary(reviews: readonly ProductReview[]) {
  return { count: reviews.length, average: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null };
}

export function getReviewPage(reviews: readonly ProductReview[], currentPage: number, pageSize: number) {
  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 4;
  const totalPages = Math.max(1, Math.ceil(reviews.length / size));
  const page = Math.min(Math.max(1, Number.isSafeInteger(currentPage) ? currentPage : 1), totalPages);
  return { page, totalPages, items: reviews.slice((page - 1) * size, page * size) };
}
