"use client";

import { Suspense, useActionState, useState, useRef } from "react";
import type { InputHTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Eye, EyeOff } from "lucide-react";
import { signUpAction } from "@/domains/auth/actions/signup.action";
import RedirectToField from "@/domains/auth/components/RedirectToField";
import AuthSwitchLink from "@/domains/auth/components/AuthSwitchLink";
import { INITIAL_ACTION_STATE } from "@/shared/types/action.types";

const inputClass =
  "mt-2 h-12 w-full border border-neutral-300 bg-white px-4 text-[15px] outline-none placeholder:text-neutral-400 focus:border-neutral-950 xl:h-14";

const sectionTitleClass =
  "mb-6 mt-10 border-b border-neutral-200 pb-3 text-sm font-semibold text-neutral-950";

const switchLinkClass = "ml-2 border-b border-neutral-950 font-medium text-neutral-950";


// 카카오 우편번호 프로그램이 window에 붙여 주는 것의 모양
declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void;
      }) => { open: () => void };
    };
  }
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

// 라벨 + 입력칸 + 에러 문구 한 묶음
function Field({ id, label, error, className, ...props }: FieldProps) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-[13px] font-semibold text-neutral-950">
        {label}
      </label>
      <input id={id} name={id} className={`${inputClass} ${className ?? ""}`} {...props} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, INITIAL_ACTION_STATE);
  const [showPw, setShowPw] = useState(false);

  // 주소찾기 결과 
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const detailRef = useRef<HTMLInputElement>(null);

  const openPostcode =() =>{
    if (!window.daum)return;
    new window.daum.Postcode({
        oncomplete: (data) => {
            setZipCode(data.zonecode);
            setAddress(data.roadAddress || data.jibunAddress);
            detailRef.current?.focus()
        }
    }).open();
  }

  const kept = state.data as
    | { name?: string; nickname?: string; email?: string; phone?: string; addressDetail?: string }
    | undefined;
  const errors = state.errors ?? {};

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-24 pt-8 lg:px-12 xl:px-20">
        <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      {/* 경로 */}
      <nav className="mb-10 text-xs text-neutral-500">
        <Link href="/">집</Link>
        <span className="mx-2">/</span>
        <span>새로 들기</span>
      </nav>

      <div className="grid items-start gap-12 lg:grid-cols-[585fr_988fr] lg:gap-[7%]">
        {/* ── 왼쪽: 폼 ── */}
        <section className="mx-auto w-full max-w-[460px] lg:mx-0 lg:pt-[6%]">
          <p className="text-[13px] text-neutral-500">여봐라, 훈민상점에 처음 왔느냐</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950 xl:text-4xl">
            새 이름표를 지어라
          </h1>
          <p className="mt-5 text-sm text-neutral-600">
            아래를 채우면 그대의 이름표를 만들어 주겠노라.
          </p>

          <form className="mt-8" noValidate action={formAction}>
            <Suspense fallback={null}>
              <RedirectToField />
            </Suspense>

            {state.message && !state.success && (
              <p className="mb-6 border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
                {state.message}
              </p>
            )}

            {/* ■ 계정 */}
            <h2 className={sectionTitleClass}>계정</h2>
            <Field
              id="email"
              label="편지 받을 곳"
              type="email"
              placeholder="편지 받을 곳을 아뢰어라"
              defaultValue={kept?.email}
              error={errors.email}
            />
            <div className="mb-6">
              <label htmlFor="password" className="block text-[13px] font-semibold text-neutral-950">
                비밀글쇠
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="8자 이상으로 아뢰어라"
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
              {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password}</p>}
            </div>
            <Field
              id="passwordConfirm"
              label="비밀글쇠 다시 쓰기"
              type={showPw ? "text" : "password"}
              placeholder="비밀글쇠를 한 번 더 아뢰어라"
              error={errors.passwordConfirm}
            />

            {/* ■ 그대에 대하여 */}
            <h2 className={sectionTitleClass}>그대에 대하여</h2>
            <Field
              id="name"
              label="이름"
              placeholder="그대의 이름을 아뢰어라"
              defaultValue={kept?.name}
              error={errors.name}
            />
            <Field
              id="nickname"
              label="닉네임"
              placeholder="훈민상점에서 부를 이름 (2~12자)"
              defaultValue={kept?.nickname}
              error={errors.nickname}
            />
            <Field
              id="phone"
              label="휴대폰 번호"
              type="tel"
              inputMode="numeric"
              placeholder="010-1234-5678"
              defaultValue={kept?.phone}
              error={errors.phone}
            />

            {/* ■ 기본 배송지 */}
            <h2 className={sectionTitleClass}>기본 배송지</h2>
            <div className="mb-6">
              <label htmlFor="zipCode" className="block text-[13px] font-semibold text-neutral-950">
                집 주소
              </label>
              <div className="flex gap-2">
                <input
                  id="zipCode"
                  name="zipCode"
                  value={zipCode}
                  readOnly
                  placeholder="우편번호"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="mt-2 h-12 shrink-0 border border-neutral-950 px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-100 xl:h-14"
                >
                  주소 찾기
                </button>
              </div>
              <input
                name="address"
                value={address}
                readOnly
                placeholder="주소 찾기를 눌러 주소를 고르라"
                className={inputClass}
              />
              <input
                ref={detailRef}
                name="addressDetail"
                defaultValue={kept?.addressDetail}
                placeholder="상세 주소 (동·호수)"
                className={inputClass}
              />
              {errors.address && <p className="mt-2 text-xs text-red-600">{errors.address}</p>}
              <p className="mt-2 text-xs text-neutral-500">
                물건을 살 때 이 주소가 먼저 적혀 있고, 그때 바꿀 수 있느니라.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 h-14 w-full bg-neutral-950 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {isPending ? "이름표 만드는 중..." : "예, 새로 들겠나이다"}
            </button>

            <p className="mt-6 text-center text-[13px] text-neutral-500">
              이미 이름표가 있느냐?
              <Suspense
                fallback={
                  <Link href="/login" className={switchLinkClass}>
                    들어가기
                  </Link>
                }
              >
                <AuthSwitchLink href="/login" className={switchLinkClass}>
                  들어가기
                </AuthSwitchLink>
              </Suspense>
            </p>
          </form>
        </section>

        {/* ── 오른쪽: 이미지 (스크롤해도 따라옴) ── */}
        <section className="relative hidden aspect-[988/930] w-full overflow-hidden bg-[#e9dccd] lg:sticky lg:top-8 lg:block">
          <Image
            src="/images/sejong-login-hero.png"
            alt="노트북을 하는 세종대왕 캐릭터"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 0px"
            className="object-cover"
          />
          <div className="absolute left-[5%] top-[13%] z-10 text-neutral-950">
            <p className="text-[clamp(10px,0.75vw,13px)]">세종이야기</p>
            <p className="mt-[1.1em] text-[clamp(15px,1.45vw,26px)] leading-[1.45]">
              여봐라,
              <br />
              새 이름표를 지어 주마.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}