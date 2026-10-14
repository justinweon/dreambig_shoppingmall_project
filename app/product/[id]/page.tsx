import ProductDetailPage from "@/components/product-detail/ProductDetailPage";
import { mockProductDetails } from "@/shared/product-detail/detailData";
import { notFound } from "next/navigation";

interface ProductDetailRouteProps {
  params : Promise<{id : string}>;
}

export default async function ProductDetailPageRoute({params,} : ProductDetailRouteProps){
  // 임시데이터 홍정기님 상품페이지에서 받아와야함!
  //const detail_data = mockProductDetails[0];

  const { id } = await params;
  const product_id = Number(id);

  // id 가 양수인지 확인
  if(!Number.isSafeInteger(product_id) || product_id < 1){
    notFound(); // 이페이지는 찾을 수 없다!
  }

  // 변경 : URL의 ID와 일치하는 상품
  const detail_data = mockProductDetails.find(
    (detail) => detail.product.id === product_id,
  );

  if(!detail_data){
    notFound(); // 이페이지는 찾을 수 없다!
  }

  return <ProductDetailPage data={detail_data}/>;
}
