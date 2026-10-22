// 훈민 게시판 화면 데이터. Supabase 행을 바꾸는 곳은 components/notice/noticeStore.ts에 있다.

/** notice는 관리자만 글을 쓸 수 있고, free는 로그인한 누구나 쓸 수 있다. */
export type NoticeBoardKey = "notice" | "free";

export interface NoticePost {
  readonly id: string;
  readonly board: NoticeBoardKey;
  readonly title: string;
  /** 작성자 profiles.id. 본인 글 확인에 쓴다. */
  readonly authorId: string;
  /** 작성 시점 닉네임 */
  readonly author: string;
  /** YYYY.MM.DD 표시용 문자열 */
  readonly date: string;
  readonly views: number;
  /** Tiptap 에디터가 만든 HTML */
  readonly content: string;
}

export interface NoticeReply {
  readonly id: string;
  readonly authorId: string;
  readonly author: string;
  readonly date: string;
  readonly text: string;
}

export interface NoticeComment {
  readonly id: string;
  readonly authorId: string;
  readonly author: string;
  readonly date: string;
  readonly text: string;
  readonly replies: readonly NoticeReply[];
}
