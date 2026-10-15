/** 복제 구간에서도 실제 상품 인덱스는 0 ~ count - 1이다. */
export function wrapIndex(index: number, count: number) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

export function getVisibleCount(width: number) {
  return width >= 960 ? 3 : width >= 600 ? 2 : 1;
}

export function getSwipeDirection(dx: number, dy: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.2) return 0;
  return dx < 0 ? 1 : -1;
}
