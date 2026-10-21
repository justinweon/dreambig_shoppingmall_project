"use client"

import { useState } from "react";
import Link from "next/link";
import { LanguageIcon, SearchIcon, CartIcon} from "@/lib/utils";
import SideMenu from "./SideMenu";
import ProductList from "../product/ProductList";
import Image from "next/image";
import sejongLogo from "@/shared/asset/sejong_logo.png";
import { useCart } from "../cart/CartProvider";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

//상품데이터 가져오기
import { products } from "@/util/data/products"
// 양석호: 메뉴도 공통 상품의 ID와 이미지 타입을 그대로 사용한다.
import type { Product } from "@/util/types/product";

type ProductMenuItemProps = Pick<Product, "id" | "imageUrl" | "name"> & {
  onSelect: () => void;
};

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const loginHref = isAuthPage ? "/login" : `/login?redirectTo=${encodeURIComponent(pathname)}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <>
      <header className="relative [&_button]:cursor-pointer [&_a]:cursor-pointer border-b border-black pr-8 pl-8" onMouseLeave={() => setIsOpen(false)}>
        
        <div className="flex justify-between h-[70px] items-center bg-white text-black">
          <Link href="/" className='w-1/8'><Image src={sejongLogo} alt="logo" width={120} height={40} /></Link>
          <div className="grow">
            <nav className="flex items-center justify-evenly gap-2 whitespace-nowrap text-xs sm:text-sm lg:text-base">
              <Link href="/about">세종이야기</Link>
              <Link
              href="/product"
                type="button"
                aria-expanded={isOpen}
                aria-controls="header-product-menu"
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(true)}
              >
                문화상품
              </Link>
              <button>도움마당</button>
            </nav>
          </div>


          <div className="ml-3 mr-6 flex shrink-0 items-center gap-3 lg:ml-12">
            <Link href=""><LanguageIcon /></Link>
            <button type="button" aria-label="검색" onClick={() => setIsSearchOpen((prev) => !prev)}><SearchIcon /></button>
            <UserMenu loginHref={loginHref} />
            <button type="button" aria-label="장바구니 열기" onClick={() => setIsCartOpen(true)}><CartIcon /></button>
          </div>

        </div>
        <div
          id="header-product-menu"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`absolute top-full inset-x-0 z-50 bg-white text-black px-8 py-10 border-t border-gray-200 transition-opacity duration-200 ease-out ${isOpen
            ? "opacity-100 bg-white/70 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex justify-evenly">
              {products.length > 0 &&
              products.map((item) => (
              <ProductList
              key={item.id}
              productId={item.id}
              {...item}
              imageUrl={item.eraseImageUrl}
              onSelect={() => setIsOpen(false)}
              />
              ))}
          </div>
        </div>
      </header>

      {/* 검색바 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-black ${
          isSearchOpen ? "max-h-20 py-3" : "max-h-0 py-0"
        }`}
      >
        <form
          className="flex items-center gap-2 max-w-xl mx-auto px-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("검색어:", searchQuery);
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="flex-1 border-black outline-none py-1 text-sm bg-transparent"
            autoFocus={isSearchOpen}
          />
          <button type="submit" className="text-sm font-medium">
            검색
          </button>
          <button
            type="button"
            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
            className="text-gray-400 hover:text-black text-lg leading-none"
          >
            ✕
          </button>
        </form>
      </div>

      <SideMenu isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>

  )
}

