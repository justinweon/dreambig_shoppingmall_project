'use client'
import { useRef } from "react";

interface BlogCardProps {
    title: string;
    summary: string;
    videoSrc: string;
}

export default function BlogCard(props: BlogCardProps): React.JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);
    function HandleMouseEnter() {
        const video = videoRef.current
        if (video === null) return

        video.play().catch(() => {
            console.warn("호버 재생을 시작하지 못했습니다.")
        })

    }
    
    function handleMouseLeave() {
        const video = videoRef.current
        if (video === null) return

        video.pause()
    }

    return(
        <div
            onMouseEnter={HandleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group"
        >
            <video
                ref={videoRef}
                src={props.videoSrc}
                controls={false}
                muted={true}
                playsInline={true}
                className="aspect-video w-full rounded-xl bg-gray-100 object-contain"
            />
            
            <h3 className="mt-4 text-lg font-bold">{props.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{props.summary}</p>
        </div>
    )
}