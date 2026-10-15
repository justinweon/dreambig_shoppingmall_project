import { cn } from "@/shared/utils/cn";
import { CrossIcon } from "@/lib/utils";
import { Button } from "../ui/button";
import {useState} from "react"

interface SideMenuProps {
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void
}
export default function SideMenu({isCartOpen, setIsCartOpen}: SideMenuProps) {

const [isRotated, setIsRotated] = useState(false);

    return (
        <aside className={cn('fixed top-0 w-[480px] bg-red-200 h-full transition-all duration-700 [&_button]:cursor-pointer', isCartOpen ? 'right-0':'-right-[480px]')}>
            <div className="flex justify-between border-b border-black">
                <div className="text-[22px] ml-[36px] mt-[24px] mb-[25px]">Your Cart</div>
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
            <div className="h-[465px] grid place-content-center">
                <div className="">your cart is ready!</div>
                <Button className="h-[50px] w-[200px] bg-[#7DDD41] text-black">Continue Shopping</Button>
            </div>
            <div>
                <div>choose your setup</div>
                <div>products carousel</div>
            </div>
        </aside>
        
    );
}