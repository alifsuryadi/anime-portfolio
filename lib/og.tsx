import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

type OgInput = { title: string; subtitle: string; jp: string; kicker?: string };

/** Anime key-visual style OG card. Font is a committed subset of Dela Gothic One (OFL). */
export async function renderOg({ title, subtitle, jp, kicker = "ALIF SURYADI" }: OgInput) {
  const font = await readFile(join(process.cwd(), "assets/dela-og.ttf"));
  const lines = Array.from({ length: 28 }, (_, i) => i);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #0B0B14 0%, #1A1033 50%, #5a1d4a 78%, #FF8A3D 100%)",
          color: "#F5EFE6",
          fontFamily: "Dela",
          overflow: "hidden",
        }}
      >
        {/* setting sun */}
        <div
          style={{
            position: "absolute",
            right: 120,
            bottom: -170,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "linear-gradient(180deg, #FF6FA5 0%, #FF8A3D 70%)",
            display: "flex",
          }}
        />
        {/* sun stripes */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 100,
              bottom: 40 + i * 44,
              width: 560,
              height: 8 + i * 3,
              background: "#2a1240",
              display: "flex",
            }}
          />
        ))}
        {/* speed lines */}
        {lines.map((i) => (
          <div
            key={`l${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: 22 * i + 4,
              width: 120 + ((i * 97) % 380),
              height: 2,
              background: "rgba(245,239,230,0.18)",
              display: "flex",
            }}
          />
        ))}
        {/* vertical jp */}
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 48,
            display: "flex",
            flexDirection: "column",
            fontSize: 54,
            lineHeight: 1.05,
            color: "#3BF4FB",
          }}
        >
          {Array.from(jp).map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", zIndex: 2 }}>
          <div style={{ fontSize: 26, color: "#FF6FA5", letterSpacing: 6 }}>{kicker}</div>
          <div style={{ fontSize: title.length > 18 ? 84 : 112, lineHeight: 0.95, marginTop: 24, maxWidth: 860 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, marginTop: 30, maxWidth: 780, color: "#F5EFE6" }}>{subtitle}</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Dela", data: font, style: "normal", weight: 400 }] },
  );
}
