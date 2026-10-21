// 훈민 게시판 데이터 계약. 저장소 구현은 components/notice/noticeStore.ts에 있다.

/** notice는 관리자만 글을 쓸 수 있고, free는 로그인한 누구나 쓸 수 있다. */
export type NoticeBoardKey = "notice" | "free";

export interface NoticePost {
  readonly id: string;
  readonly board: NoticeBoardKey;
  readonly title: string;
  readonly author: string;
  /** YYYY.MM.DD 표시용 문자열 */
  readonly date: string;
  readonly views: number;
  /** Tiptap 에디터가 만든 HTML */
  readonly content: string;
}

export interface NoticeReply {
  readonly id: string;
  readonly author: string;
  readonly date: string;
  readonly text: string;
}

export interface NoticeComment {
  readonly id: string;
  readonly author: string;
  readonly date: string;
  readonly text: string;
  readonly replies: readonly NoticeReply[];
}

/** 게시글 ID를 키로 댓글 목록을 저장한다. */
export type NoticeCommentMap = Readonly<Record<string, readonly NoticeComment[]>>;
