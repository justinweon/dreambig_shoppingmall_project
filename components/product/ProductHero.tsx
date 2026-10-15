import Image from 'next/image'
import bannerImage from '@/shared/asset/sejong_banner_3.png'

export default function ProductHero(): React.JSX.Element {
    return (
        <>
            <Image src={bannerImage} alt='맥북을 들고있는 세종대왕' className="h-auto w-full"/>
            <h1>
                세종대왕 굿즈
            </h1>
            <p>
                일상에서 만나는 세종대왕 굿즈
            </p>
        </>
    )
}