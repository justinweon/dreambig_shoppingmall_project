// Tiptap 본문(.tiptap) 안의 태그 스타일. 에디터와 상세 보기에서 같이 쓴다.
export const noticeProseClass = [
  "[&_.tiptap]:outline-none",
  "[&_.tiptap_p]:mb-3",
  "[&_.tiptap_h2]:mt-5 [&_.tiptap_h2]:mb-2.5 [&_.tiptap_h2]:text-[22px] [&_.tiptap_h2]:leading-7.5 [&_.tiptap_h2]:font-extrabold [&_.tiptap_h2]:text-[#1a1a1a]",
  "[&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-bold [&_.tiptap_h3]:text-[#1a1a1a]",
  "[&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5.5",
  "[&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5.5",
  "[&_.tiptap_li_p]:mb-1",
  "[&_.tiptap_blockquote]:mb-3 [&_.tiptap_blockquote]:rounded-2xl [&_.tiptap_blockquote]:bg-[#f5f5f5] [&_.tiptap_blockquote]:px-4.5 [&_.tiptap_blockquote]:py-3.5 [&_.tiptap_blockquote]:font-bold",
  "[&_.tiptap_blockquote_p]:mb-0",
  "[&_.tiptap_strong]:font-extrabold",
  "[&_.tiptap_a]:underline",
].join(" ");
