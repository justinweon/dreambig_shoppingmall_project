import type { AddToCartRequest } from "@/util/types/cart";

/** 상세에서 소비하는 연결 계약. 실제 카트 저장소의 결과는 Client 연결부에서 변환한다. */
export type CartAddResult = { ok: true } | { ok: false; message: string };
export type AddToCartHandler = (request: AddToCartRequest) => CartAddResult | Promise<CartAddResult>;
