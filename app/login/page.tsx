"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

const TABS = [
  { key: "login", label: "들어가기" },
  { key: "signup", label: "새로 들기" },
] as const;

const inputClass =
  "mt-2 h-12 w-full border border-neutral-300 bg-white px-4 text-[15px] outline-none placeholder:text-neutral-400 focus:border-neutral-950 xl:h-14";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const isLogin = mode === "login";

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-24 pt-8 lg:px-12 xl:px-20">
      {/* 경로 */}
      <nav className="mb-10 text-xs text-neutral-500">
        <Link href="/">집</Link>
        <span className="mx-2">/</span>
        <span>이름표</span>
      </nav>

      {/* 폼 585 : 이미지 988 (Figma 비율) */}
      <div className="grid items-start gap-12 lg:grid-cols-[585fr_988fr] lg:gap-[7%]">
        {/* ── 왼쪽: 폼 ── */}
        <section className="mx-auto w-full max-w-[460px] lg:mx-0 lg:pt-[6%]">
          <p className="text-[13px] text-neutral-500">
            여봐라, 훈민상점에 잘 찾아왔도다
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950 xl:text-4xl">
            그대는 누구인고?
          </h1>
          <p className="mt-5 text-sm text-neutral-600">
            편지 받을 곳과 비밀글쇠를 적으면 내가 문을 열어 주겠노라.
          </p>

          {/* 탭 */}
          <div className="mt-10 grid grid-cols-2 border-b border-neutral-200">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`-mb-px border-b-2 py-3 text-sm transition-colors ${
                  mode === key
                    ? "border-neutral-950 font-semibold text-neutral-950"
                    : "border-transparent text-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: 로그인 / 회원가입 API 연결
            }}
          >
            <label
              htmlFor="email"
              className="block text-[13px] font-semibold text-neutral-950"
            >
              편지 받을 곳
            </label>
            <input
              id="email"
              type="email"
              placeholder="편지 받을 곳을 아뢰어라"
              className={inputClass}
            />

            <label
              htmlFor="password"
              className="mt-6 block text-[13px] font-semibold text-neutral-950"
            >
              비밀글쇠
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="비밀글쇠를 아뢰어라"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "비밀글쇠 숨기기" : "비밀글쇠 보기"}
                className="absolute right-4 top-2 flex h-12 items-center text-neutral-500 xl:h-14"
              >
                {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
                <input type="checkbox" className="size-4 accent-neutral-950" />
                나를 기억하게 하기
              </label>
              <Link
                href="#"
                className="border-b border-neutral-950 font-medium text-neutral-950"
              >
                비밀글쇠를 잊었느냐?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-8 h-14 w-full bg-neutral-950 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              {isLogin ? "예, 들어가겠나이다" : "예, 새로 들겠나이다"}
            </button>

            <p className="mt-6 text-center text-[13px] text-neutral-500">
              {isLogin ? "아직 이름표가 없느냐?" : "이미 이름표가 있느냐?"}
              <button
                type="button"
                onClick={() => setMode(isLogin ? "signup" : "login")}
                className="ml-2 border-b border-neutral-950 font-medium text-neutral-950"
              >
                {isLogin ? "새로 들기" : "들어가기"}
              </button>
            </p>
          </form>
        </section>

        {/* ── 오른쪽: 이미지 (988 : 930) ── */}
        <section className="relative hidden aspect-[988/930] w-full overflow-hidden bg-[#e9dccd] lg:block">
          <Image
            src="/images/sejong-login-hero.png"
            alt="노트북을 하는 세종대왕 캐릭터"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 0px"
            className="object-cover"
          />
          {/* 글자는 화면 너비에 비례해서 커지고 줄어듦 */}
          <div className="absolute left-[5%] top-[13%] z-10 text-neutral-950">
            <p className="text-[clamp(10px,0.75vw,13px)]">세종이야기</p>
            <p className="mt-[1.1em] text-[clamp(15px,1.45vw,26px)] leading-[1.45]">
              여봐라,
              <br />
              그대의 이름표를 보여라.
            </p>
            <p className="mt-[2.2em] text-[clamp(9px,0.65vw,11px)] text-neutral-600">
              내 던질 것은 던져도, 그대의 이름은 기억하리라
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}