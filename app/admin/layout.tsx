import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import AdminGuard from "@/domains/admin/components/AdminGuard";

const navClass =
    "block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950";

    export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-neutral-50">
        {/* 왼쪽: 사이드바 */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white px-4 py-8">
            <p className="px-3 text-lg font-extrabold text-neutral-950">훈민상점 관리</p>
            <nav className="mt-8 flex flex-col gap-1">
            <Link href="/admin/orders" className={navClass}>
                주문 관리
            </Link>
            <Link href="/admin/products" className={navClass}>
                상품 관리
            </Link>
            </nav>
            <Link href="/" className={`${navClass} mt-10 text-neutral-500`}>
            ← 쇼핑몰로 돌아가기
            </Link>
        </aside>

        {/* 오른쪽: 내용 (관리자 확인 후 보여 줌) */}
        <main className="flex-1 px-10 py-8">
            <Suspense fallback={<p className="text-sm text-neutral-500">관리자 확인 중...</p>}>
            <AdminGuard>{children}</AdminGuard>
            </Suspense>
        </main>
        </div>
    );
    }