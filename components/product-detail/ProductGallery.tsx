import Image from "next/image";
import type { ProductDetailData } from "@/util/types/detail";

interface ProductGalleryProps {
  images: ProductDetailData["images"];
  selectedImageId: string | null;
  onImageSelect: (imageId: string) => void;
  fit?: "contain" | "cover";
}

export default function ProductGallery({
  images,
  selectedImageId,
  onImageSelect,
  fit = "contain",
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
        className={`aspect-square h-auto w-full rounded-2xl bg-stone-50 ${fit === "cover" ? "object-cover" : "object-contain"}`}
        sizes="(min-width: 1024px) 50vw, 100vw"
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
