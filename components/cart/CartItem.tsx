import Image from "next/image";
import type { ImageSource } from "@/util/types/product";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

interface CartItemProps {
    name: string;
    price: number;
    imageUrl: ImageSource;
}

export default function CartItem({
    name,
    price,
    imageUrl,
    }: CartItemProps) {
    return (
        <div className="flex gap-5 border-b border-gray-200 px-5 py-6">
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
        
        <div>
            <button><Plus /></button>
            <span></span>
            <button><Minus /></button>
        </div>
        </div>
    );
    }
