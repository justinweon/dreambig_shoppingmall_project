import { test } from "node:test";
import assert from "node:assert/strict";
import { getCardWidth, getSwipeDirection, getVisibleCount, wrapIndex } from "./carouselModel";

test("캐러셀 양 끝 복제 구간은 실제 상품으로 돌아간다", () => {
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(wrapIndex(-13, 6), 5);
  assert.equal(wrapIndex(0, 0), 0);
});
test("복제 구간은 넓은 화면과 양쪽 일부 카드까지 채운다", () => {
  for (const width of [343, 720, 1216, 1920, 3840]) {
    assert.ok(getVisibleCount(width) * (getCardWidth(width) + 14) > width);
  }
  assert.equal(getCardWidth(375), 220);
  assert.equal(getCardWidth(1440), 280);
});
test("작은 탭과 세로 스크롤은 상품 이동으로 처리하지 않는다", () => {
  assert.equal(getSwipeDirection(20, 0), 0);
  assert.equal(getSwipeDirection(50, 100), 0);
  assert.equal(getSwipeDirection(-90, 5), 1);
  assert.equal(getSwipeDirection(90, 5), -1);
});
