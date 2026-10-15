"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductDetailData } from "@/util/types/detail";
import ImageModal from "./ImageModal";

interface ProductGalleryProps {
  images: ProductDetailData["images"];
  selectedImageId: string | null;
  onImageSelect: (imageId: string) => void;
  fit?: "contain" | "cover";
}

export default function ProductGallery({ images, selectedImageId, onImageSelect, fit = "contain" }: ProductGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const index = Math.max(0, images.findIndex((image) => image.id === selectedImageId));
  const selected = images[index];
  if (!selected) return <p>등록된 이미지가 없습니다.</p>;
  return <div className="ysh-gallery">
    <div className="ysh-gallery-stage">
      <button type="button" className="ysh-gallery-open" aria-label={`${selected.alt} 확대`} onClick={() => setExpanded(true)}>
        <Image src={selected.src} alt={selected.alt} width={640} height={640} sizes="(min-width: 1024px) 600px, 100vw"
          className="ysh-gallery-photo" style={{ objectFit: fit }} />
      </button>
      {images.length > 1 && <>
        <button type="button" className="ysh-gallery-arrow ysh-gallery-prev" aria-label="이전 상품 이미지" disabled={index === 0} onClick={() => onImageSelect(images[index - 1].id)}>‹</button>
        <button type="button" className="ysh-gallery-arrow ysh-gallery-next" aria-label="다음 상품 이미지" disabled={index === images.length - 1} onClick={() => onImageSelect(images[index + 1].id)}>›</button>
      </>}
    </div>
    <ul className="ysh-gallery-thumbs" aria-label="상품 이미지 목록">
      {images.map((image) => <li key={image.id}><button type="button" onClick={() => onImageSelect(image.id)} aria-label={`${image.alt} 선택`} aria-pressed={image.id === selected.id}>
        <Image src={image.src} alt="" width={76} height={76} />
      </button></li>)}
    </ul>
    {expanded && <ImageModal image={selected} onClose={() => setExpanded(false)} />}
  </div>;
}
