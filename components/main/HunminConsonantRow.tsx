import { hunminConsonants } from "@/util/data/hunmin";
import HunminLetterRow from "./HunminLetterRow";
export default function HunminConsonantRow() {
  return <HunminLetterRow letters={hunminConsonants} label="훈민정음 자음 줄" duration={48} variant="consonants" />;
}
