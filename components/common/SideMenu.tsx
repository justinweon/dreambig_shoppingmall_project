import { cn } from "@/shared/utils/cn";
import { CrossIcon, ReturnIcon } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { CardSimIcon, ChevronRight, VerifiedIcon } from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import CartRecomms from "../cart/CartRecomms";
import CartItem from "@/components/cart/CartItem";
import { products } from "@/util/data/products";
import { useCart } from "../cart/CartProvider";
import { ShippingIcon } from "@/lib/utils";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import Link from "next/link";




interface SideMenuProps {
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void
}
export default function SideMenu({ isCartOpen, setIsCartOpen }: SideMenuProps) {

    const [isRotated, setIsRotated] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const { items, updateQuantity, removeItem } = useCart();

    const product_num = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // 닫힌 상태에서 닫기 요청이 오면 할 일 없음
    if (!isCartOpen && !dialog.open) return;

    if (isCartOpen && !dialog.open) {
        dialog.showModal();
    }

    const animation = dialog.animate(
        isCartOpen
            ? [
                { transform: "translateX(100%)" },
                { transform: "translateX(0)" },
            ]
            : [
                { transform: "translateX(0)" },
                { transform: "translateX(100%)" },
            ],
        {
            duration: 400,
            easing: isCartOpen ? "ease-out" : "ease-in",
            fill: "forwards",
        },
    );

    animation.onfinish = () => {
        if (!isCartOpen) {
            dialog.close();
        }
    };

    // 상태가 바뀌거나 컴포넌트가 사라지면 이전 애니메이션 정리
    return () => {
        animation.onfinish = null;
        animation.cancel();
    };
}, [isCartOpen]);



    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="cart-title"
            onClose={() => setIsCartOpen(false)}

            onClick={(event) => {
            // 내부 상품이나 버튼 클릭은 무시
            if (event.target !== event.currentTarget) return;

            const rect = event.currentTarget.getBoundingClientRect();

            // 클릭한 좌표가 장바구니 영역 밖인지 확인
            const isOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

            if (isOutside) {
            setIsCartOpen(false);
            }
        }}
            className="
        fixed inset-y-0 right-0 left-auto m-0
        h-dvh max-h-none w-[480px] max-w-full
        overflow-y-auto border-0 bg-white p-0 text-black
        backdrop:bg-black/20 backdrop:backdrop-blur-sm
        [&_button]:cursor-pointer
        "
        >
            <div className="flex justify-between border-b border-black">
                <div
                    id="cart-title"
                    className="text-[22px] ml-[36px] mt-[24px] mb-[25px]"
                >
                    장바구니 ({product_num})
                </div>

                <button
                    type="button"
                    aria-label="장바구니 닫기"
                    onClick={() => setIsCartOpen(false)}
                    onMouseEnter={() => setIsRotated(true)}
                    onMouseLeave={() => setIsRotated(false)}
                >
                    <CrossIcon
                        className={`
            w-[28px] h-[28px] mr-[20px]
            origin-center transition-transform duration-200 ease-in-out
            ${isRotated ? "rotate-90" : "rotate-0"}
            `}
                    />
                </button>
            </div>

            {/* 담긴 상품이 없으면 안내, 있으면 상품 목록 표시 */}
            {items.length === 0 ? (
                <div className="h-[350px] flex flex-col items-center justify-center gap-4">
                    <div>
                        <ShoppingBasket className="h-20 w-20" />
                    </div>

                    <div>장바구니가 비어 있어요!</div>

                    <Button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="
            group h-[50px] w-[200px]
            gap-0 overflow-hidden
            bg-[#7DDD41] text-black hover:bg-[#7DDD41]
            transition-[width] duration-300 ease-in-out
            hover:w-[230px] focus-visible:w-[230px]
            "
                    >
                        <Link className="whitespace-nowrap" href="/product">
                            상품 보러 가기
                        </Link>

                        <span
                            aria-hidden="true"
                            className="
                inline-block w-0 overflow-hidden opacity-0
                transition-all duration-300 ease-in-out
                group-hover:ml-2 group-hover:w-4 group-hover:opacity-100
                group-focus-visible:ml-2
                group-focus-visible:w-4
                group-focus-visible:opacity-100
            "
                        >
                            <ChevronRight />
                        </span>
                    </Button>
                </div>
            ) : (
                <div>
                    {items.map((item) => {
                        // 장바구니의 상품 ID로 이름, 가격, 이미지를 찾는다.
                        const product = products.find(
                            (product) => product.id === item.productId,
                        );

                        if (!product) return null;

                        return (
                            <CartItem
                                key={item.productId}
                                name={product.name}
                                price={product.price}
                                imageUrl={product.imageUrl}
                                quantity={item.quantity}
                                onQuantityChange={(q) => updateQuantity(item.productId, q)}
                                onRemove={() => removeItem(item.productId)}
                                
                            />
                        );
                    })}
                </div>
            )}

            {/* 정기 장바구니 -> 주문 확인 화면 연결 */}
            {items.length > 0 && (
                <div className="p-5">
                    <Link
                        href="/checkout"
                        onClick={() => setIsCartOpen(false)}
                        className="flex h-[50px] w-full items-center justify-center bg-[#7DDD41] text-black"
                        >
                            구매하기
                    </Link>
                </div>
            )}
            <div>
                <div className="text-2xl m-5">이런 제품도 있어요</div>
                <div className="border-b pb-5">
                <CartRecomms />
                </div>

            </div>
            
            <div className="grid grid-cols-2 col-start place-items-start text-gray-300 pt-10 pb-10 [&_div]:flex [&_div]:gap-4 [&_div]:items-cente">
                <div className="ml-6 mb-4"> <ShippingIcon/> <div>Free Shipping</div> </div>
                <div > <VerifiedIcon/> <div>1-Year Warranty</div> </div>
                <div className="ml-6"> <ReturnIcon/> <div>30-Day Returns</div> </div>
                <div className="ml-1"> <FaMoneyBill/> <div>Checkout</div> </div>
            </div>
            
        </dialog>
    );
}