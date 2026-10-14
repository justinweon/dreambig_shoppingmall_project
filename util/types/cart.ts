import type { ProductId } from "./product";

// 데이터 계약 관리: 양석호 / 사용: 양석호(담기 요청), 장바구니 담당자(이름 확인 필요).
// 저장소와 담기 함수는 카트 담당자가 구현한다. 이 파일은 저장소 구현이 아니다.
/** 옵션 없는 현재 상품의 카트 항목. 같은 상품의 수량은 한 항목에서 관리한다. */
export interface CartItem {
  readonly productId: ProductId;
  /** 1 이상의 정수. 실제 값 검증은 카트 함수에서 해야 한다. */
  readonly quantity: number;
}

/** 상세 화면이 장바구니에 전달하는 값. quantity는 추가하려는 수량이다. */
export interface AddToCartRequest {
  readonly productId: ProductId;
  readonly quantity: number;
}
