// 정기
import ProductCard from "@/components/product/ProductCard"
import { products } from "@/util/data/products" 
import Link from "next/link"
import Image from "next/image"
import { ImageSource } from "@/util/types/product"


interface ProductListProps {
  imageUrl: ImageSource;
  name: string;
  productId: number;
}
export default function ProductList({ imageUrl, name, productId } : ProductListProps): React.JSX.Element {
  if(name)
  {
    //하나씩 return
    return (
    <div className="flex flex-col items-center gap-4">
      <Link href={`/product/${productId}`}>
        <Image
          src={imageUrl}
          alt={name}
          width={160}
          height={160}
          className="h-40 w-40 object-contain"
          />
        <p className="text-center font-medium">{name}</p>
      </Link>
    </div>
  );
  }
  else{
      return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

  return <></>
}