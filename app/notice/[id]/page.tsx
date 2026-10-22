import { Suspense } from "react";

import NoticeDetail from "@/components/notice/NoticeDetail";
import NoticeHero from "@/components/notice/NoticeHero";

interface NoticeDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage({ params }: NoticeDetailRouteProps) {
  return (
    <main className="flex flex-1 flex-col break-keep text-[#1a1a1a]">
      <NoticeHero />
      <div className="flex-1 px-6 pt-12 pb-24">
        {/* 게시글은 브라우저의 Supabase 클라이언트로 불러온다. */}
        <Suspense fallback={<div className="min-h-150" />}>
          <NoticeDetail params={params} />
        </Suspense>
      </div>
    </main>
  );
}
