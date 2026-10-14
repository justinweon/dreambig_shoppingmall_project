// 정기
import ProductCard from "@/components/product/ProductCard"
import { products } from "@/util/data/products" 
import Link from "next/link"


export default function ProductList(): React.JSX.Element {
  return (
    <div>
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
        <ProductCard
        name={product.name}
        price={product.price}
        imageURL={product.imageUrl}
        />
        </Link>
    ))}
    </div>
  )
}