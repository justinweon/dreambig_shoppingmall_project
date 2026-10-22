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
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-semibold">주문확인</h1>
                <p className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm leading-6 text-gray-600">
                    장바구니를 불러오는 중입니다.
                </p>
            </main>
        );
    }

    if (cartError) {
        return (
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-semibold">주문확인</h1>
                <p 
                    role='alert'
                    className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700"
                >
                    {cartError}
                </p>
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
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-semibold">주문확인</h1>
                <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700">
                    상품 정보를 찾을 수 없습니다. 장바구니를 확인해 주세요.
                </p>
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
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-semibold">주문확인</h1>

            {items.length === 0? (
                <p className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm leading-6 text-gray-600">
                    장바구니가 비어있습니다.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
                    <ul className="min-w-0 divide-y divide-gray-200 rounded-xl border border-gray-200 p-6 lg:col-span-2">
                        {items.map((item) => {
                            const product = cartProducts.find(
                                (product) => product.id === item.productId
                            );
                            if (!product) return null;

                            return (
                            <li key={item.productId}
                                className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-gray-900">
                                        {product.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        수량: {item.quantity}개
                                    </p>
                                </div>

                                <p className="shrink-0 text-base font-semibold text-gray-900">
                                    상품 금액: {" "}
                                    {(product.price * item.quantity).toLocaleString("ko-KR")}원
                                </p>
                            </li>
                            )
                        })}
                    </ul>
                    <section className="min-w-0 rounded-xl border border-gray-200 p-6">
                        <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>
                        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-gray-200 pb-5">
                            <span className="text-sm text-gray-600">
                                전체 상품 금액
                            </span>

                            <strong className="text-2xl font-bold text-gray-900">
                                {totalAmount.toLocaleString("ko-KR")}원
                            </strong>
                        </div>
                        
                        <div className="my-5 rounded-lg bg-gray-50 p-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                결제 수단
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                카드결제 · 테스트
                            </p>
                        </div>

                        <button
                        type='button'
                        onClick={handleCreateOrder}
                        disabled={isCreatingOrder}
                        className="w-full cursor-pointer rounded-lg bg-[#7ddd41] px-4 py-3 text-base font-semibold text-black transition-colors hover:bg-[#70cc37]
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreatingOrder ? "주문 생성중 ..." : "주문 생성"}
                        </button>
                        {orderError && (
                            <p 
                            role='alert'
                            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                            >
                            {orderError}
                            </p>
                        )}
                        {createOrder && (
                            <section className="mt-5 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                                <h3 className="text-base font-semibold text-gray-900">생성된 주문</h3>
                                <p className="break-all text-xs leading-5 text-gray-500">주문번호 : {createOrder.id}</p>
                                
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className="text-gray-600">
                                    DB 확정 금액
                                </span>
                                <strong className="text-base font-semibold text-gray-900">
                                    {createOrder.amount_minor.toLocaleString("ko-KR")}원
                                </strong>
                            </div>
                            <p className="text-gray-600">
                                주문 상태:{" "}
                                <span className="font-medium text-gray-900">
                                    {createOrder.status === "paid"
                                    ? "이미 결제 완료된 주문"
                                    : "결제 대기"}
                                </span>
                            </p>
                            </section>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}