"use client";

import type { ProductDetailData, DetailTemplate } from "@/util/types/detail";
import OverviewSection from "../components/OverviewSection";
import ProductSpecifications from "../components/ProductSpecifications";
import ReviewsSection from "../components/ReviewsSection";
import ProductFeatures from "../components/ProductFeatures";
import Link from "next/link";
import "../productdetailpage.css";
import { getVisibleDetailSections, getSectionAnchor } from "../sectionModel";
import { useCart } from "@/components/cart/CartProvider";

interface ProductDetailPageProps {
  data: ProductDetailData;
  template: DetailTemplate;
}

export default function ProductDetailPage({ data, template }: ProductDetailPageProps) {
  const { addItem } = useCart();
  // 데이터가 있는 섹션만 템플릿 순서대로 표시한다.
  const sections = getVisibleDetailSections(template, data);
  const navigation = sections.filter((section) => section.kind !== "overview");
  const reviewSection = sections.find((section) => section.kind === "reviews");
  const reviewHref = reviewSection ? `#${getSectionAnchor(reviewSection)}` : undefined;

  return (
    <main className="productdetailpage">
      <div className="productdetailpage-detail-inner">
        <nav aria-label="현재 위치" className="productdetailpage-breadcrumbs">
          <ol>
            <li><Link href="/">홈</Link></li>
            <li><Link href="/product">상품</Link></li>
            <li aria-current="page">{data.product.name}</li>
          </ol>
        </nav>
        {sections.map((section) => {
          switch (section.kind) {
            case "overview":
              return <div key={`${data.product.id}-${section.id}`}>
                <OverviewSection
                  reviewHref={reviewHref}
                  data={data}
                  galleryFit={section.payload.galleryFit}
                  onAddToCart={addItem}
                />
                {navigation.length > 0 && (
                  <nav className="productdetailpage-detail-nav" aria-label="상품 상세 목차">
                    {navigation.map((item) => (
                      <a key={item.id} href={`#${getSectionAnchor(item)}`}>
                        {item.payload.title}
                      </a>
                    ))}
                  </nav>
                )}
              </div>;
            case "features":
              return (
                <ProductFeatures
                  key={section.id}
                  id={getSectionAnchor(section)}
                  title={section.payload.title}
                  features={data.features}
                />
              );
            case "specifications":
              return (
                <ProductSpecifications
                  key={section.id}
                  id={getSectionAnchor(section)}
                  title={section.payload.title}
                  specifications={data.specifications}
                />
              );
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
      </div>
    </main>
  );
}
