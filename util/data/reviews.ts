import type { ProductReview } from "../types/detail";
import { productMedia } from "./productMedia";

// 실제 구매 후기가 아닌 로컬 개발 예제. API 연결 시 상품 ID로 서버 리뷰를 조회한다.
const examples = [
  { id: 101, name: "키링", notes: ["가방에 연결한 모습을 확인하는 사진 후기 예시입니다.", "캐릭터의 표정과 윤곽을 살펴보는 후기 예시입니다.", "고리와 연결 부분에 대한 의견을 표시하는 예시입니다.", "사진 없는 짧은 후기를 표시합니다.", "다섯 번째 후기입니다. 다음 페이지 이동을 확인할 수 있습니다."] },
  { id: 102, name: "머그컵", notes: ["책상 위 머그컵 배치를 이야기하는 후기 예시입니다.", "손잡이 방향과 그림 배치에 대한 예시입니다.", "컵 디자인에 대한 짧은 의견 예시입니다.", "사진 없는 후기를 확인합니다.", "두 번째 리뷰 페이지의 머그컵 예시입니다."] },
  { id: 103, name: "노트북 커버", notes: ["노트북과 캐릭터 조합을 소개하는 후기 예시입니다.", "기기별 규격 확인에 대한 예시입니다.", "커버의 디자인에 대한 의견 예시입니다.", "텍스트 후기 표시를 확인합니다.", "두 번째 리뷰 페이지의 커버 예시입니다."] },
  { id: 104, name: "마우스패드", notes: ["키보드 옆 패드 배치를 소개하는 후기 예시입니다.", "테두리 디자인에 대한 의견 예시입니다.", "책상 색상과의 조합을 이야기하는 예시입니다.", "짧은 후기를 표시합니다.", "두 번째 리뷰 페이지의 패드 예시입니다."] },
  { id: 105, name: "포토카드", notes: ["포토카드 전시를 소개하는 후기 예시입니다.", "일러스트 색상에 대한 의견 예시입니다.", "카드의 여백 구성에 대한 예시입니다.", "사진 없는 후기를 표시합니다.", "두 번째 리뷰 페이지의 카드 예시입니다."] },
  { id: 106, name: "아이맥", notes: ["화면에 배치한 캐릭터에 대한 후기 예시입니다.", "밝은 배경 디자인에 대한 예시입니다.", "작업 공간 연출에 대한 의견 예시입니다.", "예시 데이터의 텍스트 후기를 표시합니다.", "두 번째 리뷰 페이지의 화면 연출 예시입니다."] },
] as const;
const ratings = [5, 4, 3, 5, 4] as const;
export const productReviews: readonly ProductReview[] = examples.flatMap((entry) => entry.notes.map((body, index) => {
  const review_photo = productMedia[entry.id].review;
  return {
    id: `demo-${entry.id}-${index + 1}`, productId: entry.id,
    authorName: `예시 작성자 ${index + 1}`, rating: ratings[index], body,
    createdAt: `2026-10-${String(14 - index).padStart(2, "0")}T00:00:00.000Z`,
    images: index === 0 && review_photo ? [{ id: `${entry.id}-review-photo`, src: review_photo, alt: `${entry.name} 예시 후기 사진` }] : [],
  };
}));
