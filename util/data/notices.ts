import type { NoticeBoardKey, NoticeCommentMap, NoticePost } from "../types/notice";

// 훈민 게시판 개발용 예시 글과 댓글. 실제 공지로 교체해야 한다.
export const noticeBoardLabels: Readonly<Record<NoticeBoardKey, string>> = {
  notice: "공지",
  free: "자유게시판",
};

export const noticeBoardKeys: readonly NoticeBoardKey[] = ["notice", "free"];

export const seedNoticePosts: readonly NoticePost[] = [
  { id: "n6", board: "notice", title: "훈민 게시판이 새로 문을 열었어요", author: "훈민상점", date: "2026.10.20", views: 312,
    content: "<p>안녕하세요, 훈민상점이에요! 굿즈 이야기, 사용 후기, 엉뚱한 아이디어까지 마음껏 나눌 수 있는 게시판을 열었어요.</p><h2>이렇게 써 주세요</h2><ul><li><p><strong>공지</strong>에는 상점 소식이 올라와요.</p></li><li><p><strong>자유게시판</strong>은 여러분의 수다 마당이에요.</p></li></ul><blockquote><p>서로 웃게 만드는 글이면 충분하고도 남아요.</p></blockquote>" },
  { id: "n5", board: "notice", title: "[배송] 연휴 기간 출고 일정 안내", author: "훈민상점", date: "2026.10.02", views: 1204,
    content: "<p>연휴 동안에는 출고가 잠시 쉬어 가요. 정확한 일정은 [출고 재개일]에 맞춰 다시 알려 드릴게요.</p>" },
  { id: "n4", board: "notice", title: "세종 열쇠고리 재입고 소식", author: "훈민상점", date: "2026.09.21", views: 2310,
    content: "<p>“그냥 귀여워서 샀어요!” 해 주신 덕분에 세종 열쇠고리가 다시 돌아왔어요. 가방 한구석에서 존재감을 뿜뿜해 주세요.</p>" },
  { id: "n3", board: "notice", title: "교환 및 반품 절차가 쉬워졌어요", author: "훈민상점", date: "2026.09.03", views: 845,
    content: "<p>도움마당의 <strong>교환 및 반품</strong> 메뉴에서 바로 신청할 수 있어요.</p>" },
  { id: "n2", board: "notice", title: "한글날 맞이 굿즈 이야기 예고", author: "훈민상점", date: "2026.08.28", views: 977,
    content: "<p>한 글자씩, 이어지는 우리말. 한글날에 맞춰 새 이야기를 준비하고 있어요.</p>" },
  { id: "n1", board: "notice", title: "개인정보 처리방침 안내", author: "훈민상점", date: "2026.08.01", views: 402,
    content: "<p>개인정보 처리방침 전문은 페이지 아래 링크에서 확인할 수 있어요.</p>" },

  { id: "f12", board: "free", title: "세종 쉼표잔에 커피 담았더니 하루가 쉬어 가요", author: "세종덕후", date: "2026.10.19", views: 128,
    content: "<p>아침마다 세종 쉼표잔에 커피를 내려요. 맥북을 든 세종대왕님이 저를 빤히 쳐다보시는데, 이상하게 일할 맛이 나요.</p><h2>좋았던 점</h2><ul><li><p>손에 쥐는 맛이 묵직해요.</p></li><li><p>회의 중에 웃음이 터져요. (진짜예요!)</p></li></ul><blockquote><p>커피보다 먼저 기분을 풀어 줘요.</p></blockquote><p>다음엔 마우스패드도 들일 생각이에요.</p>" },
  { id: "f11", board: "free", title: "열쇠고리 달고 출근했는데 팀장님이 웃으셨어요 ㅋㅋㅋ", author: "가나다라", date: "2026.10.18", views: 342,
    content: "<p>회의실 들어가는데 가방에서 세종이 흔들흔들. 팀장님이 “그거 맥북 던진 그분이죠?” 하셨어요.</p>" },
  { id: "f10", board: "free", title: "맥북 던진 세종, 다음 굿즈 아이디어 모아요", author: "한글사랑", date: "2026.10.17", views: 521,
    content: "<p>세종 양말, 세종 책갈피… 여러분이 갖고 싶은 굿즈를 댓글로 적어 주세요!</p>" },
  { id: "f9", board: "free", title: "마우스패드 크기 질문이요", author: "책상지기", date: "2026.10.15", views: 88,
    content: "<p>세종 손쥐 받침 크기가 노트북 옆에 두기에 적당할까요?</p>" },
  { id: "f8", board: "free", title: "한글날 선물로 머그컵 드렸어요", author: "집현전막내", date: "2026.10.09", views: 205,
    content: "<p>부모님이 보자마자 웃으셨어요. 그거면 충분하고도 남아요.</p>" },
  { id: "f7", board: "free", title: "세종맥 배경화면처럼 꾸며 봤어요", author: "모니터앞", date: "2026.10.06", views: 164, content: "<p>책상 위가 한결 밝아졌어요.</p>" },
  { id: "f6", board: "free", title: "피식 웃게 되는 굿즈 조합 추천", author: "피식", date: "2026.10.01", views: 233, content: "<p>열쇠고리 + 그림패 조합 강력 추천해요.</p>" },
  { id: "f5", board: "free", title: "세종 그림패 어디에 두셨나요?", author: "방꾸미기", date: "2026.09.27", views: 97, content: "<p>현관에 둘지 책상에 둘지 고민 중이에요.</p>" },
  { id: "f4", board: "free", title: "포장이 정말 정성스러웠어요", author: "택배기다림", date: "2026.09.20", views: 145, content: "<p>상자 열 때부터 기분이 좋았어요.</p>" },
  { id: "f3", board: "free", title: "친구랑 커플 열쇠고리 했어요", author: "단짝", date: "2026.09.14", views: 176, content: "<p>둘이 같이 흔들흔들.</p>" },
  { id: "f2", board: "free", title: "세종 셈틀 덮개 붙이는 팁", author: "손재주", date: "2026.09.08", views: 301, content: "<p>먼지를 먼저 닦고 천천히 붙이면 기포가 안 생겨요.</p>" },
  { id: "f1", board: "free", title: "첫 글은 제가 가져갑니다!", author: "일등", date: "2026.09.01", views: 410, content: "<p>훈민 게시판 첫 글!</p>" },
];

export const seedNoticeComments: NoticeCommentMap = {
  f12: [
    { id: "c1", author: "가나다라", date: "2026.10.19", text: "쉼표잔이라는 이름부터 너무 좋아요. 저도 하나 들여야겠어요!", replies: [
      { id: "c1r1", author: "세종덕후", date: "2026.10.19", text: "꼭 들이세요! 회의 시간이 덜 길게 느껴져요 ㅋㅋ" },
    ] },
    { id: "c2", author: "책상지기", date: "2026.10.19", text: "마우스패드도 들이시면 후기 꼭 남겨 주세요.", replies: [] },
    { id: "c3", author: "훈민상점", date: "2026.10.20", text: "예쁘게 써 주셔서 고마워요! 세종대왕님도 기뻐하실 거예요.", replies: [] },
  ],
  f11: [{ id: "c4", author: "한글사랑", date: "2026.10.18", text: "팀장님 반응 최고예요 ㅋㅋㅋ", replies: [] }],
  f10: [
    { id: "c5", author: "피식", date: "2026.10.17", text: "세종 책갈피 찬성이요!", replies: [] },
    { id: "c6", author: "집현전막내", date: "2026.10.18", text: "양말에 한 표 던집니다.", replies: [
      { id: "c6r1", author: "훈민상점", date: "2026.10.18", text: "메모해 둘게요!" },
    ] },
  ],
  n6: [{ id: "c7", author: "일등", date: "2026.10.20", text: "개장 축하드려요!", replies: [] }],
};
