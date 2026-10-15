"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type MouseEvent,
} from "react";
import ProductCarouselCard, { type CarouselEntry } from "./ProductCarouselCard";
import useReducedMotion from "./useReducedMotion";
import { getCardWidth, getSwipeDirection, getVisibleCount, wrapIndex } from "./carouselModel";
import ProductCarouselControls from "./ProductCarouselControls";
import "./homethird.css";

interface ProductCarouselProps {
  entries: readonly CarouselEntry[];
  title: string;
  autoplayMs?: number;
}

export default function ProductCarousel({ entries, title, autoplayMs = 6000 }: ProductCarouselProps) {
  const container_ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = container_ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const visible = getVisibleCount(width);
  return (
    <div ref={container_ref} className="min-w-0">
      <CarouselTrack key={`${visible}:${entries.map(({ item }) => item.id).join(",")}`} entries={entries}
        title={title} autoplayMs={autoplayMs} width={width} visible={visible} />
    </div>
  );
}

interface CarouselTrackProps extends Required<ProductCarouselProps> {
  width: number;
  visible: number;
}

function CarouselTrack({ entries, title, autoplayMs, width, visible }: CarouselTrackProps) {
  const reduced_motion = useReducedMotion();
  const count = entries.length;
  const can_move = count > 1 && width > 0;
  const card_width = getCardWidth(width);
  const stride = card_width + 14;
  const edge_offset = can_move ? Math.max(16, Math.min(110, width * 0.055)) : Math.max(16, (width - card_width) / 2);
  const [index, setIndex] = useState(0);
  const index_ref = useRef(0);
  const locked_ref = useRef(false);
  const [moving, setMoving] = useState(false);
  const [transition, setTransition] = useState(true);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const pointer_ref = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppress_click_ref = useRef(false);
  const click_timer_ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const move = useCallback((direction: number) => {
    if (!can_move || locked_ref.current) return;
    const next = index_ref.current + direction;
    index_ref.current = reduced_motion ? wrapIndex(next, count) : next;
    setIndex(index_ref.current);
    if (!reduced_motion) {
      locked_ref.current = true;
      setMoving(true);
    }
  }, [can_move, reduced_motion, count]);

  const finishTransition = useCallback(() => {
    const normalized = wrapIndex(index_ref.current, count);
    if (normalized !== index_ref.current) {
      // 복제본과 같은 실제 카드로 이동할 때만 transition을 끈다.
      setTransition(false);
      index_ref.current = normalized;
      setIndex(normalized);
    } else {
      locked_ref.current = false;
    }
    setMoving(false);
  }, [count]);

  useEffect(() => {
    if (transition) return;
    let second_frame = 0;
    const first_frame = requestAnimationFrame(() => {
      second_frame = requestAnimationFrame(() => {
        setTransition(true);
        locked_ref.current = false;
      });
    });
    return () => { cancelAnimationFrame(first_frame); cancelAnimationFrame(second_frame); };
  }, [transition]);

  useEffect(() => {
    if (!moving) return;
    // 탭 숨김이나 모션 설정 변경으로 transitionend가 생략돼도 잠금을 해제한다.
    const timer = setTimeout(finishTransition, 500);
    return () => clearTimeout(timer);
  }, [moving, finishTransition]);

  useEffect(() => {
    if (!can_move || reduced_motion || focused || touching) return;
    const timer = setInterval(() => { if (!document.hidden) move(1); }, Math.max(1000, autoplayMs));
    return () => clearInterval(timer);
  }, [can_move, reduced_motion, focused, touching, autoplayMs, move]);

  useEffect(() => () => { if (click_timer_ref.current) clearTimeout(click_timer_ref.current); }, []);

  // 포인터 입력 처리는 JSX 밖에서 모아둔다.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppress_click_ref.current = false;
    pointer_ref.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setTouching(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointer_ref.current;
    if (
      start && start.id === event.pointerId && can_move &&
      getSwipeDirection(event.clientX - start.x, event.clientY - start.y)
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
      suppress_click_ref.current = true;
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointer_ref.current;
    if (start && start.id === event.pointerId) {
      const direction = getSwipeDirection(event.clientX - start.x, event.clientY - start.y);
      if (direction && can_move) {
        move(direction);
        suppress_click_ref.current = true;
      }
    }
    pointer_ref.current = null;
    setTouching(false);
    if (click_timer_ref.current) clearTimeout(click_timer_ref.current);
    click_timer_ref.current = setTimeout(() => { suppress_click_ref.current = false; }, 350);
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppress_click_ref.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppress_click_ref.current = false;
  }

  const slides = can_move
    ? [...Array.from({ length: visible }, (_, i) => ({ entry: entries[wrapIndex(i - visible, count)], key: `before-${i}` })),
      ...entries.map((entry) => ({ entry, key: entry.item.id })),
      ...Array.from({ length: visible }, (_, i) => ({ entry: entries[i % count], key: `after-${i}` }))]
    : entries.map((entry) => ({ entry, key: entry.item.id }));
  const active_index = wrapIndex(index, count);
  const auto_running = can_move && !reduced_motion && !focused && !touching;

  return (
    <section aria-label={title} aria-roledescription="캐러셀" className="homethird-product-carousel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <h2 className="homethird-carousel-title">{title}</h2>
      {count === 0 ? <p className="rounded-2xl bg-stone-50 p-8 text-stone-600">표시할 상품이 없습니다.</p> : <div className="overflow-hidden" style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointer_ref.current = null; setTouching(false); suppress_click_ref.current = false; }}
        onPointerLeave={() => { if (!suppress_click_ref.current) { pointer_ref.current = null; setTouching(false); } }}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}>
        <div className="homethird-product-track"
          style={{ transform: `translateX(${edge_offset - (can_move ? (index + visible) * stride : 0)}px)`, transition: transition && !reduced_motion ? "transform 350ms ease" : "none" }}
          onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === "transform" && moving) finishTransition(); }}>
          {slides.map(({ entry, key }, position) => {
            // 반복 끝에서 실제 보이는 복제 카드만 활성화한다. 같은 상품의 원본은 숨겨
            // 링크 클릭은 유지하면서 중복 탭 정지와 중복 낭독을 막는다.
            const x = (position - index - visible) * stride + edge_offset;
            const active = !can_move || (x + card_width > 0 && x < width);
            return <div key={key} aria-hidden={!active} inert={!active}
              className="min-w-0 shrink-0" style={{ width: card_width }}>
              <ProductCarouselCard entry={entry} tabIndex={active ? 0 : -1} />
            </div>;
          })}
        </div>
      </div>}
      {can_move && <ProductCarouselControls index={active_index} reducedMotion={reduced_motion} autoRunning={auto_running} autoplayMs={autoplayMs} onMove={move} />}
    </section>
  );
}
