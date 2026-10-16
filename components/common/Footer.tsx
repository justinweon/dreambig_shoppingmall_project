export default function Footer() {
  return (
    <footer className="bg-[#141414] px-6 pb-16 pt-5 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* 상점 이름과 소개 문구 */}
        <div className="flex flex-col gap-4 border-y border-white/10 py-10 sm:flex-row sm:items-center sm:gap-6">
          <a href="/" className="text-3xl">
            훈민상점
          </a>

          <span
            aria-hidden="true"
            className="hidden h-7 w-px bg-white/40 sm:block"
          />

          <p className="text-lg">
            백성을 위한 글자, 일상을 위한 물건
          </p>
        </div>

        {/* 이용 안내 */}
        <nav aria-label="하단 이용 안내" className="mt-7">
          <ul className="flex flex-wrap gap-x-4 gap-y-3 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-white">
                개인정보 처리방침
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                이용약관
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                배송 안내
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                교환 및 반품
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                자주 묻는 질문
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                도움마당
              </a>
            </li>
          </ul>
        </nav>

        {/* 저작권과 언어·통화 안내 */}
        <div className="mt-7 flex flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-white/70">
            &copy; 훈민상점. 모든 권리를 보유합니다.
          </p>

          <div className="flex gap-8 text-white/50">
            <p>언어 · 한국어</p>
            <p>통화 · 대한민국 원</p>
          </div>
        </div>
      </div>
    </footer>
  );
}