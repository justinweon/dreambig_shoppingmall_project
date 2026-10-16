import Image from 'next/image'
import bannerImage from '@/shared/asset/sejong_banner_2.png'

export default function ProductHero(): React.JSX.Element {
    return (
        <section className='md:grid md:grid-cols-1'>
            <Image src={bannerImage} alt='맥북을 들고있는 세종대왕' className="h-auto w-full object-fit md:col-start-1 md:row-start-1"/>
            <div className="px-4 py-4 md:col-start-1 md:row-start-1 md:w-1/2 md:self-center md:px-12">
                <h1 className='text-2xl font-bold md:text-4xl'>
                    세종대왕 굿즈
                </h1>
                <p className='mt-3 text-sm text-gray-600 md:text-base'>
                    일상에서 만나는 세종대왕 굿즈
                </p>
            </div>
        </section>
    )
}