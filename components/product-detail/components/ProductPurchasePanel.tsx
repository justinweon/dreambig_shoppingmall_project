"use client";

import { useRef, useState } from "react";
import type { AddToCartRequest } from "@/util/types/cart";
import QuantitySelector from "./QuantitySelector";
import type { AddToCartHandler } from "../cartConnection";

interface ProductPurchasePanelProps {
  productId: AddToCartRequest["productId"];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart?: AddToCartHandler;
}

export default function ProductPurchasePanel({
  productId,
  quantity,
  onQuantityChange,
  onAddToCart,
}: ProductPurchasePanelProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const pending_ref = useRef(false);

  async function handleAddToCart() {
    if (!onAddToCart || pending_ref.current) return;
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      setMessage("수량은 1 이상의 정수여야 합니다.");
      return;
    }
    pending_ref.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await onAddToCart({ productId, quantity });
      setMessage(result?.ok ? "장바구니에 담았습니다." : result?.message || "장바구니에 담지 못했습니다. 다시 시도해 주세요.");
    } catch {
      setMessage("장바구니에 담지 못했습니다. 다시 시도해 주세요.");
    } finally {
      pending_ref.current = false;
      setPending(false);
    }
  }

  return (
    <div className="space-y-5 border-t border-border pt-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">수량</p>
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          disabled={pending}
        />
      </div>

      <button
        type="button"
        disabled={!onAddToCart || pending}
        aria-busy={pending}
        className="min-h-12 w-full touch-manipulation rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleAddToCart}
      >
        {pending ? "담는 중…" : "장바구니 담기"}
      </button>
      {!onAddToCart && <p className="text-sm text-muted-foreground">현재 장바구니 담기를 사용할 수 없습니다.</p>}
      <p role="status" aria-live="polite" className="text-sm">{message}</p>
    </div>
  );
}
