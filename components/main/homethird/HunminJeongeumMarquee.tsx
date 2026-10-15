import HunminConsonantRow from "./HunminConsonantRow";
import HunminVowelRow from "./HunminVowelRow";
import "./homethird.css";

export default function HunminJeongeumMarquee() {
  return <section className="homethird-hunmin" aria-label="훈민정음 글자 모션">
    <h2>한 글자씩, 이어지는 우리말</h2>
    <HunminConsonantRow />
    <HunminVowelRow />
  </section>;
}
