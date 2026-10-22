"use client";

import { useActionState } from "react";
import { updateProductAction } from "@/domains/admin/actions/updateProduct.action";
import { INITIAL_ACTION_STATE } from "@/shared/types/action.types";
import type { ProductRow } from "@/util/api";

const inputClass =
"mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950";
const labelClass = "block text-[13px] font-semibold text-neutral-950";

type FormValues = {
name?: string;
category?: string;
imageUrl?: string;
description?: string;
priceMinor?: string;
displayOrder?: string;
};

export default function ProductEditForm({ product }: { product: ProductRow }) {
const [state, formAction, isPending] = useActionState(updateProductAction, INITIAL_ACTION_STATE);
const saved = (state.data ?? {}) as FormValues;
const errors = state.errors ?? {};

const errorText = (field: string) =>
    errors[field] ? <p className="mt-1 text-xs text-red-600">{errors[field]}</p> : null;

return (
    <form action={formAction} noValidate className="mt-8 max-w-xl bg-white p-8">
    <input type="hidden" name="id" value={product.id} />

    {state.message && (
        <p
        className={`mb-6 border p-3 text-[13px] ${
            state.success
            ? "border-neutral-300 bg-neutral-50 text-neutral-950"
            : "border-red-200 bg-red-50 text-red-600"
        }`}
        >
        {state.message}
        </p>
    )}

    <div className="mb-5">
        <label htmlFor="name" className={labelClass}>상품 이름</label>
        <input id="name" name="name" defaultValue={saved.name ?? product.name} className={inputClass} />
        {errorText("name")}
    </div>

    <div className="mb-5">
        <label htmlFor="category" className={labelClass}>분류</label>
        <input id="category" name="category" defaultValue={saved.category ?? product.category} className={inputClass} />
        {errorText("category")}
    </div>

    <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
        <label htmlFor="priceMinor" className={labelClass}>
            가격 ({product.currency}, 최소 단위)
        </label>
        <input
            id="priceMinor"
            name="priceMinor"
            type="number"
            inputMode="numeric"
            defaultValue={saved.priceMinor ?? product.price_minor}
            className={inputClass}
        />
        {errorText("priceMinor")}
        </div>
        <div>
        <label htmlFor="displayOrder" className={labelClass}>보여 주는 순서</label>
        <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            inputMode="numeric"
            defaultValue={saved.displayOrder ?? product.display_order}
            className={inputClass}
        />
        {errorText("displayOrder")}
        </div>
    </div>

    <div className="mb-5">
        <label htmlFor="imageUrl" className={labelClass}>대표 이미지 주소</label>
        <input id="imageUrl" name="imageUrl" defaultValue={saved.imageUrl ?? product.image_url} className={inputClass} />
        {errorText("imageUrl")}
    </div>

    <div className="mb-6">
        <label htmlFor="description" className={labelClass}>소개</label>
        <textarea
        id="description"
        name="description"
        rows={4}
        defaultValue={saved.description ?? product.description}
        className="mt-2 w-full border border-neutral-300 bg-white p-3 text-sm outline-none focus:border-neutral-950"
        />
    </div>

    <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
    >
        {isPending ? "저장하는 중..." : "저장하기"}
    </button>
    </form>
);
}