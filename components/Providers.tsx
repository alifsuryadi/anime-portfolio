"use client";

import { QualityProvider } from "./QualityProvider";
import { SmoothScroll } from "./SmoothScroll";
import { SceneMount } from "./SceneMount";
import { Konami } from "./Konami";
import { CursorFollower } from "./anim/CursorFollower";
import { SectionTransition } from "./anim/SectionTransition";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QualityProvider>
      <SmoothScroll />
      <SceneMount />
      <SectionTransition />
      <CursorFollower />
      <Konami />
      {children}
    </QualityProvider>
  );
}
