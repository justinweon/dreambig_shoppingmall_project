"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { CartItem, AddToCartRequest } from "@/util/types/cart";
import type { CartAddResult } from "@/components/product-detail/cartConnection";
import { getProductById } from "@/util/product";
import { supabase } from "@/shared/lib/supabase-browser";
import { fetchCartItems, addCartItem } from "./cartRepository";

// 다른 컴포넌트에 제공할 값의 타입
interface CartContextValue {
  items: readonly CartItem[];
  addItem: (request: AddToCartRequest) => Promise<CartAddResult>;

  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  isCartLoading: boolean;

  cartError: string | null;

  //장바구니 추가
  updateQuantity: (productId: CartItem["productId"], quantity: number) => void;

  //장바구니 아이템 삭제
  removeItem: (productId: CartItem["productId"]) => void;

}

// 처음에는 연결된 Provider가 없으므로 null
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // 화면에 표시할 장바구니 목록
  const [items, setItems] = useState<readonly CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  // 빠르게 연속 호출돼도 최신 목록을 읽기 위한 값
  const itemsRef = useRef<readonly CartItem[]>([]);

  const cartOwnerRef = useRef<{
    userId: string | null;
    ready: boolean;
  } | null>(null);

  const addPendingRef = useRef(false);
  // 아래 정기 작성 106줄까지
  useEffect(() => {
    let active = true;
    let requestNumber = 0;
    let currentUserId: string | null | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        const userId = session?.user.id ?? null;

        if (userId === currentUserId) return;

        currentUserId = userId;
        cartOwnerRef.current = {userId, ready:false};
        const thisRequest = ++requestNumber;

        if (timer !== undefined) clearTimeout(timer);

        itemsRef.current = [];
        setItems([]);
        setCartError(null);
        setIsCartLoading(userId !== null);

        if (!userId) return;

        timer = setTimeout(async () => {
          try {
            const nextItems = await fetchCartItems(userId);

            if (!active || thisRequest !== requestNumber) return;

            itemsRef.current = nextItems;
            setItems(nextItems);
            if (cartOwnerRef.current) {
              cartOwnerRef.current.ready = true;
            }
          } catch {
            if (!active || thisRequest !== requestNumber) return;

            setCartError('장바구니를 불러오지 못했습니다.');
          } finally {
            if (active && thisRequest === requestNumber) {
              setIsCartLoading(false);
            }
          }
        }, 0);
      });

    return () => {
      active = false;
      cartOwnerRef.current = null;
      requestNumber += 1;

      if (timer !== undefined) clearTimeout(timer);

      subscription.unsubscribe();
    };

  }, []);
// 정기 수정 183줄까지 상품을 DB에 담고 
  async function addItem({
    productId,
    quantity,
  }: AddToCartRequest): Promise<CartAddResult>{
    if (!getProductById(productId)) {
      return { ok: false, message: "상품을 찾을 수 없습니다."}
    }

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return { ok: false, message: "수량은 1 이상의 정수여야 합니다."}
    }

    const owner = cartOwnerRef.current;

    if (!owner?.userId) {
      return { ok: false, message: "로그인 후 이용해주세요."}
    }

    if (!owner.ready) {
      return {
        ok: false,
        message: "장바구니 조회가 완료되지 않았습니다. 조회 오류 시 새로고침 해주세요."
      }
    }

    if (addPendingRef.current) {
      return { ok: false, message: "상품을 담는 중입니다. 잠시 기다려 주세요."}
    }

    addPendingRef.current = true;

    try {
      const savedItem = await addCartItem({ productId, quantity});

      if (cartOwnerRef.current !== owner) {
        return {
          ok: false,
          message: "로그인 상태가 변경되었습니다. 현재 장바구니를 확인해 주세요.",
        };
      }
      
      const current = itemsRef.current;
      const existing = current.some(
        (item) => item.productId === productId,
      );

      const nextItems = existing
      ? current.map((item) => 
        item.productId === savedItem.productId ? savedItem : item,
      )
      : [...current, savedItem];

      itemsRef.current = nextItems;
      setItems(nextItems);
      setIsCartOpen(true);
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: "담기 결과를 확인하지 못했습니다. 새로고침 후 수량을 확인해 주세요"
      };
    } finally {
      addPendingRef.current = false;
    }

  }
  function updateQuantity(productId: CartItem["productId"], quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;
    const nextItems = itemsRef.current.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    itemsRef.current = nextItems;
    setItems(nextItems);
  }

  //장바구니 아이템 삭제
  function removeItem(productId: CartItem["productId"]) {
    // 삭제하려는 상품을 제외한 나머지만 남김
    const nextItems = itemsRef.current.filter(
      (item) => item.productId !== productId,
    );

    itemsRef.current = nextItems;
    setItems(nextItems);
  }



  return (
    <CartContext.Provider value={{
      items,
      addItem,
      isCartOpen,
      setIsCartOpen,
      updateQuantity,
      removeItem,
      isCartLoading,
      cartError
    }}>
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


