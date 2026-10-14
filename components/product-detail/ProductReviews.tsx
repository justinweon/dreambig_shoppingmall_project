import Image from "next/image";
import type { ProductDetailData } from "@/util/types/detail";
import type { DetailImage } from "@/util/types/product";

interface ProductReviewsProps {
  reviews: ProductDetailData["reviews"];
  onImageOpen: (image: DetailImage) => void;
}

export default function ProductReviews({
  reviews,
  onImageOpen,
}: ProductReviewsProps) {
  if (reviews.length === 0) {
    return <p>등록된 리뷰가 없습니다.</p>;
  }

  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id} className="border-b py-4">
          <p className="font-semibold">{review.authorName}</p>
          <p>평점: {review.rating} / 5</p>
          <p className="mt-2 whitespace-pre-wrap break-words">
            {review.body}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {review.images.map((image) => (
              <button
                key={image.id}
                type="button"
                aria-label={`${image.alt} 확대`}
                onClick={() => onImageOpen(image)}
                className="rounded border p-1 focus-visible:outline-2"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}