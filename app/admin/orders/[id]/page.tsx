import { Suspense } from "react";
import Link from "next/link";
import OrderDetail from "@/domains/admin/components/OrderDetail";

export default function AdminOrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
return (
    <div>
    <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-950">
        ← 주문 목록
    </Link>
    <h1 className="mt-4 text-2xl font-extrabold text-neutral-950">주문 상세</h1>

    <Suspense fallback={<p className="mt-8 text-sm text-neutral-500">주문을 불러오는 중...</p>}>
        {params.then(({ id }) => (
        <OrderDetail orderId={id} />
        ))}
    </Suspense>
    </div>
);
}