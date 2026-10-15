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
    <div className='group w-full max-w-[240px]'>
      <Image src={props.imageURL} alt={props.name} width={240} height={240} className="aspect-square h-auto w-full object-contain rounded-xl group-hover:shadow-lg group-hover:-translate-y-1 transition"/>
      <h2 className='mt-3 text-base font-medium'>{props.name}</h2>
      <p className='mt-1 text-sm'>{props.price.toLocaleString()}원</p>
    </div>
  )
}