"use client";

import { useSyncExternalStore } from "react";

// 로그인 페이지가 아직 없어서 임시로 localStorage에 로그인 사용자를 저장한다.
// 로그인 페이지를 만들면 로그인 성공 시 setCurrentUser(...)를, 로그아웃 시 setCurrentUser(null)을 호출하면 된다.
// 실제 인증(세션/토큰)으로 바꿀 때는 이 파일만 교체한다.

export const LOGIN_PATH = "/login";

export interface CurrentUser {
  readonly name: string;
  /** 공지 게시판 글쓰기 권한 */
  readonly isAdmin: boolean;
}

const STORAGE_KEY = "hunmin-user";
const CHANGE_EVENT = "hunmin-user-change";

// 같은 문자열이면 같은 객체를 돌려줘야 useSyncExternalStore가 무한 렌더링하지 않는다.
let cachedRaw: string | null = null;
let cachedUser: CurrentUser | null = null;

function readUser(): CurrentUser | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedUser = parsed && typeof parsed.name === "string"
      ? { name: parsed.name, isAdmin: parsed.isAdmin === true }
      : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function setCurrentUser(user: CurrentUser | null) {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소를 쓸 수 없는 환경(시크릿 모드 등)은 무시한다.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 로그인하지 않았으면 null. 서버 렌더링과 첫 hydration에서도 null이다. */
export function useCurrentUser(): CurrentUser | null {
  return useSyncExternalStore(subscribe, readUser, () => null);
}

/** 로그인 후 돌아올 주소를 붙인 로그인 페이지 주소 */
export function loginHref(returnTo: string) {
  return `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`;
}
