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
    <div>
      <QuantitySelector
        value={quantity}
        onChange={onQuantityChange}
      />

      <button
        type="button"
        className="mt-4 rounded bg-black px-4 py-2 text-white"
        onClick={() => onAddToCart({ productId, quantity })}
      >
        장바구니 담기
      </button>
    </div>
  );
}