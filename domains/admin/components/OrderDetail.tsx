    import { notFound } from "next/navigation";
    import { createServerClient } from "@/shared/lib/supabase";
    import { createDreambigServerApi } from "@/util/api/server";
    import { DreambigApiError } from "@/util/api";
    import { ORDER_STATUS_LABEL } from "@/domains/admin/utils/orderStatus";  

    const sectionTitleClass = "mb-3 text-sm font-semibold text-neutral-950";

    const won = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
    const formatDate = (iso: string) => new Date(iso).toLocaleString("ko-KR");

    // 주문 한 건의 정보와 주문 상품 목록
    export default async function OrderDetail({ orderId }: { orderId: string }) {
    const api = createDreambigServerApi(createServerClient());

    // 주소가 주문번호 모양이 아니면(INVALID_INPUT) "없는 주문"으로 처리
    const result = await api.admin.getOrder(orderId).catch((error) => {
        if (error instanceof DreambigApiError && error.code === "INVALID_INPUT") return null;
        throw error;
    });
    if (!result) notFound();

    const { order, items } = result;

    return (
        <div className="mt-8 flex flex-col gap-10">
        {/* 주문 정보 */}
        <section>
            <h2 className={sectionTitleClass}>주문 정보</h2>
            <dl className="grid grid-cols-[120px_1fr] gap-y-3 bg-white p-6 text-sm">
            <dt className="text-neutral-500">주문번호</dt>
            <dd className="font-mono text-xs">{order.id}</dd>
            <dt className="text-neutral-500">상태</dt>
            <dd>{ORDER_STATUS_LABEL[order.status]}</dd>
            <dt className="text-neutral-500">주문일</dt>
            <dd>{formatDate(order.created_at)}</dd>
            <dt className="text-neutral-500">결제일</dt>
            <dd>{order.paid_at ? formatDate(order.paid_at) : "-"}</dd>
            <dt className="text-neutral-500">주문자 id</dt>
            <dd className="font-mono text-xs">{order.user_id}</dd>
            <dt className="text-neutral-500">결제 금액</dt>
            <dd className="font-semibold">{won(order.amount_minor)}</dd>
            </dl>
        </section>

        {/* 주문 상품 */}
        <section>
            <h2 className={sectionTitleClass}>주문 상품</h2>
            <table className="w-full border-collapse bg-white text-sm">
            <thead>
                <tr className="border-b border-neutral-950 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">상품명</th>
                <th className="px-4 py-3 text-right font-medium">단가</th>
                <th className="px-4 py-3 text-right font-medium">수량</th>
                <th className="px-4 py-3 text-right font-medium">합계</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                <tr key={item.product_id} className="border-b border-neutral-200">
                    <td className="px-4 py-3">{item.product_name}</td>
                    <td className="px-4 py-3 text-right">{won(item.unit_price_minor)}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{won(item.unit_price_minor * item.quantity)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </section>
        </div>
    );
    }