"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";

import { useCurrentUser } from "@/lib/auth";
import { noticeBoardLabels } from "@/util/data/notices";
import NoticeComments from "./NoticeComments";
import NoticeContent from "./NoticeContent";
import NoticeEditorModal from "./NoticeEditorModal";
import { canEditPost, editPost, increaseViews, useNoticePost } from "./noticeStore";

export default function NoticeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useCurrentUser();
  const { post, comments, isLoading, hasError, reload } = useNoticePost(id);
  const [isEditing, setIsEditing] = useState(false);

  // 글을 열 때마다 조회수를 1 올린다. 개발 모드에서 effect가 두 번 실행돼도 한 번만 센다.
  const countedId = useRef<string | null>(null);
  useEffect(() => {
    if (countedId.current === id) return;
    countedId.current = id;
    increaseViews(id);
  }, [id]);

  if (!post) {
    if (isLoading) return <div className="min-h-100" />;
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-extrabold">{hasError ? "글을 불러오지 못했어요." : "글을 찾을 수 없어요."}</p>
        <p className="text-sm text-[#555]">
          {hasError ? "잠시 후 새로고침해 주세요." : "삭제되었거나 주소가 잘못되었을 수 있어요."}
        </p>
        <Link
          href="/notice"
          className="mt-2 inline-flex h-11 items-center rounded-full bg-[#7ed957] px-6 text-[15px] font-bold text-[#1a1a1a] hover:bg-[#71cc4a]"
        >
          게시판으로 가기
        </Link>
      </div>
    );
  }

  const boardLabel = noticeBoardLabels[post.board];
  const listHref = post.board === "free" ? "/notice" : `/notice?board=${post.board}`;

  return (
    <div className="mx-auto flex w-full max-w-190 flex-col gap-7">
      <div>
        <Link
          href={listHref}
          className="inline-flex items-center gap-1.5 px-0.5 py-1 text-[13px] font-bold text-[#555] hover:text-[#1a1a1a] hover:underline"
        >
          <ChevronLeft className="size-4.5" aria-hidden="true" />
          {boardLabel} 목록으로
        </Link>
      </div>

      <article className="flex flex-col gap-5">
        <header className="flex flex-col gap-3.5 border-b-2 border-[#1a1a1a] pb-5">
          <span className="self-start rounded-full bg-[#1a1a1a] px-3 py-1 text-xs font-bold text-white">
            {boardLabel}
          </span>
          <h2 className="text-[32px] font-extrabold leading-10 tracking-tight">{post.title}</h2>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3.5 text-[13px] text-[#6b6b6b]">
              <strong className="text-[#1a1a1a]">{post.author}</strong>
              <span>등록일 {post.date}</span>
              <span>조회수 {post.views.toLocaleString("ko-KR")}</span>
            </div>
            {canEditPost(post, user) && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[#1a1a1a] bg-white px-4.5 text-[13px] font-bold hover:bg-[#f2f2f2]"
              >
                <Pencil className="size-4" aria-hidden="true" />
                수정
              </button>
            )}
          </div>
        </header>
        <NoticeContent html={post.content} />
      </article>

      <NoticeComments postId={post.id} comments={comments} onChange={reload} />

      {isEditing && (
        <NoticeEditorModal
          mode="edit"
          board={post.board}
          initialTitle={post.title}
          initialContent={post.content}
          onClose={() => setIsEditing(false)}
          onSave={async (title, content) => {
            await editPost(post.id, { title, content });
            setIsEditing(false);
            reload();
          }}
        />
      )}
    </div>
  );
}
