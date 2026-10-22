import { Suspense } from "react";
import ProductTable from "@/domains/admin/components/ProductTable";

export default function AdminProductsPage() {
return (
    <div>
    <h1 className="text-2xl font-extrabold text-neutral-950">상품 관리</h1>
    <p className="mt-2 text-sm text-neutral-600">
        DB에 등록된 상품을 보여 주는 순서대로 보여 주노라.
    </p>

    <Suspense fallback={<p className="mt-8 text-sm text-neutral-500">상품을 불러오는 중...</p>}>
        <ProductTable />
    </Suspense>
    </div>
);
}