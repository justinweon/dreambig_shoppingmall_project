import { cn } from "@/shared/utils/cn";
import { CrossIcon } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronRight} from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import CartRecomms from "../cart/CartRecomms";
import CartItem from "@/components/cart/CartItem";
import { products } from "@/util/data/products";



interface SideMenuProps {
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void
}
export default function SideMenu({isCartOpen, setIsCartOpen}: SideMenuProps) {

    const [isRotated, setIsRotated] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    let Product_num = 0;

useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isCartOpen && !dialog.open) {
    dialog.showModal();
    } else if (!isCartOpen && dialog.open) {
    dialog.close();
    }
}, [isCartOpen]);


    return (
        <dialog
        ref={dialogRef}
        aria-labelledby="cart-title"
        onClose={() => setIsCartOpen(false)}
        className="
        fixed inset-y-0 right-0 left-auto m-0
        h-dvh max-h-none w-[480px] max-w-full
        overflow-y-auto border-0 bg-white p-0 text-black
        backdrop:bg-black/20 backdrop:backdrop-blur-sm
        [&_button]:cursor-pointer
        "
        >
            <div className="flex justify-between border-b border-black">
                <div id = "cart-title" className="text-[22px] ml-[36px] mt-[24px] mb-[25px]">장바구니 ({Product_num})</div>
                <button type='button'
                onClick={() => setIsCartOpen(false)}
                onMouseEnter={() => setIsRotated(true)}
                onMouseLeave={() => setIsRotated(false)}
                >
                <CrossIcon className={`w-[28px] h-[28px] mr-[20px] origin-center transition-transform duration-200 ease-in-out ${isRotated ? "rotate-90" : "rotate-0" }
                `}
                />
                </button>
            </div>
            {/* <div className="h-[465px] flex flex-col items-center justify-center gap-4">
                <div className=""><ShoppingBasket className="h-20 w-20"/></div>
                <div className="">your cart is ready!</div>

                <Button 
                type = "button"
                className="
                            group h-[50px] w-[200px]
                            gap-0 overflow-hidden
                            bg-[#7DDD41] text-black hover:bg-[F#7DDD41]
                            transition-[width] duration-300 ease-in-out
                            hover:w-[230px] focus-visible:w-[230px]
                        ">
                    <span className="whitespace-nowrap" onClick={()=>setIsCartOpen(false)}>Continue Shopping</span>
                    <span
                        aria-hidden='true'
                        className="
                        inline-bloc w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:w-4 group-hover:opacity-100
                        group-focus-visible:ml-2
                        group-focus-visible:w-4
                        group-focus-visible:opacity-100"><ChevronRight/></span>
                </Button>
            </div> */}


            {/*목데이터 */}
            <CartItem
            name={products[0].name}
            price={products[0].price}
            imageUrl={products[0].imageUrl}
            />


            <div>
                <div className="text-2xl m-5">이런 제품도 있어요</div>
                <CartRecomms/>
            </div>
            
            <div>
                <div> Free Shipping  </div>
                <div>  </div>
                <div> 무료 배송 </div>
                <div> 무료 배송 </div>
            </div>
            
        </dialog>
        
    );
}