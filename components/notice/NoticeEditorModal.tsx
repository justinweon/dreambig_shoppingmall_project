"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  X,
} from "lucide-react";

import { noticeBoardLabels } from "@/util/data/notices";
import type { NoticeBoardKey } from "@/util/types/notice";
import { noticeProseClass } from "./noticeProse";

interface NoticeEditorModalProps {
  mode: "new" | "edit";
  board: NoticeBoardKey;
  initialTitle?: string;
  initialContent?: string;
  onClose: () => void;
  /** 저장에 실패하면 throw한다. 모달이 오류 문구를 보여 준다. */
  onSave: (title: string, html: string) => Promise<void>;
}

export default function NoticeEditorModal({
  mode,
  board,
  initialTitle = "",
  initialContent = "",
  onClose,
  onSave,
}: NoticeEditorModalProps) {
  const titleId = useId();
  const subjectId = useId();
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "세종대왕님께 전하고 싶은 이야기를 적어 주세요." }),
    ],
    content: initialContent,
    immediatelyRender: false,
  });

  // 모달이 열려 있는 동안 뒤 페이지 스크롤을 막는다.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return setError("제목을 적어 주세요.");
    if (!editor || editor.isEmpty) return setError("내용을 한 줄 이상 적어 주세요.");
    setIsSaving(true);
    try {
      await onSave(trimmed, editor.getHTML());
    } catch {
      setError("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(20,20,20,0.6)] px-4 py-16"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-190 flex-col overflow-hidden rounded-[20px] bg-white text-[#1a1a1a]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ededed] px-6 py-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-[#a3302b]">{noticeBoardLabels[board]}</span>
            <h2 id={titleId} className="text-xl font-extrabold leading-7">
              {mode === "edit" ? "글 수정" : "새 글 쓰기"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] hover:bg-[#e6e6e6]"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor={subjectId} className="text-[13px] font-bold">제목</label>
            <input
              id={subjectId}
              type="text"
              autoFocus
              placeholder="제목을 적어 주세요"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-[#d6d6d6] px-3.5 py-3 text-[15px] focus:border-[#1a1a1a] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold">내용</span>
            <div className="overflow-hidden rounded-2xl border border-[#d6d6d6]">
              {editor && <EditorToolbar editor={editor} />}
              <EditorContent
                editor={editor}
                onClick={() => editor?.commands.focus()}
                className={`[&_.tiptap]:min-h-65 [&_.tiptap]:px-5 [&_.tiptap]:py-4.5 text-base leading-6.75 ${noticeProseClass} [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-[#767676] [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]`}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-[13px] font-bold text-[#a3302b]">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2.5 px-6 pt-4 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 cursor-pointer rounded-full border border-[#1a1a1a] bg-white px-6 text-[15px] font-bold hover:bg-[#f2f2f2]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 cursor-pointer rounded-full bg-[#7ed957] px-7 text-[15px] font-bold hover:bg-[#71cc4a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div role="toolbar" aria-label="서식" className="flex flex-wrap gap-1 border-b border-[#ededed] bg-[#fafafa] p-2">
      <ToolButton label="굵게" pressed={active.bold} onClick={() => chain().toggleBold().run()}><Bold /></ToolButton>
      <ToolButton label="기울임" pressed={active.italic} onClick={() => chain().toggleItalic().run()}><Italic /></ToolButton>
      <ToolButton label="취소선" pressed={active.strike} onClick={() => chain().toggleStrike().run()}><Strikethrough /></ToolButton>
      <Divider />
      <ToolButton label="제목 2" pressed={active.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 /></ToolButton>
      <ToolButton label="제목 3" pressed={active.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 /></ToolButton>
      <Divider />
      <ToolButton label="글머리 목록" pressed={active.bullet} onClick={() => chain().toggleBulletList().run()}><List /></ToolButton>
      <ToolButton label="번호 목록" pressed={active.ordered} onClick={() => chain().toggleOrderedList().run()}><ListOrdered /></ToolButton>
      <ToolButton label="인용" pressed={active.quote} onClick={() => chain().toggleBlockquote().run()}><Quote /></ToolButton>
      <Divider />
      <ToolButton label="실행 취소" onClick={() => chain().undo().run()}><Undo2 /></ToolButton>
      <ToolButton label="다시 실행" onClick={() => chain().redo().run()}><Redo2 /></ToolButton>
    </div>
  );
}

function ToolButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] [&_svg]:size-4.5 ${
        pressed ? "bg-[#1a1a1a] text-white" : "text-[#1a1a1a] hover:bg-[#f2f2f2]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 my-1 w-px bg-[#ededed]" />;
}
