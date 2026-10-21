"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { noticeProseClass } from "./noticeProse";

// 저장된 HTML을 읽기 전용 Tiptap으로 보여 준다. 스키마에 없는 태그는 걸러진다.
export default function NoticeContent({ html }: { html: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: html,
    editable: false,
    immediatelyRender: false,
  });

  // 글을 수정하고 돌아오면 본문을 새로 채운다.
  useEffect(() => {
    if (editor && editor.getHTML() !== html) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [editor, html]);

  return (
    <EditorContent
      editor={editor}
      className={`min-h-24 text-base leading-7 text-[#333] ${noticeProseClass}`}
    />
  );
}
