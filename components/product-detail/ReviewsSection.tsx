"use client";

import { useState } from "react";
import type { ProductDetailData } from "@/util/types/detail";
import type { DetailImage } from "@/util/types/product";
import ProductReviews from "./ProductReviews";

interface ReviewsSectionProps {
  title: string;
  reviews: ProductDetailData["reviews"];
  pageSize: number;
}

export default function ReviewsSection({
  title,
  reviews,
  pageSize,
}: ReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 크기가 잘못 들어오면 기본값 4를 사용한다.
  const size =
    Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 4;

  const totalPages = Math.max(1, Math.ceil(reviews.length / size));

  // 리뷰 개수가 줄어들어도 존재하는 페이지를 표시한다.
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * size;
  const visibleReviews = reviews.slice(startIndex, startIndex + size);

  function handleImageOpen(image: DetailImage) {
    console.log("확대할 리뷰 사진:", image);
  }

  return (
    <section>
      <h2>{title}</h2>

      <ProductReviews
        reviews={visibleReviews}
        onImageOpen={handleImageOpen}
      />

      {totalPages > 1 && (
        <nav
          aria-label="리뷰 페이지"
          className="mt-4 flex items-center gap-3"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            이전
          </button>

          <span aria-live="polite">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            다음
          </button>
        </nav>
      )}
    </section>
  );
}
