"use client";

import { useState, type CSSProperties } from "react";
import useReducedMotion from "./useReducedMotion";

interface HunminLetterRowProps {
  letters: readonly string[];
  label: string;
  duration: number;
  variant: "consonants" | "vowels";
}

export default function HunminLetterRow({ letters, label, duration, variant }: HunminLetterRowProps) {
  const [paused, setPaused] = useState(false);
  const [touching, setTouching] = useState(false);
  const reducedMotion = useReducedMotion();
  return <div className={`ysh-letter-row ysh-letter-${variant} ${paused || touching ? "ysh-letter-paused" : ""}`}
    role="group" aria-label={label} tabIndex={0}
    onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)}
    onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}>
    <div className="ysh-letter-track" style={{ "--row-duration": `${duration}s` } as CSSProperties}>
      {[0, 1, 2].map((copy) => <ul key={copy} className={`ysh-letter-group ${copy ? "ysh-letter-clone" : ""}`} aria-hidden={copy > 0}>
        {letters.map((letter, index) => <li key={`${letter}-${index}`} className="ysh-letter-tile"><span>{letter}</span></li>)}
      </ul>)}
    </div>
    <button type="button" className="ysh-letter-pause" disabled={reducedMotion} aria-pressed={paused || reducedMotion}
      aria-label={`${label} ${paused ? "자동 재생" : "자동 재생 정지"}`} onClick={() => setPaused(!paused)}>
      {reducedMotion ? "모션 감소 적용" : paused ? "재생" : "정지"}
    </button>
  </div>;
}
