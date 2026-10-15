import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCarouselControlsProps {
  index: number;
  paused: boolean;
  reducedMotion: boolean;
  autoRunning: boolean;
  autoplayMs: number;
  onMove: (direction: number) => void;
  onPauseChange: (paused: boolean) => void;
}

export default function ProductCarouselControls({ index, paused, reducedMotion, autoRunning, autoplayMs, onMove, onPauseChange }: ProductCarouselControlsProps) {
  return <div className="ysh-carousel-controls" aria-label="상품 캐러셀 조작">
    <Button type="button" variant="ghost" size="icon" aria-label={paused ? "상품 자동 재생" : "상품 자동 재생 정지"} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => onPauseChange(!paused)}>
      {paused || reducedMotion ? <Play className="size-5" aria-hidden="true" /> : <Pause className="size-5" aria-hidden="true" />}
    </Button>
    <Button type="button" variant="ghost" size="icon" aria-label="이전 상품" onClick={() => onMove(-1)}><ChevronLeft className="size-5" aria-hidden="true" /></Button>
    <Button type="button" variant="ghost" size="icon" aria-label="다음 상품" onClick={() => onMove(1)} className="ysh-carousel-next">
      {!reducedMotion && <svg key={index} className="ysh-carousel-progress size-11" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" style={{ animationDuration: `${Math.max(1000, autoplayMs)}ms`, animationPlayState: autoRunning ? "running" : "paused" }} /></svg>}
      <ChevronRight className="size-5" aria-hidden="true" />
    </Button>
  </div>;
}
