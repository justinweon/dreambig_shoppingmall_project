import { Suspense } from "react";
import Link from "next/link";
import ProductEdit from "@/domains/admin/components/ProductEdit";

export default function AdminProductEditPage({ params }: PageProps<"/admin/products/[id]">) {
    return (
        <div>
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-neutral-950">
            ← 상품 목록
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-950">상품 수정</h1>

        <Suspense fallback={<p className="mt-8 text-sm text-neutral-500">상품을 불러오는 중...</p>}>
            {params.then(({ id }) => (
            <ProductEdit productId={id} />
            ))}
        </Suspense>
        </div>
    );
}