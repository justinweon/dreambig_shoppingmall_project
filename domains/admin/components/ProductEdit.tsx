import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createServerClient } from "@/shared/lib/supabase";
import { createDreambigApi } from "@/util/api";
import ProductEditForm from "@/domains/admin/components/ProductEditForm";

export default async function ProductEdit({ productId }: { productId: string }) {
    await connection();

    const id = Number(productId);
    if (!Number.isInteger(id) || id < 1) notFound();

    const api = createDreambigApi(createServerClient());
    const product = await api.products.getProduct(id);
    if (!product) notFound();

    return <ProductEditForm product={product} />;
    }