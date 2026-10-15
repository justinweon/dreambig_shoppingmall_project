"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { PartnerLogo } from "@/util/types/home";
import useReducedMotion from "./useReducedMotion";
import "./homeThird.css";

interface PartnerLogoMarqueeProps {
  logos: readonly PartnerLogo[];
  title?: string;
  rowDurationSeconds?: readonly [number, number];
}

export default function PartnerLogoMarquee({ logos, title = "함께하는 브랜드", rowDurationSeconds = [28, 36] }: PartnerLogoMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const [touching, setTouching] = useState(false);
  const reduced_motion = useReducedMotion();
  if (logos.length === 0) return null;
  return (
    <section aria-label={title} className={`ysh-marquee ${paused || touching ? "ysh-marquee-paused" : ""} rounded-3xl bg-stone-50 py-10 text-stone-950`}
      onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)} onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-10">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button type="button" disabled={reduced_motion} aria-pressed={paused || reduced_motion} onClick={() => setPaused(!paused)}
          className="min-h-11 rounded-full border border-stone-300 px-5 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-50">
          {reduced_motion ? "모션 감소 적용" : paused ? "로고 재생" : "로고 정지"}
        </button>
      </div>
      {([0, 1] as const).map((row) => {
        const row_logos = logos.filter((logo) => logo.row === row);
        if (row_logos.length === 0) return null;
        return <div key={row} className="ysh-logo-row">
          <div className="ysh-logo-track" style={{ "--duration": `${Math.max(5, rowDurationSeconds[row])}s` } as CSSProperties}>
            {[false, true].map((clone) => <div key={String(clone)} className={`ysh-logo-group ${clone ? "ysh-logo-clone" : ""}`} aria-hidden={clone}>
              {row_logos.map((logo) => {
                const content = <Image src={logo.src} alt={clone ? "" : logo.name} width={144} height={72} className="max-h-18 w-full object-contain" />;
                return logo.href ? <a key={logo.id} className="ysh-logo rounded focus-visible:outline-2" href={logo.href} tabIndex={clone ? -1 : 0}>{content}</a>
                  : <span key={logo.id} className="ysh-logo">{content}</span>;
              })}
            </div>)}
          </div>
        </div>;
      })}
    </section>
  );
}
