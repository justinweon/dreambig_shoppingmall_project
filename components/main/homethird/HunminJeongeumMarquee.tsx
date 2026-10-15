import HunminConsonantRow from "./HunminConsonantRow";
import HunminVowelRow from "./HunminVowelRow";
import "./homethird.css";

export default function HunminJeongeumMarquee({ title }: { title: string }) {
  return <section className="homethird-hunmin" aria-label="훈민정음 글자 모션">
    <h2>{title}</h2>
    <HunminConsonantRow />
    <HunminVowelRow />
  </section>;
}
