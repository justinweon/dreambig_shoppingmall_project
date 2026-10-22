import Link from "next/link";

export default function PaymentSuccessPage(): React.JSX.Element {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-2xl font-semibold">
                결제 인증 결과
            </h1>

            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="font-medium text-gray-900">
                    토스 인증 후 돌아올 화면입니다.
                </p>
                <p className="text-sm leading-6 text-gray-600">
                    현재는 서버 승인 기능을 연결하기 전입니다.
                    이 화면만으로 결제 완료를 판단하지 않습니다.
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
