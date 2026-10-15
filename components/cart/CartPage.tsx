
import {useState} from 'react';

import {CrossIcon} from "@/lib/utils"

export default function CartPage() {

  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <div>
      <div className="flex">
        <div>your cart</div>
        <div>X</div>
      </div>
      <div className="flex">
        <div>image</div>
        <div>quantity</div>
        <div>delete</div>
      </div>
      <div className="flex">
        <div>free shipping</div>
        <div>1-year warranty</div>
        <div>30-day returns</div>
        <div>secure checkout</div>
      </div>
      <div></div>
    </div>
  );
}
