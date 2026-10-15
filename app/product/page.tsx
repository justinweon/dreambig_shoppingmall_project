//정기
import ProductList from '@/components/product/ProductList'
import ProductHero from '@/components/product/ProductHero'

export default function ProductPage(): React.JSX.Element {
  return (
    <div>
      <ProductHero/>
      <div className='mx-auto max-w-[800px] px-4 py-8'>
        <ProductList/>
      </div>
    </div>
  )
}