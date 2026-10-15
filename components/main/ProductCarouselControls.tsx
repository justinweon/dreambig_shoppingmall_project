interface ProductCarouselControlsProps {
  index: number;
  count: number;
  paused: boolean;
  reducedMotion: boolean;
  autoRunning: boolean;
  autoplayMs: number;
  onMove: (direction: number) => void;
  onPauseChange: (paused: boolean) => void;
}

export default function ProductCarouselControls({ index, count, paused, reducedMotion, autoRunning, autoplayMs, onMove, onPauseChange }: ProductCarouselControlsProps) {
  return <div className="ysh-carousel-controls" aria-label="상품 캐러셀 조작">
    <span className="ysh-carousel-position" aria-live={autoRunning ? "off" : "polite"}>{index + 1} / {count}</span>
    <button type="button" aria-label={paused ? "상품 자동 재생" : "상품 자동 재생 정지"} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => onPauseChange(!paused)}>{paused || reducedMotion ? "▶" : "Ⅱ"}</button>
    <button type="button" aria-label="이전 상품" onClick={() => onMove(-1)}>‹</button>
    <button type="button" aria-label="다음 상품" onClick={() => onMove(1)} className="ysh-carousel-next">
      {!reducedMotion && <svg key={index} viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" style={{ animationDuration: `${Math.max(1000, autoplayMs)}ms`, animationPlayState: autoRunning ? "running" : "paused" }} /></svg>}
      ›
    </button>
  </div>;
}
