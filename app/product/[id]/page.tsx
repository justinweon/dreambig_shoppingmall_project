import ProductDetailPage from "@/components/product-detail/ProductDetailPage";
import { mockProductDetails } from "@/shared/product-detail/detailData";

export default function ProductDetailPageRoute() {
  // 임시데이터 홍정기님 상품페이지에서 받아와야함!
  const detail_data = mockProductDetails[0];

  return <ProductDetailPage data={detail_data} />;
}
