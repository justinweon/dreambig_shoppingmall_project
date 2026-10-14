import Image from "next/image";
import type { ProductDetailData } from "@/util/types/detail";

interface ProductGalleryProps {
  images: ProductDetailData["images"];
  selectedImageId: string | null;
  onImageSelect: (imageId: string) => void;
}

export default function ProductGallery({
  images,
  selectedImageId,
  onImageSelect,
}: ProductGalleryProps) {
  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0];

  if (!selectedImage) {
    return <p>등록된 이미지가 없습니다.</p>;
  }

  return (
    <div>
      <Image
        src={selectedImage.src}
        alt={selectedImage.alt}
        width={480}
        height={480}
        className="h-auto w-full max-w-[480px] object-contain"
      />

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onImageSelect(image.id)}
              aria-label={`${image.alt} 선택`}
              aria-pressed={image.id === selectedImage.id}
              className={`rounded border-2 p-1 focus-visible:outline-2 ${
                image.id === selectedImage.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.src}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}