"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCarouselCard, { type CarouselEntry } from "./ProductCarouselCard";
import useReducedMotion from "./useReducedMotion";
import { getSwipeDirection, getVisibleCount, wrapIndex } from "./carouselModel";

interface ProductCarouselProps {
  entries: readonly CarouselEntry[];
  title?: string;
  autoplayMs?: number;
}

export default function ProductCarousel({ entries, title = "일상에 더하는 작은 즐거움", autoplayMs = 6000 }: ProductCarouselProps) {
  const container_ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);
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
        title={title} autoplayMs={autoplayMs} width={width} visible={visible} paused={paused} onPauseChange={setPaused} />
    </div>
  );
}

function CarouselTrack({ entries, title, autoplayMs, width, visible, paused, onPauseChange }: Required<ProductCarouselProps> & { width: number; visible: number; paused: boolean; onPauseChange: (paused: boolean) => void }) {
  const reduced_motion = useReducedMotion();
  const count = entries.length;
  const can_move = count > visible && width > 0;
  const [index, setIndex] = useState(0);
  const index_ref = useRef(0);
  const locked_ref = useRef(false);
  const [moving, setMoving] = useState(false);
  const [transition, setTransition] = useState(true);
  const [hovered, setHovered] = useState(false);
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
    if (!can_move || reduced_motion || paused || hovered || focused || touching) return;
    const timer = setInterval(() => { if (!document.hidden) move(1); }, Math.max(1000, autoplayMs));
    return () => clearInterval(timer);
  }, [can_move, reduced_motion, paused, hovered, focused, touching, autoplayMs, move]);

  useEffect(() => () => { if (click_timer_ref.current) clearTimeout(click_timer_ref.current); }, []);

  const slides = can_move
    ? [...entries.slice(-visible).map((entry, i) => ({ entry, key: `before-${i}` })),
      ...entries.map((entry) => ({ entry, key: entry.item.id })),
      ...entries.slice(0, visible).map((entry, i) => ({ entry, key: `after-${i}` }))]
    : entries.map((entry) => ({ entry, key: entry.item.id }));
  const active_index = wrapIndex(index, count);
  const button_class = "flex min-h-11 min-w-11 items-center justify-center rounded-full border border-stone-300 bg-white px-4 text-stone-950 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-40";

  return (
    <section aria-label={title} aria-roledescription="캐러셀" className="min-w-0"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm tracking-[0.2em] text-stone-500">EXPLORE THE COLLECTION</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2></div>
        {can_move && <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={button_class} onClick={() => move(-1)} aria-label="이전 상품">←</button>
          <button type="button" className={button_class} onClick={() => move(1)} aria-label="다음 상품">→</button>
          <button type="button" className={button_class} disabled={reduced_motion} aria-pressed={paused || reduced_motion}
            onClick={() => onPauseChange(!paused)}>{reduced_motion ? "모션 감소 적용" : paused ? "자동 재생" : "자동 재생 정지"}</button>
        </div>}
      </div>
      {count === 0 ? <p className="rounded-2xl bg-stone-50 p-8 text-stone-600">표시할 상품이 없습니다.</p> : <div className="overflow-hidden" style={{ touchAction: "pan-y" }}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          suppress_click_ref.current = false;
          pointer_ref.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          setTouching(true);
        }}
        onPointerMove={(event) => {
          const start = pointer_ref.current;
          if (start && start.id === event.pointerId && can_move && getSwipeDirection(event.clientX - start.x, event.clientY - start.y)) {
            event.currentTarget.setPointerCapture(event.pointerId);
            suppress_click_ref.current = true;
          }
        }}
        onPointerUp={(event) => {
          const start = pointer_ref.current;
          if (start && start.id === event.pointerId) {
            const direction = getSwipeDirection(event.clientX - start.x, event.clientY - start.y);
            if (direction && can_move) { move(direction); suppress_click_ref.current = true; }
          }
          pointer_ref.current = null;
          setTouching(false);
          if (click_timer_ref.current) clearTimeout(click_timer_ref.current);
          click_timer_ref.current = setTimeout(() => { suppress_click_ref.current = false; }, 350);
        }}
        onPointerCancel={() => { pointer_ref.current = null; setTouching(false); suppress_click_ref.current = false; }}
        onClickCapture={(event) => { if (suppress_click_ref.current) { event.preventDefault(); event.stopPropagation(); suppress_click_ref.current = false; } }}
        onDragStart={(event) => event.preventDefault()}>
        <div className="flex gap-6 motion-reduce:transition-none"
          style={{ transform: `translateX(-${can_move ? (index + visible) * (width + 24) / visible : 0}px)`, transition: transition && !reduced_motion ? "transform 350ms ease" : "none" }}
          onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === "transform" && moving) finishTransition(); }}>
          {slides.map(({ entry, key }, position) => {
            // 반복 끝에서 실제 보이는 복제 카드만 활성화한다. 같은 상품의 원본은 숨겨
            // 링크 클릭은 유지하면서 중복 탭 정지와 중복 낭독을 막는다.
            const active = !can_move || (position >= index + visible && position < index + visible * 2);
            return <div key={key} aria-hidden={!active} inert={!active}
              className="min-w-0 shrink-0" style={{ width: `calc((100% - ${(visible - 1) * 24}px) / ${visible})` }}>
              <ProductCarouselCard entry={entry} tabIndex={active ? 0 : -1} />
            </div>;
          })}
        </div>
      </div>}
      {can_move && <p aria-live={paused || focused || hovered || touching ? "polite" : "off"} className="mt-4 text-sm tabular-nums text-stone-500">{active_index + 1} / {count}</p>}
    </section>
  );
}
