"use client"

import React from "react";
import {useState} from "react";
import Link from "next/link";
import { LanguageIcon, SearchIcon, CartIcon, UserIcon} from "@/lib/utils";
import SideMenu from "./SideMenu";
import ProductList from "../product/ProductList";

//상품데이터 가져오기
import { products } from "@/util/data/products"
// 양석호: 메뉴도 공통 상품의 ID와 이미지 타입을 그대로 사용한다.
import type { Product } from "@/util/types/product";
import Image from "next/image"

type ProductMenuItemProps = Pick<Product, "id" | "imageUrl" | "name"> & {
  onSelect: () => void;
};

export default function Header() {

const [isOpen, setIsOpen] = useState(false);
const [isCartOpen, setIsCartOpen] = useState(false);
console.log(products.length);
  return(
    <>
    <header className="relative [&_button]:cursor-pointer [&_a]:cursor-pointer border-b border-black" onMouseLeave={()=>setIsOpen(false)}>
      <div className ="flex justify-between h-[70px] items-center bg-white text-black">
        <Link href="/" className='w-1/5'>로고</Link>
        <div className="grow">
          <nav className="flex justify-evenly">
            <button>About Sejong</button>
            <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="header-product-menu"
            onMouseEnter = {() => setIsOpen(true)}
            onClick = {() => setIsOpen(true)}
            >
              Product
            </button>
            <button>Help Center</button>
          </nav>
        </div>

        
        <div className = "flex w-50 ml-50 gap-2 ">
          <Link href=""><LanguageIcon/></Link>
          <Link href=""><SearchIcon/></Link>
          <Link href=""><UserIcon/></Link>
          <button type="button" aria-label="장바구니 열기" onClick={()=> setIsCartOpen(true)}><CartIcon/></button>
        </div>
        
    </div>
    <div 
    id="header-product-menu"
    aria-hidden={!isOpen}
    inert={!isOpen}
    className={`absolute top-full inset-x-0 z-50 bg-white text-black px-8 py-10 border-t border-gray-200 transition-opacity duration-200 ease-out ${
    isOpen
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  }`}
>
  <div className='flex justify-evenly'>
    {products.length > 0 && products.map((item) => <ProductMenuItem key={item.id} {...item} onSelect={() => setIsOpen(false)} /> )}
  </div>
</div>
</header>
<SideMenu isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
</>

)}


function ProductMenuItem({ imageUrl, name }: ProductMenuItemProps) {

}
