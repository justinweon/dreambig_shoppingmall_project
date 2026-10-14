import Image from 'next/image'

interface ProductCardProps {
  name: string,
  price: number,
  imageURL: string,
}

export default function ProductCard(props: ProductCardProps): React.JSX.Element {
  return (
    <div>
      <Image src={props.imageURL} alt={props.name} width={240} height={240} />
      <h2>{props.name}</h2>
      <p>{props.price.toLocaleString()}원</p>
    </div>
  )
}