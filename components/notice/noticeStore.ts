"use client";

import { useCallback, useEffect, useState } from "react";

import type { CurrentUser } from "@/lib/auth";
import { supabase } from "@/shared/lib/supabase";
import { createDreambigApi, type NoticeCommentRow, type NoticePostRow } from "@/util/api";
import type { NoticeBoardKey, NoticeComment, NoticePost } from "@/util/types/notice";

// 게시글과 댓글은 Supabase에 저장한다. 공지 작성 같은 권한은 DB 정책이 최종 확인하고,
// 아래 can* 함수는 화면에서 버튼을 보여 줄지 정하는 데만 쓴다.

const api = createDreambigApi(supabase).notices;

function dateLabel(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

function toPost(row: NoticePostRow): NoticePost {
  return {
    id: String(row.id),
    board: row.board,
    title: row.title,
    authorId: row.author_id,
    author: row.author_nickname,
    date: dateLabel(row.created_at),
    views: row.views,
    content: row.content,
  };
}

/** 작성순 댓글 행을 댓글 아래 답글 구조로 묶는다. */
function toComments(rows: readonly NoticeCommentRow[]): NoticeComment[] {
  const base = (row: NoticeCommentRow) => ({
    id: String(row.id),
    authorId: row.author_id,
    author: row.author_nickname,
    date: dateLabel(row.created_at),
    text: row.text,
  });
  const comments = rows.filter((row) => row.parent_id === null).map((row) => ({ ...base(row), replies: [] }));
  return comments.map((comment) => ({
    ...comment,
    replies: rows.filter((row) => String(row.parent_id) === comment.id).map(base),
  }));
}

/** 주소의 글 번호. 숫자가 아니면 null */
function toPostId(id: string) {
  const postId = Number(id);
  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

interface ListResult {
  readonly board: NoticeBoardKey;
  readonly posts: readonly NoticePost[];
  /** 글 id별 댓글+답글 개수 */
  readonly commentCounts: Readonly<Record<string, number>>;
  readonly hasError: boolean;
}

/** board의 전체 글(최신순)과 글별 댓글 수. 탭을 바꾸면 다시 불러온다. */
export function useNoticeList(board: NoticeBoardKey) {
  const [result, setResult] = useState<ListResult | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const rows = await api.listPosts(board);
      const counts = await api.countComments(rows.map((row) => row.id));
      return {
        posts: rows.map(toPost),
        commentCounts: Object.fromEntries(Object.entries(counts)),
      };
    })().then(
      (data) => !ignore && setResult({ board, ...data, hasError: false }),
      () => !ignore && setResult({ board, posts: [], commentCounts: {}, hasError: true }),
    );
    return () => {
      ignore = true;
    };
  }, [board]);

  const current = result?.board === board ? result : null;
  return {
    posts: current?.posts ?? [],
    commentCounts: current?.commentCounts ?? {},
    isLoading: !current,
    hasError: current?.hasError ?? false,
  };
}

interface PostResult {
  readonly id: string;
  readonly post: NoticePost | null;
  readonly comments: readonly NoticeComment[];
  readonly hasError: boolean;
}

/** 글 하나와 댓글. 수정/댓글 작성 뒤 reload()로 다시 불러온다. */
export function useNoticePost(id: string) {
  const [result, setResult] = useState<PostResult | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    const postId = toPostId(id);
    const load = postId
      ? Promise.all([api.getPost(postId), api.listComments(postId)])
      : Promise.resolve([null, []] as const);
    load.then(
      ([row, commentRows]) =>
        !ignore && setResult({ id, post: row && toPost(row), comments: toComments(commentRows), hasError: false }),
      () => !ignore && setResult({ id, post: null, comments: [], hasError: true }),
    );
    return () => {
      ignore = true;
    };
  }, [id, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  // 다시 불러오는 동안에는 이전 내용을 그대로 보여 준다.
  const current = result?.id === id ? result : null;
  return {
    post: current?.post ?? null,
    comments: current?.comments ?? [],
    isLoading: !current,
    hasError: current?.hasError ?? false,
    reload,
  };
}

/** 공지는 관리자만, 자유게시판은 로그인한 누구나 쓸 수 있다. */
export function canWriteTo(board: NoticeBoardKey, user: CurrentUser | null) {
  if (!user) return false;
  return board === "free" || user.isAdmin;
}

/** 본인 글이거나 관리자면 수정할 수 있다. */
export function canEditPost(post: NoticePost, user: CurrentUser | null) {
  return !!user && (user.id === post.authorId || user.isAdmin);
}

/** 댓글과 답글을 합친 개수 */
export function countComments(comments: readonly NoticeComment[]) {
  return comments.reduce((total, c) => total + 1 + c.replies.length, 0);
}

export async function addPost(input: { board: NoticeBoardKey; title: string; content: string }) {
  return toPost(await api.createPost(input));
}

export async function editPost(id: string, changes: { title: string; content: string }) {
  const postId = toPostId(id);
  if (postId) await api.updatePost(postId, changes);
}

/** 조회수는 실패해도 화면에 영향이 없어서 오류를 무시한다. */
export function increaseViews(id: string) {
  const postId = toPostId(id);
  if (postId) api.increaseViews(postId).catch(() => {});
}

/** parentId가 있으면 그 댓글의 답글로 단다. */
export async function addComment(postId: string, text: string, parentId?: string) {
  const id = toPostId(postId);
  if (!id) return;
  await api.createComment(id, text, parentId === undefined ? undefined : Number(parentId));
}
