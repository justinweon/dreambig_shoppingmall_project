"use client"

import React from "react";
import {useState} from "react";
import Link from "next/link";
import { LanguageIcon, SearchIcon, CartIcon, UserIcon} from "@/lib/utils";
import SideMenu from "./SideMenu";

//상품데이터 가져오기
import { products } from "@/util/data/products"
import Image from "next/image"

interface ProductMenuItemProps {
imageUrl: string;
name: string;
}

export default function Header() {

const [isOpen, setIsOpen] = useState(false);
const [isCartOpen, setIsCartOpen] = useState(false);

  return(
    <>
    <header className="relative [&_button]:cursor-pointer [&_a]:cursor-pointer border-b border-black">
      <div className ="flex justify-between h-[70px] items-center bg-white text-black" onMouseLeave={()=>setIsOpen(false)}>
        <Link href="/" className='w-1/5'>로고</Link>
        <div className="grow">
          <nav className="flex justify-evenly">
            <button>About Sejong</button>
            <button 
            onMouseEnter = {() => setIsOpen(true)}
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
          <button type="button" onClick={()=> setIsCartOpen(true)}><CartIcon/></button>
        </div>
        
    </div>
    <div 
    aria-hidden={!isOpen}
    inert={!isOpen}
    className={`absolute top-full inset-x-0 z-50 bg-white text-black px-8 py-10 border-t border-gray-200 transition-opacity duration-200 ease-out ${
    isOpen
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  }`}
>
  <div className='flex justify-evenly'>
    {products.length > 0 && products.map((item) => <ProductMenuItem key={`${item.id}`} {...item} /> )}
  </div>
</div>
</header>
<SideMenu isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
</>

)}



// 목데이터 테스트2

interface ProductMenuItemProps {
  imageUrl: string;
  name: string;
  productId: number;
}

function ProductMenuItem({ imageUrl, name, productId }: ProductMenuItemProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Link href={`/product/${productId}`}>
        <Image
          src={imageUrl}
          alt={name}
          width={160}
          height={160}
          className="h-40 w-40 object-contain"
        />
        <p className="text-center font-medium">{name}</p>
      </Link>
    </div>
  );
}
