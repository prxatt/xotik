import {
  CylinderGeometry,
  LatheGeometry,
  TorusGeometry,
  Vector2,
  type BufferGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CAN_WRAP } from "@/components/three/createBrandLabelTexture";

/** Body lathe only — bare aluminum until wrap is applied. */
export function createSlimCanBodyGeometry(): BufferGeometry {
  const profile: Vector2[] = [];
  const push = (x: number, y: number) => profile.push(new Vector2(x, y));

  push(0, 0.58);
  push(0.19, 0.58);
  push(0.2, 0.568);
  push(0.21, 0.545);
  push(0.22, 0.52);
  push(0.248, 0.498);
  push(0.252, 0.46);
  push(0.254, -0.48);
  push(0.252, -0.54);
  push(0.248, -0.558);
  push(0.23, -0.568);
  push(0, -0.568);

  const body = new LatheGeometry(profile, 96);
  body.computeVertexNormals();
  body.computeBoundingSphere();
  body.computeBoundingBox();
  return body;
}

/** Lid / rim / foot — stay bare metal outside the printed wrap. */
export function createSlimCanHardwareGeometry(): BufferGeometry {
  const lid = new CylinderGeometry(0.195, 0.195, 0.02, 64);
  lid.translate(0, 0.588, 0);
  const rim = new TorusGeometry(0.2, 0.012, 10, 64);
  rim.rotateX(Math.PI / 2);
  rim.translate(0, 0.596, 0);
  const ring = new CylinderGeometry(0.226, 0.226, 0.014, 64);
  ring.translate(0, 0.55, 0);
  const score = new TorusGeometry(0.11, 0.003, 8, 40);
  score.rotateX(Math.PI / 2);
  score.translate(0, 0.599, 0);
  const rivet = new CylinderGeometry(0.022, 0.022, 0.01, 20);
  rivet.translate(0, 0.6, 0);
  const foot = new CylinderGeometry(0.248, 0.252, 0.02, 64);
  foot.translate(0, -0.55, 0);
  const base = new CylinderGeometry(0.24, 0.24, 0.016, 48);
  base.translate(0, -0.564, 0);

  const merged = mergeGeometries([lid, rim, ring, score, rivet, foot, base], false);
  lid.dispose();
  rim.dispose();
  ring.dispose();
  score.dispose();
  rivet.dispose();
  foot.dispose();
  base.dispose();
  merged.computeVertexNormals();
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}

/** Open cylinder sized to cover the full printed body (shoulder → foot). */
export function createFullCanWrapGeometry(): CylinderGeometry {
  return new CylinderGeometry(CAN_WRAP.radius, CAN_WRAP.radius, CAN_WRAP.height, 96, 1, true);
}

/** High-segment slim can — stand-in until the Blender Jeeru model. */
export function createSlimCanGeometry(): BufferGeometry {
  const body = createSlimCanBodyGeometry();
  const hardware = createSlimCanHardwareGeometry();
  const merged = mergeGeometries([body, hardware], false);
  body.dispose();
  hardware.dispose();
  merged.computeVertexNormals();
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}
