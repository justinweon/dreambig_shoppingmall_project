"use client";

import { useState, type CSSProperties } from "react";

interface HunminLetterRowProps {
  letters: readonly string[];
  label: string;
  duration: number;
  variant: "consonants" | "vowels";
}

export default function HunminLetterRow({ letters, label, duration, variant }: HunminLetterRowProps) {
  const [touching, setTouching] = useState(false);
  return <div className={`homethird-letter-row homethird-letter-${variant} ${touching ? "homethird-letter-paused" : ""}`}
    role="group" aria-label={label} tabIndex={0}
    onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)}
    onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}>
    <div className="homethird-letter-track" style={{ "--row-duration": `${duration}s` } as CSSProperties}>
      {[0, 1, 2].map((copy) => <ul key={copy} className={`homethird-letter-group ${copy ? "homethird-letter-clone" : ""}`} aria-hidden={copy > 0}>
        {letters.map((letter, index) => <li key={`${letter}-${index}`} className="homethird-letter-tile"><span>{letter}</span></li>)}
      </ul>)}
    </div>
  </div>;
}
