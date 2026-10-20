"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { character } from "@/lib/scenes.config";
import { CharacterDriver } from "./choreo";
import { ChibiModel } from "./ChibiModel";
import { VrmModel } from "./VrmModel";

/** Uses the VRM from scenes.config.ts if it exists, else the procedural chibi. */
export function Character() {
  const driver = useMemo(() => new CharacterDriver(), []);
  const [vrm, setVrm] = useState<string | null>(null);

  useEffect(() => {
    const url = character.vrmUrl;
    if (!url) return;
    let alive = true;
    fetch(url, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive && r.ok && !type.includes("text/html")) setVrm(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!vrm) return <ChibiModel driver={driver} />;
  return (
    <Suspense fallback={<ChibiModel driver={driver} />}>
      <VrmModel url={vrm} driver={driver} />
    </Suspense>
  );
}
