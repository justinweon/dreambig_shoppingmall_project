"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import { createDreambigApi, type ProfileRow } from "@/util/api";

const api = createDreambigApi(supabase);

const sectionTitleClass =
  "mt-10 border-b border-neutral-950 pb-3 text-sm font-semibold text-neutral-950";

// 01012345678 → 010-1234-5678
function formatPhone(phone: string | null) {
  if (!phone) return "-";
  return phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
}

// 이름표 한 줄 (왼쪽 제목, 오른쪽 값)
function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-neutral-200 py-4 text-[15px]">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-950">{value || "-"}</span>
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //로그인 확인. 내 정보 가져오기
  useEffect(() => {
    const load = async () => {
      const user = await api.auth.getCurrentUser().catch(() => null);
      if (!user) {
        router.replace("/login?redirectTo=%2Fmypage");
        return;
      }
      setEmail(user.email ?? "");
      setProfile(await api.auth.getMyProfile().catch(() => null));
      setIsLoading(false);
    };
    load();
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-6 pb-24 pt-8">
      {/* 경로 */}
      <nav className="mb-10 text-xs text-neutral-500">
        <Link href="/">집</Link>
        <span className="mx-2">/</span>
        <span>나의 이름표</span>
      </nav>

      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950">나의 이름표</h1>

      {isLoading ? (
        <p className="mt-10 text-sm text-neutral-500">이름표를 찾는 중...</p>
      ) : (
        <>
          <h2 className={sectionTitleClass}>그대에 대하여</h2>
          <InfoRow label="닉네임" value={profile?.nickname ?? null} />
          <InfoRow label="이름" value={profile?.name ?? null} />
          <InfoRow label="편지 받을 곳" value={email} />
          <InfoRow label="휴대폰 번호" value={formatPhone(profile?.phone ?? null)} />

          <h2 className={sectionTitleClass}>기본 배송지</h2>
          <InfoRow label="우편번호" value={profile?.zip_code ?? null} />
          <InfoRow
            label="주소"
            value={
              profile?.address
                ? `${profile.address} ${profile.address_detail ?? ""}`.trim()
                : null
            }
          />
        </>
      )}
    </main>
  );
}