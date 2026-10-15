import ProductDetailPage from "@/components/productdetailpage/ProductDetailPage";
import { getProductDetailData } from "@/util/product";
import { notFound } from "next/navigation";
import { detailTemplates } from "@/util/data/detailTemplates";

interface ProductDetailRouteProps {
  params : Promise<{id : string}>;
}

export default async function ProductDetailPageRoute({params,} : ProductDetailRouteProps){
  const { id } = await params;
  const product_id = Number(id);

  // id 가 양수인지 확인
  if(!Number.isSafeInteger(product_id) || product_id < 1){
    notFound(); // 이페이지는 찾을 수 없다!
  }

  // 공통 상품과 상세 설정, 리뷰를 같은 상품 ID로 조합한다.
  const detail_data = getProductDetailData(product_id);

  if(!detail_data){
    notFound(); // 이페이지는 찾을 수 없다!
  }

  const detail_template = detailTemplates.find(
    (template) => template.id === detail_data.templateId,
  );

  if(!detail_template){
    return <p>상품 상세 구성을 찾을 수 없습니다.</p>
  }

  return <ProductDetailPage data={detail_data} template={detail_template}/>;
}
