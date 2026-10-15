import Image from "next/image";
import type { ImageSource } from "@/util/types/product";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { TrashIcon } from "@/lib/utils";
// components/cart/CartItem.tsx
import QuantitySelector from "@/components/product-detail/components/QuantitySelector";

interface CartItemProps {
    name: string;
    price: number;
    imageUrl: ImageSource;
    quantity: number;
    onQuantityChange: (quantity:number) => void;
}

export default function CartItem({
    name,
    price,
    imageUrl,
    quantity,
    onQuantityChange
    }: CartItemProps) {
    
    
    return (
        <div className="border-b border-gray-200 flex gap-5 px-5 py-6">
            <div className="shrink-0">
                <Image
                src={imageUrl}
                alt={name}
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-lg font-medium">{name}</h3>
                <p className="mt-1 text-sm">
                {price.toLocaleString()}원
                </p>
            </div>
        
        <div className="flex items-center gap-8">
            <QuantitySelector value={quantity} onChange={onQuantityChange} />
            <button className="w-4 h-4">
                <TrashIcon/>
            </button>
        </div>
        </div>
    );
    }
