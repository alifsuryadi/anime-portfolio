import { renderOg, ogSize } from "@/lib/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    title: "ALIF SURYADI",
    subtitle: profile.role,
    jp: "フルスタック開発者",
    kicker: "アリフ・スルヤディ · 東京の黄昏",
  });
}
