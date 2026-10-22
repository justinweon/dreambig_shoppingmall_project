import type { NoticeBoardKey } from "../types/notice";

// 게시글과 댓글은 Supabase notice_posts, notice_comments 테이블에 있다.
export const noticeBoardLabels: Readonly<Record<NoticeBoardKey, string>> = {
  notice: "공지",
  free: "자유게시판",
};

export const noticeBoardKeys: readonly NoticeBoardKey[] = ["notice", "free"];
