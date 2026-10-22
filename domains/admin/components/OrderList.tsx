import { createServerClient } from "@/shared/lib/supabase";
import { createDreambigServerApi } from "@/util/api/server";
import Link from "next/link";
import { ORDER_STATUS_LABEL } from "@/domains/admin/utils/orderStatus";

// 모든 회원의 주문을 최신순으로 보여 주는 표
export default async function OrderList() {
const api = createDreambigServerApi(createServerClient());

// 주문 목록과 회원 목록을 동시에 가져온다
const [orders, profiles] = await Promise.all([
    api.admin.listOrders(),
    api.admin.listProfiles(1, 100),
]);

// 회원 id → 닉네임 찾기표
const nicknameById = new Map(profiles.map((profile) => [profile.id, profile.nickname]));

if (orders.length === 0) {
    return <p className="mt-8 text-sm text-neutral-500">아직 들어온 주문이 없느니라.</p>;
}

return (
    <table className="mt-8 w-full border-collapse bg-white text-sm">
    <thead>
        <tr className="border-b border-neutral-950 text-left text-neutral-500">
        <th className="px-4 py-3 font-medium">주문번호</th>
        <th className="px-4 py-3 font-medium">주문일</th>
        <th className="px-4 py-3 font-medium">주문자</th>
        <th className="px-4 py-3 font-medium">주문자id</th>
        <th className="px-4 py-3 text-right font-medium">금액</th>
        <th className="px-4 py-3 font-medium">상태</th>
        </tr>
    </thead>
    <tbody>
        {orders.map((order) => (
        <tr key={order.id} className="border-b border-neutral-200">
            <td className="px-4 py-3 font-mono text-xs">
                <Link href={`/admin/orders/${order.id}`} className="border-b border-neutral-950 hover:text-neutral-500">
                    {order.id.slice(0, 8)}
                </Link>
            </td>
            <td className="px-4 py-3">{new Date(order.created_at).toLocaleString("ko-KR")}</td>
            <td className="px-4 py-3">{nicknameById.get(order.user_id) ?? order.user_id.slice(0, 8)}</td>
            <td className="px-4 py-3 font-mono text-xs">{order.user_id.slice(0, 8)}</td>
            <td className="px-4 py-3 text-right">{order.amount_minor.toLocaleString("ko-KR")}원</td>
            <td className="px-4 py-3">{ORDER_STATUS_LABEL[order.status]}</td>
        </tr>
        ))}
    </tbody>
    </table>
);
}