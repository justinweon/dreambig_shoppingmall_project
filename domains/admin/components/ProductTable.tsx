import { connection } from "next/server";
import Link from "next/link";
import { createServerClient } from "@/shared/lib/supabase";
import { createDreambigApi } from "@/util/api";

// price_minor(최소 화폐 단위) → 화면에 보일 가격
function formatPrice(priceMinor: number, currency: "KRW" | "USD" | "JPY") {
if (currency === "USD") return `$${(priceMinor / 100).toFixed(2)}`;
if (currency === "JPY") return `${priceMinor.toLocaleString("ko-KR")}엔`;
return `${priceMinor.toLocaleString("ko-KR")}원`;
}

// DB에 있는 상품을 보여 순서대로 보여 주는 표
export default async function ProductTable() {
    await connection();
const api = createDreambigApi(createServerClient());
const products = await api.products.listProducts({ pageSize: 100 });

if (products.length === 0) {
    return <p className="mt-8 text-sm text-neutral-500">DB에 등록된 상품이 없느니라.</p>;
}

return (
    <table className="mt-8 w-full border-collapse bg-white text-sm">
    <thead>
        <tr className="border-b border-neutral-950 text-left text-neutral-500">
        <th className="px-4 py-3 font-medium">이미지</th>
        <th className="px-4 py-3 font-medium">ID</th>
        <th className="px-4 py-3 font-medium">이름</th>
        <th className="px-4 py-3 font-medium">분류</th>
        <th className="px-4 py-3 text-right font-medium">가격</th>
        <th className="px-4 py-3 text-right font-medium">순서</th>
        <th className="px-4 py-3" />
        </tr>
    </thead>
    <tbody>
        {products.map((product) => (
        <tr key={product.id} className="border-b border-neutral-200">
            <td className="px-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url} alt={product.name} className="size-12 object-cover" />
            </td>
            <td className="px-4 py-3 font-mono text-xs">{product.id}</td>
            <td className="px-4 py-3">{product.name}</td>
            <td className="px-4 py-3 text-neutral-600">{product.category}</td>
            <td className="px-4 py-3 text-right">{formatPrice(product.price_minor, product.currency)}</td>
            <td className="px-4 py-3 text-right">{product.display_order}</td>
            <td className="px-4 py-3 text-right">
            <Link
                href={`/admin/products/${product.id}`}
                className="border-b border-neutral-950 hover:text-neutral-500"
            >
                수정
            </Link>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
);
}