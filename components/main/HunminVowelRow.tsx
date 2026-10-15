import { hunminVowels } from "@/util/data/hunmin";
import HunminLetterRow from "./HunminLetterRow";
export default function HunminVowelRow() {
  return <HunminLetterRow letters={hunminVowels} label="훈민정음 모음 줄" duration={34} variant="vowels" />;
}
