"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { loginHref, useCurrentUser } from "@/lib/auth";
import type { NoticeComment } from "@/util/types/notice";
import { addComment, addReply, countComments } from "./noticeStore";

const fieldClass =
  "w-full resize-y rounded-xl border border-[#d6d6d6] bg-white px-3.5 py-3 text-[15px] leading-5.5 text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none";
const greenButtonClass =
  "cursor-pointer rounded-full bg-[#7ed957] font-bold text-[#1a1a1a] hover:bg-[#71cc4a] disabled:cursor-not-allowed disabled:opacity-50";
const lineButtonClass =
  "cursor-pointer rounded-full border border-[#1a1a1a] bg-white font-bold text-[#1a1a1a] hover:bg-[#f2f2f2]";

interface NoticeCommentsProps {
  postId: string;
  comments: readonly NoticeComment[];
}

export default function NoticeComments({ postId, comments }: NoticeCommentsProps) {
  const user = useCurrentUser();
  const commentFieldId = useId();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  function submitComment() {
    const trimmed = text.trim();
    if (!user || !trimmed) return;
    addComment(postId, user.name, trimmed);
    setText("");
  }

  function submitReply(commentId: string) {
    const trimmed = replyText.trim();
    if (!user || !trimmed) return;
    addReply(postId, commentId, user.name, trimmed);
    setReplyTo(null);
    setReplyText("");
  }

  return (
    <section aria-label="댓글" className="flex flex-col gap-4.5 border-t border-[#ededed] pt-7">
      <h3 className="text-lg font-extrabold leading-6.5">
        댓글 <span className="text-[#a3302b]">{countComments(comments)}</span>
      </h3>

      {user ? (
        <div className="flex flex-col gap-2.5">
          <label htmlFor={commentFieldId} className="text-[13px] text-[#555]">
            <strong className="text-[#1a1a1a]">{user.name}</strong> 님으로 댓글 남기기
          </label>
          <textarea
            id={commentFieldId}
            rows={3}
            placeholder="따뜻한 한마디를 남겨 주세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={fieldClass}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={submitComment}
              disabled={!text.trim()}
              className={`h-10 px-5.5 text-sm ${greenButtonClass}`}
            >
              댓글 등록
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5f5f5] px-5 py-4.5">
          <span className="text-sm text-[#555]">로그인하면 댓글과 답글을 남길 수 있어요.</span>
          <Link
            href={loginHref(`/notice/${postId}`)}
            className={`inline-flex h-9 items-center px-4.5 text-[13px] ${lineButtonClass}`}
          >
            로그인
          </Link>
        </div>
      )}

      <ul className="flex flex-col">
        {comments.map((comment) => (
          <li key={comment.id} className="flex flex-col gap-3 border-b border-[#ededed] py-4.5">
            <div className="flex gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-8.5 flex-none items-center justify-center rounded-full bg-[#1a1a1a] text-sm font-extrabold text-white"
              >
                {comment.author.charAt(0)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <CommentMeta author={comment.author} date={comment.date} />
                <p className="whitespace-pre-line text-[15px] leading-6 text-[#333]">{comment.text}</p>
                {user && replyTo !== comment.id && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(comment.id);
                        setReplyText("");
                      }}
                      className="cursor-pointer px-0.5 py-1 text-[13px] font-bold text-[#555] hover:text-[#1a1a1a] hover:underline"
                    >
                      답글 달기
                    </button>
                  </div>
                )}
              </div>
            </div>

            {comment.replies.map((reply) => (
              <div key={reply.id} className="ml-11.5 flex gap-2.5 rounded-2xl bg-[#f5f5f5] px-4 py-3.5">
                <span aria-hidden="true" className="flex-none text-[15px] font-extrabold text-[#a3302b]">ㄴ</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CommentMeta author={reply.author} date={reply.date} />
                  <p className="whitespace-pre-line text-[15px] leading-6 text-[#333]">{reply.text}</p>
                </div>
              </div>
            ))}

            {user && replyTo === comment.id && (
              <div className="ml-11.5 flex flex-col gap-2">
                <label htmlFor={`reply-${comment.id}`} className="text-[13px] text-[#555]">
                  {comment.author} 님에게 답글
                </label>
                <textarea
                  id={`reply-${comment.id}`}
                  rows={2}
                  autoFocus
                  placeholder="답글을 적어 주세요."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className={fieldClass}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className={`h-9 px-4 text-[13px] ${lineButtonClass}`}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => submitReply(comment.id)}
                    disabled={!replyText.trim()}
                    className={`h-9 px-4.5 text-[13px] ${greenButtonClass}`}
                  >
                    답글 등록
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {comments.length === 0 && (
        <p className="text-sm text-[#6b6b6b]">아직 댓글이 없어요. 첫 댓글의 주인공이 되어 주세요.</p>
      )}
    </section>
  );
}

function CommentMeta({ author, date }: { author: string; date: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2.5">
      <strong className="text-sm">{author}</strong>
      <span className="text-xs text-[#6b6b6b]">{date}</span>
    </div>
  );
}
