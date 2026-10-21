'use client'
// 정기 - 주문 확인 화면의 내용을 구성

import { useCart } from "../cart/CartProvider"
import { products } from "@/util/data/products"

export default function CheckOut(): React.JSX.Element {
    const {items, isCartLoading, cartError} = useCart();

    if (isCartLoading) {
        return(
            <main>
                <h1>주문확인</h1>
                <p>장바구니를 불러오는 중입니다.</p>
            </main>
        );
    }

    if (cartError) {
        return (
            <main>
                <h1>주문확인</h1>
                <p role='alert'>{cartError}</p>
            </main>
        )
    }

    const hasMissingProduct = items.some(
        (item) => !products.find(
            (product) => product.id === item.productId
        )
    );
    
    if (hasMissingProduct) {
        return (
            <main>
                <h1>주문확인</h1>
                <p>상품 정보를 찾을 수 없습니다. 장바구니를 확인해 주세요.</p>
            </main>
        )
    }

    const totalAmount = items.reduce((total, item) => {
        const product = products.find(
            (product) => product.id === item.productId
        );
        
        if (!product) return total;

        return total + product.price * item.quantity;
    } ,0);

    return (
        <main>
            <h1>주문확인</h1>

            {items.length === 0? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <>
                    <ul>
                        {items.map((item) => {
                            const product = products.find(
                                (product) => product.id === item.productId
                            );
                            if (!product) return null;

                            return (
                                <li key={item.productId}>
                                    <h2>{product.name}</h2>
                                    <p>수량: {item.quantity}개</p>
                                    <p>
                                        상품 금액:{" "}
                                        {(product.price * item.quantity).toLocaleString("ko-KR")}원
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                    <p>
                        전체 상품 금액: {totalAmount.toLocaleString("ko-KR")}원
                    </p>
                </>
            )}
        </main>
    );
}