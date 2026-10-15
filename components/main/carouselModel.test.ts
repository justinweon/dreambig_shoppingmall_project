import { test } from "node:test";
import assert from "node:assert/strict";
import { getSwipeDirection, getVisibleCount, wrapIndex } from "./carouselModel";

test("캐러셀 양 끝 복제 구간은 실제 상품으로 돌아간다", () => {
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(wrapIndex(-13, 6), 5);
  assert.equal(wrapIndex(0, 0), 0);
});
test("실제 컨테이너 너비로 표시 카드 수를 결정한다", () => {
  assert.equal(getVisibleCount(343), 1);
  assert.equal(getVisibleCount(720), 2);
  assert.equal(getVisibleCount(1216), 3);
});
test("작은 탭과 세로 스크롤은 상품 이동으로 처리하지 않는다", () => {
  assert.equal(getSwipeDirection(20, 0), 0);
  assert.equal(getSwipeDirection(50, 100), 0);
  assert.equal(getSwipeDirection(-90, 5), 1);
  assert.equal(getSwipeDirection(90, 5), -1);
});
