import BlogCard from "@/components/product/BlogCard"

export default function ProductBlogSection() {
    const blogPosts = [
        {
            id: 1,
            title: "기획",
            summary: "스토어에 판매 할 굿즈를 기획!",
            videoSrc: "/videos/sejong_blog_card_section_1.mp4"
        },
        {
            id: 2,
            title: "회의",
            summary: "작성한 기획안을 신하들과 회의!",
            videoSrc: "/videos/sejong_blog_card_section_2.mp4"
        },
        {
            id: 3,
            title: "반려",
            summary: "신하의 의견을 듣고 굿즈를 반려!",
            videoSrc: "/videos/sejong_blog_card_section_3.mp4"
        },
    ]
    return (
        <section className="mx-auto max-w-[1200px] px-4 py-12">
            <h2 className="text-3xl font-bold mb-4 text-center">굿즈가 나오기까지</h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
                <BlogCard
                key={post.id}
                title={post.title}
                summary={post.summary}
                videoSrc={post.videoSrc}
                />
            ))}
            </div>
        </section>
    )
}

