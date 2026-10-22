"use client";

import { useSyncExternalStore } from "react";

import { supabase } from "@/shared/lib/supabase";

// 로그인은 signInAction이 Supabase 세션 쿠키에 저장한다. 여기서는 그 세션과 본인 profiles 행을 읽어
// 화면에서 쓸 사용자 정보를 만든다. isAdmin은 화면 표시용이고 실제 권한은 DB 정책이 확인한다.

export const LOGIN_PATH = "/login";

export interface CurrentUser {
  readonly id: string;
  /** profiles.nickname */
  readonly name: string;
  /** 공지 게시판 글쓰기 권한 (profiles.role === "admin") */
  readonly isAdmin: boolean;
}

const listeners = new Set<() => void>();
let currentUser: CurrentUser | null = null;
// 마지막으로 프로필을 읽은 사용자 id. undefined면 아직 읽지 않았다.
let loadedUserId: string | null | undefined;
let isListening = false;

function emit(user: CurrentUser | null) {
  currentUser = user;
  listeners.forEach((listener) => listener());
}

async function loadProfile(userId: string | null) {
  if (userId === loadedUserId) return;
  loadedUserId = userId;
  if (!userId) {
    emit(null);
    return;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("nickname, role")
    .eq("id", userId)
    .maybeSingle();
  // 읽는 동안 다른 사용자로 바뀌었으면 늦게 온 결과는 버린다.
  if (loadedUserId !== userId) return;
  if (error) {
    loadedUserId = undefined; // 다음 구독 때 다시 시도한다.
    return;
  }
  emit(data ? { id: userId, name: data.nickname, isAdmin: data.role === "admin" } : null);
}

function refresh() {
  supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user.id ?? null));
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!isListening) {
    isListening = true;
    // 콜백 안에서 바로 Supabase를 호출하면 멈출 수 있어서 다음 틱으로 미룬다.
    supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => loadProfile(session?.user.id ?? null), 0);
    });
  }
  // 로그인 액션 뒤 화면 이동은 새로고침이 아니라서, 화면이 구독할 때마다 세션을 다시 확인한다.
  refresh();
  return () => {
    listeners.delete(onChange);
  };
}

/** 로그인하지 않았거나 아직 확인 중이면 null. 서버 렌더링과 첫 hydration에서도 null이다. */
export function useCurrentUser(): CurrentUser | null {
  return useSyncExternalStore(subscribe, () => currentUser, () => null);
}

/** 로그인 후 돌아올 주소를 붙인 로그인 페이지 주소. RedirectToField가 redirectTo를 읽는다. */
export function loginHref(returnTo: string) {
  return `${LOGIN_PATH}?redirectTo=${encodeURIComponent(returnTo)}`;
}
