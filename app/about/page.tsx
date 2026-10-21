import Image from "next/image";
import kingSejong from "../../shared/asset/king_sejong.png";
import mousepadImg from "../../shared/asset/sejong_mouse_pad_1.png"; 
import mugImg from "../../shared/asset/sejong_mug_cup_1.png";
import keyringImg from "../../shared/asset/sejong_key_ring_1.png";

export default function AboutPage() {
    return (
      <main className="break-keep text-[#1a1a1a]">
      

            {/* Hero */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-8 py-[120px] lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-5">
            <p className="text-sm text-[#cfcfcf]">일상에 귀여운 딴지를 거는 방법</p>
            <h1 className="text-5xl font-black leading-tight lg:text-6xl">
              안녕하세요,
              <br />
              훈민상점<span className="text-[#ffc21a]">이에요!</span>
            </h1>
            <p className="text-lg leading-relaxed text-[#e6e6e6]">
              역사책 속 근엄하던 세종대왕님이 어쩌다 맥북을 던지는 밈의 주인공이 되셨을까요?
            </p>
            <p className="text-lg leading-relaxed text-[#e6e6e6]">
              시작은 AI가 아주 진지하게 들려준 황당한 이야기였어요. 그 엉뚱한 상상이 귀여운 세종이 되었고,
              이제는 슬금슬금 우리 일상에 끼어들고 있답니다.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-3xl bg-[#2a2a2a] lg:mt-11">
            <Image
              src={kingSejong}
              alt="맥북을 던지는 세종대왕"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Goods */}
      {/* <section className="mx-auto flex max-w-[1200px] flex-col gap-14 px-8 py-[120px]">
        <div className="text-center">
          <h2 className="text-4xl font-black">우리가 만드는 건 작은 즐거움이에요</h2>
          <p className="mt-4 text-lg text-[#555]">별일 없는 하루에도 피식 웃을 일 하나쯤은 꼭 있어야 하니까요.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["마우스패드", "하루 종일 책상 위에서 여러분을 빤히 지켜봐요." img: mousepadImg],
            ["머그컵", "커피보다 먼저 기분을 풀어 줘요."],
            ["키링", "가방 한구석에서 존재감을 뿜뿜해요."],
          ].map(([name, text]) => (
            <div key={name} className="rounded-[20px] border border-[#ededed] p-6 shadow-sm">
              <div className="aspect-[4/3] rounded-xl bg-[#f3f2ef]" />
              <h3 className="mt-4 text-xl font-bold">{name}</h3>
              <p className="mt-2 text-[#555]">{text}</p>
            </div>
          ))}
        </div> */}

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "마우스패드", text: "하루 종일 책상 위에서 여러분을 빤히 지켜봐요.", img: mousepadImg },
            { name: "머그컵", text: "커피보다 먼저 기분을 풀어 줘요.", img: mugImg },
            { name: "키링", text: "가방 한구석에서 존재감을 뿜뿜해요.", img: keyringImg },
          ].map(({ name, text, img }) => (
            <div key={name} className="rounded-[20px] border border-[#ededed] p-6 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f3f2ef]">
                <Image src={img} alt={name} fill className="object-cover" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{name}</h3>
              <p className="mt-2 text-[#555]">{text}</p>
            </div>
          ))}
        </div>

















        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-4 text-lg font-bold">
            <p className="rounded-[28px_28px_28px_6px] bg-[#1a1a1a] px-7 py-4 text-white">“그냥 귀여워서 샀어요!”</p>
            <p className="rounded-[28px_28px_6px_28px] bg-[#7ed957] px-7 py-4">“볼 때마다 기분 좋아요!”</p>
          </div>
          <p className="text-lg text-[#555]">그거면 충분하고도 남아요.</p>
        </div>
      {/* </section> */}

      {/* Story */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-8 py-28 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-3.5">
            <div className="rounded-[20px] bg-white p-6 text-[#1a1a1a]">
              <p className="text-sm font-bold text-[#a3302b]">AI 환각 현상 발견!</p>
              <p className="mt-3 text-2xl font-black">“세종대왕이 맥북을 던졌다”</p>
              <p className="mt-3 text-sm text-[#6b6b6b]">— AI가 아주 진지한 얼굴로</p>
            </div>
            <p className="self-end rounded-[20px_20px_6px_20px] bg-[#7ed957] px-5 py-3.5 font-bold text-[#1a1a1a]">
              ㅋㅋㅋ 이거 굿즈로 만들자
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-5">
            <h2 className="text-4xl font-black">이 엉뚱한 일을 벌인 사람</h2>
            <p className="text-lg leading-relaxed text-[#e6e6e6]">
              훈민샵은 정기의 머릿속에서 <strong className="text-[#ffc21a]">퐁!</strong> 하고 태어났어요.
            </p>
            <p className="text-lg leading-relaxed text-[#e6e6e6]">
              AI 수업에서 ‘AI 환각 현상’을 배우다 “세종대왕이 맥북을 던졌다”는 이야기를 마주쳤거든요. 보통은 한 번
              웃고 넘어갔겠지만, 저희는 조금 더 오래 웃기로 했어요.
            </p>
          </div>
        </div>
      </section>

      {/* Not too serious */}
      <section className="flex flex-col items-center gap-10 px-8 py-[120px] text-center">
        <div className="flex gap-3">
          {["ㅍ", "ㅣ", "ㅅ", "ㅣ", "ㄱ"].map((c, i) => (
            <div
              key={i}
              className={`flex size-16 items-center justify-center rounded-[14px] border border-[#ededed] text-3xl font-black shadow-sm ${
                c === "ㅣ" ? "text-[#a3302b]" : ""
              }`}
            >
              {c}
            </div>
          ))}
        </div>
        <h2 className="text-4xl font-black">오늘도 너무 진지하지 않기로 해요</h2>
        <p className="max-w-[640px] text-lg leading-loose text-[#555]">
          세상엔 진지한 일이 이미 차고 넘치잖아요. 좋아하는 것만큼은 가볍고 즐겁게 누려도 괜찮아요. 오늘 하루도 고생
          많으셨던 여러분께 말랑한 웃음 하나를 건네 드릴게요.
        </p>
      </section>

      {/* CTA */}
      <section className="px-8 pb-[120px]">
        <div className="mx-auto flex max-w-[1136px] flex-col items-center gap-5 rounded-[32px] bg-[#1a1a1a] px-8 py-20 text-center text-white">
          <h2 className="text-4xl font-black">우리 세종, 궁금하지 않으세요?</h2>
          <p className="text-lg leading-relaxed text-[#e6e6e6]">
            가방에 달아도, 책상에 올려 두어도, 그냥 보기만 해도 귀여워요.{" "}
            <span className="font-bold text-[#ffc21a]">(진짜예요!)</span>
            <br />
            오늘은 어떤 굿즈로 함께 웃어 볼까요?
          </p>
          <a href="/product" className="mt-4 rounded-full bg-[#7ed957] px-9 py-4 font-bold text-[#1a1a1a]">
            세종 만나러 가기 →
          </a>
        </div>
      </section>
    </main>
  );
}
