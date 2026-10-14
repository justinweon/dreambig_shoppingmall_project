//정기
import Image from 'next/image'
import type { ImageSource } from '@/util/types/product'

interface ProductCardProps {
  name: string,
  price: number,
  imageURL: ImageSource,
}

export default function ProductCard(props: ProductCardProps): React.JSX.Element {
  return (
    <div className="w-full max-w-[240px]">
      <Image src={props.imageURL} alt={props.name} width={240} height={240} className="h-[240px] w-full object-contain"/>
      <h2 className='mt-3 text-base font-medium'>{props.name}</h2>
      <p className='mt-1 text-sm'>{props.price.toLocaleString()}원</p>
    </div>
  )
}