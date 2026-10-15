interface BlogCardProps {
    title: string;
    summary: string;
    videoSrc: string;
}

export default function BlogCard(props: BlogCardProps): React.JSX.Element {
    return(
        <div>
            <video
                src={props.videoSrc}
                controls={true}
                muted={true}
                playsInline={true}
                className="aspect-video w-full rounded-xl bg-gray-100 object-contain"
            />
            
            <h3 className="mt-4 text-lg font-bold">{props.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{props.summary}</p>
        </div>
    )
}