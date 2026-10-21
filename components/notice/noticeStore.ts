"use client";

import { useSyncExternalStore } from "react";

import type { CurrentUser } from "@/lib/auth";
import { seedNoticeComments, seedNoticePosts } from "@/util/data/notices";
import type {
  NoticeBoardKey,
  NoticeComment,
  NoticeCommentMap,
  NoticePost,
} from "@/util/types/notice";

// 백엔드가 없어서 게시글과 댓글을 localStorage에 저장한다.
// API로 바꿀 때는 이 파일의 액션 함수만 교체하면 화면 컴포넌트는 그대로 쓸 수 있다.

interface NoticeState {
  readonly posts: readonly NoticePost[];
  readonly comments: NoticeCommentMap;
}

const STORAGE_KEY = "hunmin-notice-v1";
const SEED_STATE: NoticeState = { posts: seedNoticePosts, comments: seedNoticeComments };

let state: NoticeState | null = null;
const listeners = new Set<() => void>();

function load(): NoticeState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as NoticeState;
      if (Array.isArray(parsed.posts) && parsed.comments) return parsed;
    }
  } catch {
    // 손상된 값이면 예시 데이터로 시작한다.
  }
  return SEED_STATE;
}

function getSnapshot(): NoticeState {
  if (!state) state = load();
  return state;
}

function getServerSnapshot(): NoticeState {
  return SEED_STATE;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function update(next: NoticeState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장 실패해도 현재 탭에서는 계속 동작한다.
  }
  listeners.forEach((listener) => listener());
}

export function useNoticeState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 서버 렌더링/hydration 중이면 false. localStorage 데이터가 아직 반영되지 않은 상태다. */
export function useIsHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function todayLabel() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/** 공지는 관리자만, 자유게시판은 로그인한 누구나 쓸 수 있다. */
export function canWriteTo(board: NoticeBoardKey, user: CurrentUser | null) {
  if (!user) return false;
  return board === "free" || user.isAdmin;
}

/** 본인 글이거나 관리자면 수정할 수 있다. */
export function canEditPost(post: NoticePost, user: CurrentUser | null) {
  return !!user && (user.name === post.author || user.isAdmin);
}

/** 댓글과 답글을 합친 개수 */
export function countComments(comments: readonly NoticeComment[] | undefined) {
  return (comments ?? []).reduce((total, c) => total + 1 + c.replies.length, 0);
}

export function addPost(input: { board: NoticeBoardKey; title: string; content: string; author: string }) {
  const current = getSnapshot();
  const post: NoticePost = {
    id: `${input.board.charAt(0)}${Date.now()}`,
    board: input.board,
    title: input.title,
    content: input.content,
    author: input.author,
    date: todayLabel(),
    views: 0,
  };
  update({ ...current, posts: [post, ...current.posts] });
  return post;
}

export function editPost(id: string, changes: { title: string; content: string }) {
  const current = getSnapshot();
  update({
    ...current,
    posts: current.posts.map((p) => (p.id === id ? { ...p, ...changes } : p)),
  });
}

export function increaseViews(id: string) {
  const current = getSnapshot();
  update({
    ...current,
    posts: current.posts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
  });
}

export function addComment(postId: string, author: string, text: string) {
  const current = getSnapshot();
  const comment: NoticeComment = { id: `c${Date.now()}`, author, date: todayLabel(), text, replies: [] };
  update({
    ...current,
    comments: { ...current.comments, [postId]: [...(current.comments[postId] ?? []), comment] },
  });
}

export function addReply(postId: string, commentId: string, author: string, text: string) {
  const current = getSnapshot();
  const list = current.comments[postId] ?? [];
  update({
    ...current,
    comments: {
      ...current.comments,
      [postId]: list.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: `${c.id}r${Date.now()}`, author, date: todayLabel(), text }] }
          : c,
      ),
    },
  });
}
