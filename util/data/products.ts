import type { Product } from "../types/product";
import keyRingImage from "@/shared/asset/sejong_key_ring.png";
import mugcupImage from "@/shared/asset/sejong_mug_cup.png";
import laptopImage from "@/shared/asset/sejong_laptop_cover.png";
import mousePadImage from "@/shared/asset/sejong_mouse_pad.png";
import photoCardImage from "@/shared/asset/sejong_photo_card.png";
import iMacImage from "@/shared/asset/sejong_iMac.png";

// 데이터 관리: 양석호 / 사용: 홍정기(목록), 양석호(상세/배너/캐러셀), 장바구니 담당자.
// 기존 여섯 상품의 이름/가격과 101/102 ID를 보존한 프로젝트 공통 데이터다.
// 현재 판매 정보가 아니라 개발용 카탈로그다. 분류/설명/통화는 운영 정보 확인 후 교체한다.
// 가격은 원 단위(KRW). 상품명/가격 변경은 이 파일 한곳에서 처리한다.
export const products: readonly Product[] = [
  {
    id: 101,
    name: "키링",
    price: 8000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: keyRingImage,
    description: "상세 화면 구성을 확인하기 위한 키링 예시 상품입니다.",
  },
  {
    id: 103,
    name: "노트북 커버",
    price: 25000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: laptopImage,
    description: "상품 목록과 상세 연결을 확인하기 위한 노트북 커버 예시입니다.",
  },
  {
    id: 104,
    name: "마우스패드",
    price: 12000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: mousePadImage,
    description: "상품 목록과 상세 연결을 확인하기 위한 마우스패드 예시입니다.",
  },
  {
    id: 102,
    name: "머그컵",
    price: 15000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: mugcupImage,
    description: "같은 템플릿에서 다른 상품을 표시하기 위한 머그컵 예시입니다.",
  },
  {
    id: 105,
    name: "포토카드",
    price: 3000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: photoCardImage,
    description: "상품 목록과 상세 연결을 확인하기 위한 포토카드 예시입니다.",
  },
  {
    id: 106,
    name: "월페이퍼",
    price: 2000,
    currency: "KRW",
    category: "개발용 굿즈",
    imageUrl: iMacImage,
    description: "상품 목록과 상세 연결을 확인하기 위한 월페이퍼 예시입니다.",
  },
];
