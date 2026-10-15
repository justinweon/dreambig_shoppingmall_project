/** 복제 구간에서도 실제 상품 인덱스는 0 ~ count - 1이다. */
export function wrapIndex(index: number, count: number) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

export function getVisibleCount(width: number) {
  return Math.ceil(width / (getCardWidth(width) + 14)) + 1;
}

export function getCardWidth(width: number) { return width < 600 ? 220 : 280; }

export function getSwipeDirection(dx: number, dy: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.2) return 0;
  return dx < 0 ? 1 : -1;
}
