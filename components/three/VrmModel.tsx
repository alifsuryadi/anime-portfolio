"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Object3D, Vector3, type WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { VRMLoaderPlugin, VRMUtils, type VRM, type VRMHumanBoneName } from "@pixiv/three-vrm";
import { character } from "@/lib/scenes.config";
import { pointerState } from "@/lib/scroll-state";
import { BONES, EXPRESSIONS, world, type CharacterDriver } from "./choreo";

let draco: DRACOLoader | null = null;
let ktx2: KTX2Loader | null = null;
const rendererRef: { current: WebGLRenderer | null } = { current: null };

/**
 * Registers the VRM plugin plus every compression format we support:
 * Draco / meshopt geometry and KTX2 (Basis) textures. Decoders are self-hosted
 * in /public (copied by scripts/copy-decoders.mjs on install).
 */
function extendLoader(loader: GLTFLoader) {
  draco ??= new DRACOLoader().setDecoderPath("/draco/");
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
  if (rendererRef.current) {
    ktx2 ??= new KTX2Loader().setTranscoderPath("/basis/").detectSupport(rendererRef.current);
    loader.setKTX2Loader(ktx2);
  }
  loader.register((parser) => new VRMLoaderPlugin(parser));
}

/** Warm the cache early (e.g. on hover of a CTA) without mounting the model. */
export const preloadVrm = (url: string) => useLoader.preload(GLTFLoader, url, extendLoader);

const lookTarget = new Object3D();
const tmp = new Vector3();

/** Loads a VRM (0.x or 1.0) and drives it from the shared CharacterDriver. */
export function VrmModel({ url, driver }: { url: string; driver: CharacterDriver }) {
  const gl = useThree((s) => s.gl);
  rendererRef.current = gl;
  const gltf = useLoader(GLTFLoader, url, extendLoader);
  const vrm = gltf.userData.vrm as VRM;

  useMemo(() => {
    VRMUtils.removeUnnecessaryVertices(gltf.scene);
    VRMUtils.combineSkeletons(gltf.scene);
    VRMUtils.rotateVRM0(vrm);
    vrm.scene.traverse((o) => (o.frustumCulled = false));
    if (vrm.lookAt) vrm.lookAt.target = lookTarget;
  }, [gltf, vrm]);

  useEffect(
    () => () => {
      VRMUtils.deepDispose(vrm.scene);
      useLoader.clear(GLTFLoader, url);
    },
    [vrm, url],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    driver.update(d, state.clock.elapsedTime);
    vrm.scene.position.copy(driver.position);
    vrm.scene.rotation.y = driver.rotationY;
    vrm.scene.scale.setScalar(driver.scale * character.vrmScale);

    const h = vrm.humanoid;
    for (const n of BONES) {
      h.getNormalizedBoneNode(n as VRMHumanBoneName)?.rotation.set(driver.bones[n][0], driver.bones[n][1], driver.bones[n][2]);
    }
    h.getNormalizedBoneNode("head")?.rotation.set(driver.head.x * 0.7, driver.head.y * 0.7, 0);
    h.getRawBoneNode("head")?.scale.setScalar(world.chibi ? 1.3 : 1);

    const em = vrm.expressionManager;
    if (em) {
      for (const e of EXPRESSIONS) em.setValue(e, driver.expressions[e]);
      em.setValue("blink", driver.expressions.blink);
    }

    // Eyes follow the cursor: a point just in front of the camera.
    tmp.set(pointerState.x, pointerState.y, 0.5).unproject(state.camera);
    lookTarget.position.copy(tmp);

    vrm.update(d);
  });

  return <primitive object={vrm.scene} />;
}
