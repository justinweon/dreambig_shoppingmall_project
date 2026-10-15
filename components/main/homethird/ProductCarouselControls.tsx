import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCarouselControlsProps {
  index: number;
  reducedMotion: boolean;
  autoRunning: boolean;
  autoplayMs: number;
  onMove: (direction: number) => void;
}

export default function ProductCarouselControls({ index, reducedMotion, autoRunning, autoplayMs, onMove }: ProductCarouselControlsProps) {
  return <div className="homethird-carousel-controls" aria-label="상품 캐러셀 조작">
    <Button type="button" variant="ghost" size="icon" aria-label="이전 상품" onClick={() => onMove(-1)}><ChevronLeft className="size-5" aria-hidden="true" /></Button>
    <Button type="button" variant="ghost" size="icon" aria-label="다음 상품" onClick={() => onMove(1)} className="homethird-carousel-next">
      {!reducedMotion && <svg key={index} className="homethird-carousel-progress size-11" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" style={{ animationDuration: `${Math.max(1000, autoplayMs)}ms`, animationPlayState: autoRunning ? "running" : "paused" }} /></svg>}
      <ChevronRight className="size-5" aria-hidden="true" />
    </Button>
  </div>;
}
