import { Suspense } from "react";

import NoticeBoard from "@/components/notice/NoticeBoard";
import NoticeHero from "@/components/notice/NoticeHero";

export default function NoticePage() {
  return (
    <main className="flex flex-1 flex-col break-keep text-[#1a1a1a]">
      <NoticeHero />
      <div className="flex-1 px-6 pt-12 pb-24">
        <div className="mx-auto flex max-w-280 flex-col gap-7">
          {/* 검색어/탭/페이지를 URL에서 읽으므로 Suspense 안에서 렌더링한다. */}
          <Suspense fallback={<div className="min-h-150" />}>
            <NoticeBoard />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
