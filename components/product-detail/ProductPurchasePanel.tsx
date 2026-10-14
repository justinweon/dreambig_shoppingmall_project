import type { AddToCartRequest } from "@/util/types/cart";
import QuantitySelector from "./QuantitySelector";

interface ProductPurchasePanelProps {
  productId: AddToCartRequest["productId"];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (request: AddToCartRequest) => void;
}

export default function ProductPurchasePanel({
  productId,
  quantity,
  onQuantityChange,
  onAddToCart,
}: ProductPurchasePanelProps) {
  return (
    <div className="space-y-5 border-t border-border pt-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">수량</p>
        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
        />
      </div>

      <button
        type="button"
        className="min-h-12 w-full touch-manipulation rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        onClick={() => onAddToCart({ productId, quantity })}
      >
        장바구니 담기
      </button>
    </div>
  );
}
