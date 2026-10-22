"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PenLine, Search } from "lucide-react";

import { loginHref, useCurrentUser } from "@/lib/auth";
import { noticeBoardKeys, noticeBoardLabels } from "@/util/data/notices";
import type { NoticeBoardKey } from "@/util/types/notice";
import NoticeEditorModal from "./NoticeEditorModal";
import { addPost, canWriteTo, useNoticeList } from "./noticeStore";

const PER_PAGE = 10;

function parseBoard(value: string | null): NoticeBoardKey {
  return value === "notice" ? "notice" : "free";
}

export default function NoticeBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useCurrentUser();
  const [isWriting, setIsWriting] = useState(false);

  // 탭, 검색어, 페이지는 URL에 둬서 새로고침과 뒤로 가기에도 유지된다.
  const board = parseBoard(searchParams.get("board"));
  const { posts: list, commentCounts, isLoading, hasError } = useNoticeList(board);
  const q = searchParams.get("q") ?? "";
  const requestedPage = Number(searchParams.get("page")) || 1;

  function updateQuery(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const keyword = q.trim();
  const filtered = keyword ? list.filter((p) => p.title.includes(keyword)) : list;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const canWrite = canWriteTo(board, user);

  // 비로그인은 로그인으로 보내고, 공지에서 관리자가 아니면 안내 문구를 보여 준다.
  function handleWriteClick() {
    if (!user) {
      const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      router.push(loginHref(current));
      return;
    }
    if (canWrite) setIsWriting(true);
    else window.alert("공지는 관리자만 쓸 수 있어요.");
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="게시판 선택" className="flex gap-2">
          {noticeBoardKeys.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={board === key}
              onClick={() => updateQuery({ board: key === "free" ? null : key, q: null, page: null })}
              className={`h-11 cursor-pointer rounded-full border px-5.5 text-[15px] font-bold ${
                board === key
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : "border-[#d6d6d6] bg-white text-[#1a1a1a] hover:border-[#1a1a1a]"
              }`}
            >
              {noticeBoardLabels[key]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <NoticeSearch
            key={board}
            initialValue={q}
            onSearch={(value) => updateQuery({ q: value || null, page: null })}
          />
          <button
            type="button"
            onClick={handleWriteClick}
            className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full bg-[#7ed957] px-6 text-[15px] font-bold text-[#1a1a1a] hover:bg-[#71cc4a]"
          >
            <PenLine className="size-4.5" aria-hidden="true" />
            글쓰기
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[22px] font-extrabold leading-7.5">{noticeBoardLabels[board]}</h2>
        <span className="text-[13px] text-[#6b6b6b]">
          {keyword ? `“${keyword}” 검색 결과 ${filtered.length}건` : `전체 ${list.length}건`}
        </span>
      </div>

      <div className="-mt-3 overflow-x-auto">
        <table className="w-full min-w-140 border-collapse">
          <thead>
            <tr className="border-b-2 border-[#1a1a1a] text-[13px] font-bold">
              <th scope="col" className="w-20 px-2 py-3.5 text-center">No</th>
              <th scope="col" className="px-2 py-3.5 text-left">제목</th>
              <th scope="col" className="w-30 px-2 py-3.5 text-center">등록일</th>
              <th scope="col" className="w-22.5 px-2 py-3.5 text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post) => {
              const commentCount = commentCounts[post.id] ?? 0;
              return (
                <tr key={post.id} className="border-b border-[#ededed] hover:bg-[#fafafa]">
                  <td className="px-2 py-4 text-center text-sm text-[#6b6b6b]">
                    {list.length - list.indexOf(post)}
                  </td>
                  <td className="px-2 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/notice/${post.id}`}
                        className="text-[15px] font-medium leading-5.5 text-[#1a1a1a] hover:underline"
                      >
                        {post.title}
                      </Link>
                      {commentCount > 0 && (
                        <span aria-label={`댓글 ${commentCount}개`} className="text-[13px] font-bold text-[#a3302b]">
                          [{commentCount}]
                        </span>
                      )}
                      {user?.id === post.authorId && (
                        <span className="rounded-full bg-[#7ed957] px-2 py-0.5 text-[11px] font-bold text-[#1a1a1a]">
                          내 글
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center text-sm text-[#555]">{post.date}</td>
                  <td className="px-2 py-4 text-center text-sm text-[#555]">
                    {post.views.toLocaleString("ko-KR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isLoading ? (
        <p className="pt-8 pb-2 text-center text-sm text-[#6b6b6b]">글을 불러오는 중이에요...</p>
      ) : hasError ? (
        <div className="flex flex-col items-center gap-3 pt-8 pb-2">
          <p className="text-base font-extrabold">글을 불러오지 못했어요.</p>
          <p className="text-sm text-[#555]">잠시 후 새로고침해 주세요.</p>
        </div>
      ) : (
        filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-8 pb-2">
            <p className="text-base font-extrabold">{keyword ? "찾는 글이 없어요." : "아직 글이 없어요."}</p>
            {keyword && <p className="text-sm text-[#555]">다른 낱말로 다시 찾아볼까요?</p>}
          </div>
        )
      )}

      {pageCount > 1 && (
        <nav aria-label="페이지" className="flex justify-center gap-1.5">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n}쪽`}
              aria-current={n === page ? "page" : undefined}
              onClick={() => updateQuery({ page: n === 1 ? null : String(n) })}
              className={`size-9 cursor-pointer rounded-full text-sm font-bold ${
                n === page ? "bg-[#1a1a1a] text-white" : "text-[#555] hover:bg-[#f2f2f2]"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
      )}

      {isWriting && user && (
        <NoticeEditorModal
          mode="new"
          board={board}
          onClose={() => setIsWriting(false)}
          onSave={async (title, content) => {
            const post = await addPost({ board, title, content });
            setIsWriting(false);
            router.push(`/notice/${post.id}`);
          }}
        />
      )}
    </>
  );
}

function NoticeSearch({ initialValue, onSearch }: { initialValue: string; onSearch: (value: string) => void }) {
  const [value, setValue] = useState(initialValue);

  return (
    <label className="relative flex items-center">
      <Search className="pointer-events-none absolute left-4 size-4.5 text-[#6b6b6b]" aria-hidden="true" />
      <input
        type="search"
        aria-label="게시글 검색"
        placeholder="제목으로 검색"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch(e.target.value);
        }}
        className="h-11 w-70 max-w-[70vw] rounded-full border border-[#d6d6d6] bg-white pr-4.5 pl-11 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
      />
    </label>
  );
}
