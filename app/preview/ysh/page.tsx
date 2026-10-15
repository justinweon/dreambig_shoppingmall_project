import type { Metadata } from "next";
import YshPreview from "@/components/ysh-preview/YshPreview";

export const metadata: Metadata = {
  title: "DreamBig 담당 영역 미리보기",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <YshPreview />;
}
