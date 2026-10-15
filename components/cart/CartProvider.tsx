"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { CartItem, AddToCartRequest } from "@/util/types/cart";
import type { CartAddResult } from "@/components/product-detail/cartConnection";
import { getProductById } from "@/util/product";

// 다른 컴포넌트에 제공할 값의 타입
interface CartContextValue {
  items: readonly CartItem[];
  addItem: (request: AddToCartRequest) => CartAddResult;

  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  updateQuantity: (productId: CartItem["productId"], quantity: number) => void;
}

// 처음에는 연결된 Provider가 없으므로 null
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // 화면에 표시할 장바구니 목록
  const [items, setItems] = useState<readonly CartItem[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 빠르게 연속 호출돼도 최신 목록을 읽기 위한 값
  const itemsRef = useRef<readonly CartItem[]>([]);


  function addItem({
    productId,
    quantity,
  }: AddToCartRequest): CartAddResult {
    // 1. 실제로 존재하는 상품인지 검사
    if (!getProductById(productId)) {
      return {
        ok: false,
        message: "상품을 찾을 수 없습니다.",
      };
    }

    // 2. 수량 검사
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return {
        ok: false,
        message: "수량은 1 이상의 정수여야 합니다.",
      };
    }

    // 3. 이미 담긴 상품인지 확인
    const current = itemsRef.current;

    const existing = current.find(
      (item) => item.productId === productId,
    );

    const nextQuantity = (existing?.quantity ?? 0) + quantity;

    if (!Number.isSafeInteger(nextQuantity)) {
      return {
        ok: false,
        message: "추가할 수 있는 수량을 초과했습니다.",
      };
    }

    // 4. 이미 있으면 수량 합산, 없으면 새 항목 추가
    const nextItems = existing
      ? current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: nextQuantity }
          : item,
      )
      : [...current, { productId, quantity }];

    // 5. 최신 값과 화면 상태 갱신
    itemsRef.current = nextItems;
    setItems(nextItems);

    // 상품을 정상적으로 담았을 때만 모달 열기
    setIsCartOpen(true);

    return { ok: true };
  }

  function updateQuantity(productId: CartItem["productId"], quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) return;
  const nextItems = itemsRef.current.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
  itemsRef.current = nextItems;
  setItems(nextItems);
}

  return (
    <CartContext.Provider value={{ items, addItem, isCartOpen, setIsCartOpen, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
}

// 하위 컴포넌트에서 장바구니를 꺼내 쓰는 함수
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart는 CartProvider 안에서 사용해야 합니다.");
  }

  return context;
}