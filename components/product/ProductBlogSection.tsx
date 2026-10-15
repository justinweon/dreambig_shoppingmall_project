import BlogCard from "@/components/product/BlogCard"

export default function ProductBlogSection() {
    const blogPosts = [
        {
            id: 1,
            title: "test 포스트 1",
            summary: "test 요약 1",
            videoSrc: "/videos/sejong_blog_card_section_1.mp4"
        },
        {
            id: 2,
            title: "test 포스트 2",
            summary: "test 요약 2",
            videoSrc: "/videos/sejong_blog_card_section_2.mp4"
        },
        {
            id: 3,
            title: "test 포스트 3",
            summary: "test 요약 3",
            videoSrc: "/videos/sejong_blog_card_section_3.mp4"
        },
    ]
    return (
        <section className="mx-auto max-w-[1200px] px-4 py-12">
            <h2 className="text-3xl font-bold mb-4">세종대왕의 일상</h2>

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

