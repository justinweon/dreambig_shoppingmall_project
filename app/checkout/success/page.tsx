"use client";
// 정기 해치웠나..?
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/shared/lib/supabase-browser";
import { confirmTestPayment} from "@/components/payment/tossPayment";
import type { ConfirmedPayment } from "@/components/payment/tossPayment";

type ConfirmationRequest = {
    userId: string;
    orderId: string;
    paymentKey: string;
    amount: number;
    promise: Promise<ConfirmedPayment>;
};

type ConfirmationResult = {
    request: ConfirmationRequest;
    payment: ConfirmedPayment | null;
    error: string | null;
};

function PaymentSuccessContent(): React.JSX.Element {
    const searchParams = useSearchParams();

    const orderId = searchParams.get("orderId") ?? "";
    const paymentKey = searchParams.get("paymentKey") ?? "";
    const amountText = searchParams.get("amount") ?? "";
    const amount = Number(amountText);

    const [userId, setUserId] = useState<string | null | undefined>(
        undefined
    );
    const [result, setResult] = useState<ConfirmationResult | null>(null);

    // 같은 화면의 동일 요청은 진행 중인 Promise를 재사용
    const requestRef = useRef<ConfirmationRequest | null>(null);

    const isValid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId) &&
        paymentKey.length > 0 &&
        paymentKey.length <= 200 &&
        paymentKey.trim() === paymentKey &&
        /^[1-9]\d*$/.test(amountText) &&
        Number.isSafeInteger(amount) &&
        amount > 0;

    // 로그인 확인·계정 변경 감지
    useEffect(() => {
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user.id ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 주소 정보와 로그인 정보가 준비되면 서버 승인 요청
    useEffect(() => {
        if (!isValid || !userId) return;

        let active = true;
        let request = requestRef.current;

        if (
            !request ||
            request.userId !== userId ||
            request.orderId !== orderId ||
            request.paymentKey !== paymentKey ||
            request.amount !== amount
        ) {
            request = {
                userId,
                orderId,
                paymentKey,
                amount,
                promise: confirmTestPayment({
                    orderId,
                    paymentKey,
                    amount,
                }),
            };
            requestRef.current = request;
        }
        const currentRequest = request;

        currentRequest.promise.then(
            (payment) => {
                if (!active) return;

                setResult({
                    request: currentRequest,
                    payment,
                    error: null,
                });
            },
            (error: unknown) => {
                if (!active) return;

                setResult({
                    request: currentRequest,
                    payment: null,
                    error:
                        error instanceof Error
                        ? error.message
                        : "결제 처리 결과를 확인하지 못했습니다.",
                });
            }
        );
        // 화면·계정·주소가 바뀌면 이전 응답을 표시하지 않음
        return () => {
            active = false;
        };
    }, [isValid, userId, orderId, paymentKey, amount]);

    // 현재 계정과 주소에 해당하는 결과만 표시
    const currentResult =
        result &&
        result.request.userId === userId &&
        result.request.orderId === orderId &&
        result.request.paymentKey === paymentKey &&
        result.request.amount === amount
        ? result
        : null;

    if (!isValid) {
        return (
            <p className="text-sm leading-6 text-red-700">
                결제 확인에 필요한 주소 정보가 없거나 올바르지 않습니다.
                이 화면만으로 결제 완료를 판단하지 않습니다.
            </p>
        );
    }
    
    if (userId === undefined) {
        return <p className="text-sm text-gray-600">로그인 정보를 확인 중입니다.</p>;
    }

    if (userId === null) {
        return ( <p className="text-sm leading-6 text-red-700">
            주문한 계정으로 로그인한 뒤 이 주소를 다시 열어 주세요.
            새 결제를 시작하지 마세요.
        </p>
    );
}

if (currentResult?.payment) {
    return (
        <>
            <p className="font-semibold text-green-700">
                테스트 결제가 완료됐습니다.
            </p>
            <p className="break-all text-sm text-gray-700">
                주문번호: {currentResult.payment.orderId}
            </p>
            <p className="text-lg font-semibold text-gray-900">
                결제 금액:{" "}
                {currentResult.payment.amount.toLocaleString("ko-KR")}원
            </p>
            <p className="text-sm text-gray-600">
                서버 승인과 DB 반영을 확인했습니다.
            </p>
        </>
    );
}

if (currentResult?.error) {
    return (
        <>
            <p className="font-medium text-red-700">
                결제 결과 확인이 필요합니다.
            </p>
            <p role="alert" className="text-sm leading-6 text-red-700">
                {currentResult.error}
            </p>
            <p className="text-sm leading-6 text-gray-600">
                결제 실패로 확정된 것은 아닙니다.
                새 결제를 시작하지 말고 같은 주문으로 다시 확인해 주세요.
            </p>
            <button
                type='button'
                onClick={() => window.location.reload()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                    같은 주문으로 다시 확인
                </button>
        </>
    );
}

return (
    <p className="text-sm leading-6 text-gray-600">
        서버 승인과 DB 저장 결과를 확인 중입니다.
        새 결제를 시작하지 마세요.
    </p>
);

}

export default function PaymentSuccessPage(): React.JSX.Element {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-2xl font-semibold">
                테스트 결제 결과
            </h1>

            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <Suspense
                    fallback={
                        <p className="text-sm text-gray-600">
                            결제 정보를 불러오는 중입니다.
                        </p>
                    }
                >
                    <PaymentSuccessContent/>
                </Suspense>
            </div>

            <Link
                href="/checkout"
                className="mt-6 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                    주문 확인으로 돌아가기
                </Link>
                
        </main>
    );
}
