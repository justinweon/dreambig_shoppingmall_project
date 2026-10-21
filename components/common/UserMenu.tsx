"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { UserIcon } from "@/lib/utils";
import { supabase } from "@/shared/lib/supabase";
import { createDreambigApi } from "@/util/api";
import { useCurrentUser } from "@/domains/auth/hooks/useCurrentUser";

const api = createDreambigApi(supabase);

const itemClass =
  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-neutral-950 hover:bg-neutral-100";

export default function UserMenu({ loginHref }: { loginHref: string }) {
  const user = useCurrentUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ id: string; nickname: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 로그인한 사람의 닉네임 가져오기
  useEffect(() => {
    if (!user) return;
    api.auth
      .getMyProfile()
      .then((p) => setProfile(p ? { id: p.id, nickname: p.nickname } : null))
      .catch(() => setProfile(null));
  }, [user]);

  // 메뉴 바깥을 누르면 닫기
  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [isOpen]);

  // 나가기: 메인으로
  const handleSignOut = async () => {
    setIsOpen(false);
    await api.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // 로그인 안 했으면 지금처럼 로그인 페이지로
  if (!user) {
    return (
      <Link href={loginHref} aria-label="들어가기">
        <UserIcon />
      </Link>
    );
  }

  const nickname = profile?.id === user.id ? profile.nickname : null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="내 메뉴"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <UserIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-52 border border-neutral-950 bg-white text-sm">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="font-semibold text-neutral-950">
              {nickname ? `${nickname} 님` : "어서 오너라"}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">{user.email}</p>
          </div>
          <Link href="/mypage" onClick={() => setIsOpen(false)} className={itemClass}>
            <User size={16} />
            나의 이름표
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className={`${itemClass} border-t border-neutral-200`}
          >
            <LogOut size={16} />
            나가기
          </button>
        </div>
      )}
    </div>
  );
}