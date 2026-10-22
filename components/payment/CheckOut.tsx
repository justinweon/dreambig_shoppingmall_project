'use client'
// 정기 - 주문 확인 화면의 내용을 구성
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/shared/lib/supabase-browser";
import type { CartItem } from "@/util/types/cart";
import type { OrderRow } from "@/util/api/types";
import {
    createCheckoutOrder,
    getCheckoutRequestId,
} from "./orderRepository"

import { useCart } from "../cart/CartProvider"

export default function CheckOut(): React.JSX.Element {
    const {items, cartProducts, isCartLoading, cartError} = useCart();
    // 주문 생성 진행 상태와 오류
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [ orderError, setOrderError ] = useState<string | null>(null);

    // 생성 당시 장바구니와 주문 결과를 함께 보관
    const [orderResult, setOrderResult] = useState<{
        items: readonly CartItem[];
        order: OrderRow;
    } | null>(null);

    // 연속 클릭 제한
    const orderPendingRef = useRef(false);

    // 늦게 도착한 이전 계정·장바구니의 응답 구분
    const orderScopeRef = useRef<{
        userId: string | null;
    } | null>(null);

    useEffect(() => {
        let currentUserId: string | null | undefined;

        orderScopeRef.current = {userId: null};

        const {data: {subscription} } =
        supabase.auth.onAuthStateChange((_event, session) => {
            const userId = session?.user.id ?? null;

            if(userId === currentUserId) return;

            currentUserId = userId;
            orderScopeRef.current = { userId };
            setOrderResult(null);
            setOrderError(null);
        });

        return () => {
            orderScopeRef.current = null;
            subscription.unsubscribe();
        };
    }, [items]);

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
        (item) => !cartProducts.find(
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
        const product = cartProducts.find(
            (product) => product.id === item.productId
        );
        
        if (!product) return total;

        return total + product.price * item.quantity;
    } ,0);
    
    // 현재 장바구니로 생성한 주문만 표시
    const createOrder =
    orderResult && orderResult.items === items
        ? orderResult.order
        : null;

    async function handleCreateOrder(): Promise<void> {
        if (
            orderPendingRef.current ||
            isCartLoading ||
            cartError ||
            hasMissingProduct ||
            items.length === 0
        ) {
            return;
        }

    const scope = orderScopeRef.current;

    if (!scope?.userId) {
        setOrderError("로그인 후 주문을 생성해주세요.");
        return;
    }

    orderPendingRef.current = true;
    setIsCreatingOrder(true);
    setOrderError(null);
    setOrderResult(null);

    try {
        // 같은 회원·상품·수량의 요청번호 재사용
        const requestId = getCheckoutRequestId(scope.userId, items);

        // 가격 계산과 주문 저장은 DB에서 처리
        const order = await createCheckoutOrder(requestId, items);

        // 대기 중 계정이나 장바구니가 바뀌었으면 표시하지 않음
        if (orderScopeRef.current !== scope ) return;
        if (order.user_id !== scope.userId) {
            throw new Error('주문의 회원 정보가 일치하지 않습니다.');
        }

        setOrderResult({items, order});
    } catch {
        if (orderScopeRef.current === scope ) {
            setOrderError(
                "주문 생성 결과를 확인하지 못했습니다. 같은 상품과 수량으로 다시 시도해 주세요."
            );
        }
    } finally {
        orderPendingRef.current = false;

        if (orderScopeRef.current !== null) {
            setIsCreatingOrder(false);
        }
    }
}

    return (
        <main>
            <h1>주문확인</h1>

            {items.length === 0? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <>
                    <ul>
                        {items.map((item) => {
                            const product = cartProducts.find(
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

                    <section>
                        <button
                        type='button'
                        onClick={handleCreateOrder}
                        disabled={isCreatingOrder}
                        >
                            {isCreatingOrder ? "주문 생성중 ..." : "주문 생성"}
                        </button>
                        {orderError && (
                            <p role='alert'>{orderError}</p>
                        )}
                        {createOrder && (
                            <section>
                                <h2>생성된 주문</h2>
                                <p>주문번호 : {createOrder.id}</p>
                                <p>
                                    DB 확정 금액 :{" "}
                                    {createOrder.amount_minor.toLocaleString("ko-KR")}원
                                </p>
                                <p>
                                    주문 상태:{" "}
                                    {createOrder.status === "paid"
                                    ? "이미 결제 완료된 주문"
                                : "결제 대기"}
                                </p>
                            </section>
                        )}
                        <h2>결제수단</h2>
                        <p>카드결제</p>
                    </section>

                </>
            )}
        </main>
    );
}