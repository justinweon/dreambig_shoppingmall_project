import type { AddToCartRequest } from "@/util/types/cart";

/** 상세 구매 패널과 카트 저장소가 공유하는 담기 결과와 함수 타입. */
export type CartAddResult = { ok: true } | { ok: false; message: string };
export type AddToCartHandler = (request: AddToCartRequest) => CartAddResult | Promise<CartAddResult>;
