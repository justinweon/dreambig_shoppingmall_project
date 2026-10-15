"use client";

import type { ProductDetailData } from "@/util/types/detail";
import type { DetailTemplate } from "@/util/types/detail";
import OverviewSection from "../components/OverviewSection";
import ProductSpecifications from "../components/ProductSpecifications";
import ReviewsSection from "../components/ReviewsSection";
import type { AddToCartHandler } from "../cartConnection";
import ProductFeatures from "../components/ProductFeatures";
import Link from "next/link";
import "../productDetail.css";
import { getVisibleDetailSections, getSectionAnchor } from "../sectionModel";

interface ProductDetailPageProps {
  data: ProductDetailData;
  template: DetailTemplate;
  onAddToCart?: AddToCartHandler;
}

export default function ProductDetailPage({ data, template, onAddToCart }: ProductDetailPageProps) {
  // 가격 숫자를 통화 형식의 문자열로 바꾸는 코드
  // 달러 → "$8,000.00"
  //new Intl.NumberFormat("en-US", {
  //  style: "currency",
  //  currency: "USD",
  //}).format(8000);

  // 엔화 → "￥8,000"
  //new Intl.NumberFormat("ja-JP", {
  //  style: "currency",
  //  currency: "JPY",
  //}).format(8000);

  // ProductInfo로 이전 계획중
  //const formatted_price = new Intl.NumberFormat("ko-KR", {
  //  style: "currency",
  //  currency: data.currency,
  //}).format(product.price);

  const sections = getVisibleDetailSections(template, data);
  const navigation = sections.filter((section) => section.kind !== "overview");
  const reviewSection = sections.find((section) => section.kind === "reviews");
  const reviewHref = reviewSection ? `#${getSectionAnchor(reviewSection)}` : undefined;

  return (
    <main className="ysh-product-page"><div className="ysh-detail-inner">
      <nav aria-label="현재 위치" className="ysh-breadcrumbs"><ol><li><Link href="/">홈</Link></li><li><Link href="/product">상품</Link></li><li aria-current="page">{data.product.name}</li></ol></nav>
      {sections.map((section) => {
        switch (section.kind) {
          case "overview":
            return <div key={`${data.product.id}-${section.id}`}><OverviewSection reviewHref={reviewHref} data={data} galleryFit={section.payload.galleryFit} onAddToCart={onAddToCart} />
              {navigation.length > 0 && <nav className="ysh-detail-nav" aria-label="상품 상세 목차">
                {navigation.map((item) => <a key={item.id} href={`#${getSectionAnchor(item)}`}>{item.payload.title}</a>)}
              </nav>}</div>;
          case "features":
            return <ProductFeatures id={getSectionAnchor(section)} key={section.id} title={section.payload.title} features={data.features} />;
          case "specifications":
            return <ProductSpecifications id={getSectionAnchor(section)} key={section.id} title={section.payload.title} specifications={data.specifications} />;
          case "reviews":
            return (
              <ReviewsSection
                id={getSectionAnchor(section)}
                notice={data.reviewNotice}
                key={`${data.product.id}-${section.id}`}
                title={section.payload.title}
                reviews={data.reviews}
                pageSize={section.payload.pageSize}
              />
            );
        }
      })}
    </div></main>
  );
}
