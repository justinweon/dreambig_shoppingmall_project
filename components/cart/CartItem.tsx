import Image from "next/image";
import type { ImageSource } from "@/util/types/product";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { TrashIcon } from "@/lib/utils";

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
            <div className="flex items-center rounded-full border border-gray-300 px-3 py-1 gap-3">
                <button><Minus className="w-4 h-4"/></button>
                <span>1</span>
                <button><Plus className="w-4 h-4"/></button>
            </div>  
            <button className="w-4 h-4">
                <TrashIcon/>
            </button>
        </div>
        </div>
    );
    }
