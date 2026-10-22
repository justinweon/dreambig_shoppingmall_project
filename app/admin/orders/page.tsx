import { Suspense } from "react";
import OrderList from "@/domains/admin/components/OrderList";

    export default function AdminOrdersPage() {
    return (
        <div>
        <h1 className="text-2xl font-extrabold text-neutral-950">주문 관리</h1>
        <p className="mt-2 text-sm text-neutral-600">최근 주문 20개를 최신순으로 보여 주노라.</p>

        <Suspense fallback={<p className="mt-8 text-sm text-neutral-500">주문을 불러오는 중...</p>}>
            <OrderList />
        </Suspense>
        </div>
    );
    }