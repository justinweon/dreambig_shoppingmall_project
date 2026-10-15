"use client";


import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/util/data/products";
import Link from "next/link";

export default function CartRecomms() {

    const carouselRef = useRef<HTMLDivElement>(null);

    function moveCarousel(direction: "prev" | "next") {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
    left:
        direction === "next"
        ? carousel.clientWidth
        : -carousel.clientWidth,
    behavior: "smooth",
    });
}
return (
    <div className="px-4">
    <div className="flex gap-4 overflow-x-hidden snap-x snap-mandatory py-3" ref={carouselRef}>
        {products.map((product) => (
        <div
            key={product.id}
            className="w-[200px] shrink-0 snap-start"
        >
            <Link href={`/product/${product.id}`}><ProductCard
            name={product.name}
            price={product.price}
            imageURL={product.imageUrl}
            
            /></Link>
        </div>
        ))}
    </div>
    <div className="mt-4 flex justify-end gap-2">
        <button
        type="button"
        aria-label="이전 상품 보기"
        onClick={() => moveCarousel("prev")}
        className="flex size-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
        <ChevronLeft aria-hidden="true" />
        </button>
        <button
        type="button"
        aria-label="다음 상품 보기"
        onClick={() => moveCarousel("next")}
        className="flex size-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
        <ChevronRight aria-hidden="true" />
        </button>
    </div>
    </div>
);
}

