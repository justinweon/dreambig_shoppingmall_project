"use client";

import { useState } from "react";
import HomeThirdSection from "@/components/main/HomeThirdSection";
import ProductDetailPage from "@/components/product-detail/ProductDetailPage";
import type { CartAddResult } from "@/components/product-detail/cartConnection";
import { getProductDetailData } from "@/util/product";
import { products } from "@/util/data/products";
import { carouselItems } from "@/util/data/home";
import { detailTemplates } from "@/util/data/detailTemplates";
import type { PartnerLogo } from "@/util/types/home";
import type { AddToCartRequest } from "@/util/types/cart";

const sample_logos: readonly PartnerLogo[] = [
  { id: "sample-a", name: "샘플 로고 A", src: "/ysh-preview/sample-a.svg", row: 0 },
  { id: "sample-b", name: "샘플 로고 B", src: "/ysh-preview/sample-b.svg", row: 0 },
  { id: "sample-c", name: "샘플 로고 C", src: "/ysh-preview/sample-c.svg", row: 1 },
  { id: "sample-d", name: "샘플 로고 D", src: "/ysh-preview/sample-d.svg", row: 1 },
];

export default function YshPreview() {
  const [view, setView] = useState("main");
  const [count, setCount] = useState(6);
  const [product_id, setProductId] = useState(101);
  const [review_count, setReviewCount] = useState(5);
  const [empty_images, setEmptyImages] = useState(false);
  const [cart_mode, setCartMode] = useState("unavailable");
  const [request_log, setRequestLog] = useState<AddToCartRequest[]>([]);
  const base = getProductDetailData(product_id)!;
  const data = { ...base, reviews: base.reviews.slice(0, review_count), images: empty_images ? [] : base.images };

  async function simulateCart(request: AddToCartRequest): Promise<CartAddResult> {
    setRequestLog((log) => [...log, request]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (cart_mode === "throw") throw new Error("Preview failure");
    return cart_mode === "success" ? { ok: true } : { ok: false, message: "미리보기용 실패 응답입니다. 다시 시도할 수 있습니다." };
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-4 border-b px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">양석호 담당 영역 미리보기</h1>
        <p className="text-sm leading-6 text-muted-foreground">메인 세 번째 영역과 상품 상세의 독립 확인 화면입니다. 상품 설명과 후기는 로컬 예시 데이터이며, 카트 응답은 저장 없이 시뮬레이션합니다.</p>
        <label className="inline-flex items-center gap-3">확인 영역
          <select value={view} onChange={(event) => setView(event.target.value)} className="min-h-11 rounded border px-3">
            <option value="main">메인 세 번째 영역</option><option value="detail">상품 상세</option>
          </select>
        </label>
        {view === "main" ? <label className="ml-4 inline-flex items-center gap-3">캐러셀 상품 수
          <select value={count} onChange={(event) => setCount(Number(event.target.value))} className="min-h-11 rounded border px-3">
            {[0, 1, 3, 6].map((n) => <option key={n} value={n}>{n}개</option>)}
          </select>
        </label> : <div className="flex flex-wrap items-center gap-4 text-sm">
          <label>상품 <select value={product_id} onChange={(event) => setProductId(Number(event.target.value))} className="min-h-11 rounded border px-3">{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
          <label>리뷰 수 <select value={review_count} onChange={(event) => setReviewCount(Number(event.target.value))} className="min-h-11 rounded border px-3">{[0, 4, 5].map((n) => <option key={n} value={n}>{n}개</option>)}</select></label>
          <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={empty_images} onChange={(event) => setEmptyImages(event.target.checked)} />빈 갤러리</label>
          <label>카트 응답 <select value={cart_mode} onChange={(event) => setCartMode(event.target.value)} className="min-h-11 rounded border px-3"><option value="unavailable">미연결</option><option value="success">성공 예제</option><option value="failure">실패 예제</option><option value="throw">예외 예제</option></select></label>
          <output className="w-full break-all rounded bg-stone-100 p-3 text-stone-900">시뮬레이션 요청 {request_log.length}회: {JSON.stringify(request_log.at(-1) ?? null)}</output>
        </div>}
      </div>
      {view === "main" ? <main><HomeThirdSection products={products} items={carouselItems.slice(0, count)} logos={sample_logos} logoTitle="로고 모션 예제 — 실제 파트너 아님" /></main>
        : <ProductDetailPage data={data} template={detailTemplates[0]} onAddToCart={cart_mode === "unavailable" ? undefined : simulateCart} />}
    </>
  );
}
