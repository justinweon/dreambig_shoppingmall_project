import Link from "next/link";
import { products } from "@/util/data/products";

export default function PreviewSectionNav() {
  return <nav aria-label="담당 영역 바로가기" className="ysh-preview-links">
    <ul>
      <li><Link href="/preview/ysh/main">메인 3개 영역</Link></li>
      <li><Link href="/preview/ysh/banner">배너만</Link></li>
      <li><Link href="/preview/ysh/carousel">상품 캐러셀만</Link></li>
      <li><Link href="/preview/ysh/hunmin">훈민정음 모션만</Link></li>
      {products.map((product) => <li key={product.id}><Link href={`/product/${product.id}`}>{product.name} 상세</Link></li>)}
    </ul>
  </nav>;
}
