import ProductCard from "@/components/product/ProductCard"
import KeyRing from '@/shared/asset/sejong_key_ring.png'


export default function ProductList(): React.JSX.Element {
  const previewProducts = [
    {
      name: "세종대왕 키링",
      price: 8000,
      imageURL: KeyRing.src,
    }
  ]
  
  return (
    <div>
      {previewProducts.map((product, index) => (
        <ProductCard
        key={index}
        name={product.name}
        price={product.price}
        imageURL={product.imageURL}
        />
    ))}
    </div>
  )
}