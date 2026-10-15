import type { ImageSource, ProductId } from "../types/product";
import keyMain from "@/shared/asset/sejong_key_ring.png";
import keyGallery from "@/shared/asset/sejong_key_ring_1.png";
import keyFeature from "@/shared/asset/sejong_key_ring_2.png";
import keyHover from "@/shared/asset/sejong_key_ring_3.png";
import keyReview from "@/shared/asset/sejong_key_ring_4.png";
import mugMain from "@/shared/asset/sejong_mug_cup.png";
import mugGallery from "@/shared/asset/sejong_mug_cup_1.png";
import mugFeature from "@/shared/asset/sejong_mug_cup_2.png";
import mugHover from "@/shared/asset/sejong_mug_cup_3.png";
import laptopMain from "@/shared/asset/sejong_laptop_cover.png";
import laptopGallery from "@/shared/asset/sejong_laptop_cover_1.png";
import laptopFeature from "@/shared/asset/sejong_laptop_cover_2.png";
import laptopHover from "@/shared/asset/sejong_laptop_cover_3.png";
import padMain from "@/shared/asset/sejong_mouse_pad.png";
import padGallery from "@/shared/asset/sejong_mouse_pad_1.png";
import padFeature from "@/shared/asset/sejong_mouse_pad_2.png";
import padHover from "@/shared/asset/sejong_mouse_pad_3.png";
import photoMain from "@/shared/asset/sejong_photo_card.png";
import photoGallery from "@/shared/asset/sejong_photo_card_1.png";
import photoFeature from "@/shared/asset/sejong_photo_card_2.png";
import macMain from "@/shared/asset/sejong_iMac.png";
import macGallery from "@/shared/asset/sejong_iMac_1.png";
import macFeature from "@/shared/asset/sejong_iMac_2.png";

interface ProductMedia {
  readonly gallery: readonly ImageSource[];
  readonly feature: ImageSource;
  readonly hover?: ImageSource;
  readonly review?: ImageSource;
}
// 양석호 담당 이미지 배정. 사진 하나를 여러 설명 블록의 채움 이미지로 반복하지 않는다.
// API 연결 시 ImageSource에 URL 문자열을 전달할 수 있다.
export const productMedia: Readonly<Record<ProductId, ProductMedia>> = {
  101: { gallery: [keyMain, keyGallery], feature: keyFeature, hover: keyHover, review: keyReview },
  102: { gallery: [mugMain, mugGallery], feature: mugFeature, hover: mugHover },
  103: { gallery: [laptopMain, laptopGallery], feature: laptopFeature, hover: laptopHover },
  104: { gallery: [padMain, padGallery], feature: padFeature, hover: padHover },
  105: { gallery: [photoMain, photoGallery], feature: photoFeature },
  106: { gallery: [macMain, macGallery], feature: macFeature, hover: "/images/sejong-imac-hover.png" },
};
