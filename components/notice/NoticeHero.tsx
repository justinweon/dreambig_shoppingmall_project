const HERO_JAMO = ["ㄱ", "ㅔ", "ㅅ", "ㅣ", "ㅍ", "ㅏ", "ㄴ"];
const VOWEL = /[ㅏ-ㅣ]/;

export default function NoticeHero() {
  return (
    <section className="bg-[#1a1a1a] px-6 py-14 text-white">
      <div className="mx-auto flex max-w-280 flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#cfcfcf]">도움마당</p>
          <h1 className="text-5xl font-extrabold leading-14 tracking-tight">훈민 게시판</h1>
          <p className="text-[15px] text-[#e6e6e6]">
            공지는 꼼꼼히, 수다는 가볍게. 오늘도 한 글자씩{" "}
            <span className="font-bold text-[#ffc21a]">이어 가요!</span>
          </p>
        </div>
        <div role="img" aria-label="게시판" className="flex gap-2">
          {HERO_JAMO.map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`inline-flex size-11 items-center justify-center rounded-[10px] bg-white text-[19px] font-extrabold ${
                VOWEL.test(ch) ? "text-[#a3302b]" : "text-[#1a1a1a]"
              }`}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
