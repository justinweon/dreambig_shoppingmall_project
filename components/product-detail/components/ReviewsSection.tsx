"use client";

import { useState } from "react";
import type { ProductDetailData } from "@/util/types/detail";
import type { DetailImage } from "@/util/types/product";
import ProductReviews from "./ProductReviews";
import ImageModal from "./ImageModal";
import { getReviewPage, getReviewSummary } from "../reviewModel";

interface ReviewsSectionProps {
  id: string;
  notice?: string;
  title: string;
  reviews: ProductDetailData["reviews"];
  pageSize: number;
}

export default function ReviewsSection({
  id,
  notice,
  title,
  reviews,
  pageSize,
}: ReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewImage, setSelectedReviewImage] = useState<DetailImage | null>(null);

  const { page, totalPages, items: visibleReviews } = getReviewPage(reviews, currentPage, pageSize);
  const summary = getReviewSummary(reviews);

  function handleImageOpen(image: DetailImage) {
    setSelectedReviewImage(image);
  }

  return (
    <section id={id} aria-label={title} className="productdetailpage-detail-reviews">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="text-sm tabular-nums">{summary.average === null ? "평점 없음" : `평균 ${summary.average.toFixed(1)} / 5`} <span className="ml-3">리뷰 {summary.count}개</span></p>
      </div>
      {notice && <p className="mb-6 text-sm text-stone-500">{notice}</p>}

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

      {selectedReviewImage && (
        <ImageModal
          key={selectedReviewImage.id}
          image={selectedReviewImage}
          onClose={()=> setSelectedReviewImage(null)}
        />
      )

      }
    </section>
  );
}
