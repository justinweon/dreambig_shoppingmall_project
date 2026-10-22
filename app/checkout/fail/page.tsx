import Link from "next/link";

export default function PaymentFailPage(): React.JSX.Element {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-2xl font-semibold">
                결제 진행 안내
            </h1>

            <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-800">
                    토스 인증이 실패했을 때 돌아올 화면입니다.
                </p>
                <p className="text-sm leading-6 text-red-700">
                    현재는 복귀 화면만 준비한 단계입니다.
                    이 화면에서는 주문 상태를 변경하지 않습니다.
                </p>
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
