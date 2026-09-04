"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PointLight,
  RepeatWrapping,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  type BufferGeometry,
  type Texture,
} from "three";
import { createSlimCanGeometry, createFullCanWrapGeometry } from "@/components/three/SlimCan";
import { CAN_WRAP, createBrandLabelTexture, type CanLabelKind } from "@/components/three/createBrandLabelTexture";

const BRAND_LOGO_SRC = "/assets/reference/brand/xotik-logo.png";

/**
 * Full-height wrap geometry with per-instance reveal (0–1).
 * Fragment wipe shows top→bottom without Y-scale UV squash.
 */
function createWipeWrapGeometry(): BufferGeometry {
  const g = createFullCanWrapGeometry();
  g.setAttribute("aReveal", new InstancedBufferAttribute(new Float32Array(COUNT).fill(1), 1));
  return g;
}

function createWipeWrapMaterial(map: Texture | null): MeshStandardMaterial {
  const mat = new MeshStandardMaterial({
    map: map ?? undefined,
    metalness: 0.04,
    roughness: 0.42,
    envMapIntensity: 0.35,
    transparent: false,
    depthWrite: true,
    toneMapped: true,
  });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
attribute float aReveal;
varying float vReveal;
varying float vWrapV;`,
      )
      .replace(
        "#include <uv_vertex>",
        /* glsl */ `#include <uv_vertex>
vReveal = aReveal;
vWrapV = uv.y;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
varying float vReveal;
varying float vWrapV;`,
      )
      .replace(
        "#include <map_fragment>",
        /* glsl */ `#include <map_fragment>
// Top→bottom sleeve wipe — keep full UVs; discard unrevealed band.
if (vWrapV < 1.0 - vReveal) discard;`,
      );
  };
  mat.customProgramCacheKey = () => "factory-wrap-wipe-v1";
  return mat;
}

/** Local image load — no Suspense / CDN, so factory labels paint even offline. */
function useBrandLogoImage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const node = new Image();
    node.decoding = "async";
    node.onload = () => setImg(node);
    node.onerror = () => setImg(null);
    node.src = BRAND_LOGO_SRC;
  }, []);
  return img;
}

/** Carton side panel — full-field J by Jeeru branding (no empty kraft slabs). */
function createCartonBrandTexture(logo?: CanvasImageSource | null): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);

  // Jeeru field
  ctx.fillStyle = "#1a3a8f";
  ctx.fillRect(0, 0, 1024, 1024);

  // 蒲公英 / 躑躅 brand rails
  ctx.fillStyle = "#f5c518";
  ctx.fillRect(0, 0, 1024, 56);
  ctx.fillRect(0, 968, 1024, 56);
  ctx.fillStyle = "#ff4d8a";
  ctx.fillRect(0, 56, 1024, 12);
  ctx.fillRect(0, 956, 1024, 12);

  // Soft pattern — playful pop, not empty slab
  ctx.fillStyle = "rgba(245,197,24,0.12)";
  for (let y = 100; y < 920; y += 72) {
    for (let x = (y / 72) % 2 === 0 ? 40 : 76; x < 980; x += 72) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Giant J watermark
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.font = "900 520px Arial Black, Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("J", 512, 520);

  // Primary lockup
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 110px Arial Black, Impact, sans-serif";
  ctx.fillText("J BY JEERU", 512, 340);

  ctx.fillStyle = "#f5c518";
  ctx.font = "800 48px Arial Black, Impact, sans-serif";
  ctx.fillText("JEERU MASALA", 512, 430);

  ctx.fillStyle = "#ff4d8a";
  ctx.font = "700 36px Arial, Helvetica, sans-serif";
  ctx.fillText("POCKET-SIZED PRIDE", 512, 500);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "600 28px Arial, Helvetica, sans-serif";
  ctx.fillText("XOTIK FRUJUS · DESI POP · 3-PACK", 512, 570);

  // Lower brand strip
  ctx.fillStyle = "#0f2a6a";
  ctx.fillRect(80, 640, 864, 240);
  ctx.strokeStyle = "#f5c518";
  ctx.lineWidth = 6;
  ctx.strokeRect(80, 640, 864, 240);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px Arial Black, Impact, sans-serif";
  ctx.fillText("JEERU", 512, 720);
  ctx.fillStyle = "#f5c518";
  ctx.font = "700 32px Arial, Helvetica, sans-serif";
  ctx.fillText("MASALA FIZZ · VERY J", 512, 790);
  ctx.fillStyle = "#ff4d8a";
  ctx.font = "700 26px Arial, Helvetica, sans-serif";
  ctx.fillText("DRINK IT BEFORE IT'S COOL", 512, 850);

  if (logo) {
    try {
      ctx.drawImage(logo, 48, 90, 120, 76);
      ctx.drawImage(logo, 856, 90, 120, 76);
      ctx.drawImage(logo, 120, 700, 100, 64);
      ctx.drawImage(logo, 804, 700, 100, 64);
    } catch {
      /* ignore */
    }
  } else {
    ctx.fillStyle = "#f5c518";
    ctx.font = "900 56px Arial Black, sans-serif";
    ctx.fillText("J", 90, 140);
    ctx.fillText("J", 934, 140);
  }

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Packaging tape — J by Jeeru brand strip for the sealed 3-pack. */
function createJeeruTapeTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);

  ctx.fillStyle = "#1a3a8f";
  ctx.fillRect(0, 0, 1024, 128);
  ctx.fillStyle = "#f5c518";
  ctx.fillRect(0, 0, 1024, 14);
  ctx.fillRect(0, 114, 1024, 14);
  ctx.fillStyle = "#ff4d8a";
  ctx.fillRect(0, 14, 1024, 6);
  ctx.fillRect(0, 108, 1024, 6);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 42px Arial Black, Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let x = 128; x < 1024; x += 256) {
    ctx.fillText("J BY JEERU", x, 64);
  }
  ctx.fillStyle = "#f5c518";
  ctx.font = "700 18px Arial, Helvetica, sans-serif";
  for (let x = 128; x < 1024; x += 256) {
    ctx.fillText("3-PACK · XOTIK", x, 92);
  }

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.repeat.set(1.5, 1);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Off-camera enter / exit — recycle never happens in the visible span. */
const ENTER_X = -11.2;
const EXIT_X = 11.2;
const TRACK = EXIT_X - ENTER_X;
const BAY_X = 0;
const COUNT = 9;
const SPACING = TRACK / COUNT;
const CRUISE_SPEED = 0.7;
/** Two stamp hits + procedural wrap inside one bay pause. */
const DWELL_SEC = 1.35;
/** After labeled stamp/label: exit gate open, then this beat before the can leaves. */
const CLAMP_HOLD_SEC = 0.48;
/** How far upstream (−X) a can starts opening the clamp (earlier = can clears the jaws). */
const CLAMP_APPROACH_X = -2.65;
/** Nudge past bay on release so the same can never re-triggers. */
const BAY_CLEAR = 0.28;

/** Factory camera — labels yaw so brand art faces this lens. */
const FACTORY_CAM = { x: 5.9, y: 2.55, z: 7.1 };

const BELT_TOP = 0.25;
const CAN_BOTTOM_LOCAL = -0.574;
const CAN_Y = BELT_TOP - CAN_BOTTOM_LOCAL + 0.04;
const ENTER_SETTLE = 1.05;

/** SlimCan lid top (rivet/score) in local can space. */
const CAN_LID_LOCAL = 0.605;
/**
 * Stamp group Y when pressed: gold-ring underside lands on the lid.
 * Ring center local Y=0.048, tube r=0.028 → contact at 0.02.
 * Tiny negative bias so the seal reads as touching, not hovering.
 */
const STAMP_CONTACT_LOCAL = 0.02;
const STAMP_PRESS_Y = CAN_Y + CAN_LID_LOCAL - STAMP_CONTACT_LOCAL - 0.008;
const STAMP_DOWN_Y = STAMP_PRESS_Y + 0.028;
const STAMP_UP_Y = STAMP_PRESS_Y + 0.42;

const LABEL_KINDS: CanLabelKind[] = ["jeeru", "cola", "lemon"];
const RIM_HIGH = 0.61;
const RIM_FINAL = 0.598;

/** Factory bay — 青磁/若竹/蜜柑/珊瑚 on 茄子紺. Not hero blue/yellow. */
const FX = {
  nasu: "#140c22",
  seiji: "#1e4a42",
  wakatake: "#3ddb8a",
  byakugun: "#7ad4c0",
  mikan: "#ff8a1f",
  sango: "#ff5c6a",
  kinari: "#fff6e8",
  wallDeep: "#122820",
  wallMid: "#1a3d34",
  column: "#243830",
} as const;

/** Phase 5/6 — 3-pack kraft carton (three cans in a row along the belt). */
const CAN_R = 0.255;
const CAN_HALF_H = 0.58;
const PACK_CAPACITY = 3;
const CAN_PITCH = CAN_R * 2 + 0.06;
/** Inner cavity fits three upright cans along X. */
const BOX_INNER_W = CAN_PITCH * PACK_CAPACITY + 0.08; // ≈ 1.76
const BOX_INNER_D = CAN_R * 2 + 0.14; // ≈ 0.65
const BOX_INNER_H = CAN_HALF_H * 2 + 0.14; // ≈ 1.3
const BOX_WALL = 0.034;
const BOX_OUTER_W = BOX_INNER_W + BOX_WALL * 2;
const BOX_OUTER_D = BOX_INNER_D + BOX_WALL * 2;

/** Pack station at the far right end of the line — belt continues past it. */
const CARTON_X = 8.35;
/** Beside the tread end (camera side) — close to the line, not a floating second lane. */
const CARTON_Z = 1.52;
const CARTON_BASE_Y = 0.28;
const PACK_GATE_X = 7.75;
/** Align / pad stop between belt rail and carton mouth. */
const ALIGN_X = CARTON_X;
const ALIGN_Z = 1.05;
const ALIGN_DUR = 0.7;
const ALIGN_HOLD = 0.18;
const JUMP_DUR = 0.82;
const CLOSE_DUR = 0.75;
const TAPE_DUR = 0.55;
const SEALED_HOLD = 2.4;
/** Flaps must be essentially shut before tape starts. */
const TAPE_AFTER_CLOSE = 0.98;
const PUSHER_IDLE_Z = 0.78;
const BOX_FLOOR_Y = CARTON_BASE_Y + 0.02;
const BOX_CAN_Y = BOX_FLOOR_Y + -CAN_BOTTOM_LOCAL;
/** Top of open rim — flip stays above this until drop-in. */
const BOX_RIM_Y = CARTON_BASE_Y + BOX_INNER_H;
/** Line-pan distance so the end-of-line carton frames with belt still continuing past. */
const LINE_PAN_X = 8.0;

function packSlotX(slot: number): number {
  return CARTON_X + (slot - (PACK_CAPACITY - 1) / 2) * CAN_PITCH;
}

type PackPhase = 0 | 1 | 2 | 3 | 4;
// 0 belt · 1 divert · 2 hold on pad · 3 flip-jump enter · 4 settled in case

type SolidAabb = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number };

/** Every can gets a full wrap (jeeru / cola / lemon cycle). */
function canFlavorKind(n: number): number {
  return n % 3;
}

/**
 * Carton fill rule — always a complete set:
 * - mono: three of the same flavor
 * - mixed: one of each flavor (never 2+1)
 */
type PackFillMode = "mono" | "mixed";

/** Yaw so wrap art (local −X / u=0.5) faces the factory viewport. */
function labelFaceYaw(x: number, z: number): number {
  return Math.atan2(FACTORY_CAM.z - z, x - FACTORY_CAM.x);
}

function rotXLocal(lx: number, ly: number, lz: number, rx: number) {
  const c = Math.cos(rx);
  const s = Math.sin(rx);
  return { x: lx, y: ly * c - lz * s, z: ly * s + lz * c };
}

/** Sample points along can axis for collision (bottom / mid / top). */
const CAN_SAMPLES: [number, number, number][] = [
  [0, -CAN_HALF_H + 0.06, 0],
  [0, 0, 0],
  [0, CAN_HALF_H - 0.06, 0],
];

function pushSphereFromAabb(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  s: SolidAabb,
): { dx: number; dy: number; dz: number } | null {
  const inside =
    cx >= s.x0 && cx <= s.x1 && cy >= s.y0 && cy <= s.y1 && cz >= s.z0 && cz <= s.z1;
  if (inside) {
    const px0 = cx - s.x0;
    const px1 = s.x1 - cx;
    const py0 = cy - s.y0;
    const py1 = s.y1 - cy;
    const pz0 = cz - s.z0;
    const pz1 = s.z1 - cz;
    const m = Math.min(px0, px1, py0, py1, pz0, pz1);
    if (m === px0) return { dx: -(px0 + r), dy: 0, dz: 0 };
    if (m === px1) return { dx: px1 + r, dy: 0, dz: 0 };
    if (m === py0) return { dx: 0, dy: -(py0 + r), dz: 0 };
    if (m === py1) return { dx: 0, dy: py1 + r, dz: 0 };
    if (m === pz0) return { dx: 0, dy: 0, dz: -(pz0 + r) };
    return { dx: 0, dy: 0, dz: pz1 + r };
  }
  const qx = Math.min(s.x1, Math.max(s.x0, cx));
  const qy = Math.min(s.y1, Math.max(s.y0, cy));
  const qz = Math.min(s.z1, Math.max(s.z0, cz));
  const dx = cx - qx;
  const dy = cy - qy;
  const dz = cz - qz;
  const d2 = dx * dx + dy * dy + dz * dz;
  if (d2 >= r * r || d2 < 1e-10) return null;
  const d = Math.sqrt(d2);
  const pen = r - d;
  return { dx: (dx / d) * pen, dy: (dy / d) * pen, dz: (dz / d) * pen };
}

/** Kinematic resolve — keeps flip choreography but never penetrates solids. */
function resolveCanPose(
  x: number,
  y: number,
  z: number,
  rotX: number,
  solids: SolidAabb[],
  radius = CAN_R * 0.92,
): { x: number; y: number; z: number } {
  let px = x;
  let py = y;
  let pz = z;
  for (let iter = 0; iter < 5; iter += 1) {
    let moved = false;
    for (const [lx, ly, lz] of CAN_SAMPLES) {
      const w = rotXLocal(lx, ly, lz, rotX);
      const sx = px + w.x;
      const sy = py + w.y;
      const sz = pz + w.z;
      for (const solid of solids) {
        const hit = pushSphereFromAabb(sx, sy, sz, radius, solid);
        if (!hit) continue;
        px += hit.dx;
        py += hit.dy;
        pz += hit.dz;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return { x: px, y: py, z: pz };
}

function buildPackSolids(
  padZ: number,
  opts: { includePad?: boolean; includeFloor?: boolean; includeBeltWall?: boolean } = {},
): SolidAabb[] {
  const { includePad = true, includeFloor = true, includeBeltWall = true } = opts;
  const hx = BOX_OUTER_W * 0.5;
  const hz = BOX_OUTER_D * 0.5;
  const wall = BOX_WALL;
  const y0 = CARTON_BASE_Y;
  const y1 = BOX_RIM_Y;
  const solids: SolidAabb[] = [
    // Front belt rail (camera-side) — divert must clear this
    { x0: CARTON_X - 1.2, x1: CARTON_X + 1.2, y0: 0.18, y1: 0.42, z0: 0.63, z1: 0.7 },
    // Transfer deck
    {
      x0: CARTON_X - BOX_OUTER_W * 0.55,
      x1: CARTON_X + BOX_OUTER_W * 0.55,
      y0: BELT_TOP - 0.05,
      y1: BELT_TOP + 0.02,
      z0: 0.55,
      z1: ALIGN_Z + 0.35,
    },
    // Carton back wall
    {
      x0: CARTON_X - hx,
      x1: CARTON_X + hx,
      y0,
      y1,
      z0: CARTON_Z + hz - wall,
      z1: CARTON_Z + hz,
    },
    // Carton left / right walls
    {
      x0: CARTON_X - hx,
      x1: CARTON_X - hx + wall,
      y0,
      y1,
      z0: CARTON_Z - hz,
      z1: CARTON_Z + hz,
    },
    {
      x0: CARTON_X + hx - wall,
      x1: CARTON_X + hx,
      y0,
      y1,
      z0: CARTON_Z - hz,
      z1: CARTON_Z + hz,
    },
  ];
  if (includeBeltWall) {
    solids.push({
      x0: CARTON_X - hx,
      x1: CARTON_X + hx,
      y0,
      y1,
      z0: CARTON_Z - hz,
      z1: CARTON_Z - hz + wall,
    });
  }
  if (includePad) {
    solids.push({
      x0: CARTON_X - 0.48,
      x1: CARTON_X + 0.48,
      y0: BELT_TOP + 0.05,
      y1: BELT_TOP + 0.22,
      z0: padZ - 0.14,
      z1: padZ + 0.14,
    });
  }
  if (includeFloor) {
    solids.push({
      x0: CARTON_X - BOX_INNER_W * 0.5,
      x1: CARTON_X + BOX_INNER_W * 0.5,
      y0: BOX_FLOOR_Y - 0.04,
      y1: BOX_FLOOR_Y,
      z0: CARTON_Z - BOX_INNER_D * 0.5,
      z1: CARTON_Z + BOX_INNER_D * 0.5,
    });
  }
  return solids;
}

const dummy = new Object3D();
const aluminumA = new Color("#d7dde3");
const aluminumB = new Color("#c5ccd3");
const sealedTint = new Color("#eef2f6");
const goldSeal = new Color("#e0b35a");

function wrapAlongBelt(s: number): number {
  const u = ((s % TRACK) + TRACK) % TRACK;
  return ENTER_X + u;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function seatY(x: number): number {
  const settle = smoothstep(ENTER_X, ENTER_X + ENTER_SETTLE, x);
  return CAN_Y + (1 - settle) * 0.04;
}

function seatScale(x: number): number {
  const settleIn = smoothstep(ENTER_X, ENTER_X + ENTER_SETTLE, x);
  const settleOut = 1 - smoothstep(EXIT_X - ENTER_SETTLE, EXIT_X, x);
  return 0.98 + Math.min(settleIn, settleOut) * 0.02;
}

/** Dual-hit stamp: down-press-up, brief clear, down-press-up. */
function stampYAt(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  const stroke = (local: number) => {
    if (local < 0.28) return STAMP_UP_Y + (STAMP_DOWN_Y - STAMP_UP_Y) * smoothstep(0, 0.28, local);
    if (local < 0.4) return STAMP_DOWN_Y + (STAMP_PRESS_Y - STAMP_DOWN_Y) * smoothstep(0.28, 0.4, local);
    if (local < 0.62) return STAMP_PRESS_Y;
    return STAMP_PRESS_Y + (STAMP_UP_Y - STAMP_PRESS_Y) * smoothstep(0.62, 1, local);
  };
  if (p < 0.46) return stroke(p / 0.46);
  if (p < 0.52) return STAMP_UP_Y;
  return stroke((p - 0.52) / 0.48);
}

const BELT_LEN = 24;
const BELT_TEX_REPEAT = 24;
/** UV scroll matched to world cruise so tread moves with the cans. */
const BELT_UV_PER_WORLD = BELT_TEX_REPEAT / BELT_LEN;

function createBeltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // High-contrast cleats so motion reads at the bottom of frame.
  ctx.fillStyle = "#3a4148";
  ctx.fillRect(0, 0, 512, 128);
  for (let x = 0; x < 512; x += 36) {
    ctx.fillStyle = "#6e7882";
    ctx.fillRect(x, 6, 22, 116);
    ctx.fillStyle = "#9aa4ae";
    ctx.fillRect(x + 22, 6, 5, 116);
    ctx.fillStyle = "#2a3036";
    ctx.fillRect(x + 27, 6, 9, 116);
  }
  // Center lane paint — bright so you see it crawl
  ctx.fillStyle = "#e8c45a";
  ctx.fillRect(0, 52, 512, 5);
  ctx.fillStyle = "#f0d78a";
  ctx.fillRect(0, 70, 512, 3);
  // Edge rails
  ctx.fillStyle = "#1a1e22";
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillRect(0, 118, 512, 10);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(BELT_TEX_REPEAT, 1);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createRollerTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#3e464c";
  ctx.fillRect(0, 0, 128, 64);
  for (let y = 0; y < 64; y += 10) {
    ctx.fillStyle = y % 20 === 0 ? "#8a949c" : "#2a3036";
    ctx.fillRect(0, y, 128, 5);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(1, 4);
  tex.needsUpdate = true;
  return tex;
}

function StampHead({
  dwellProgress,
  sealing,
}: {
  dwellProgress: MutableRefObject<number>;
  sealing: MutableRefObject<boolean>;
}) {
  const group = useRef<Group>(null);
  useFrame(() => {
    const node = group.current;
    if (!node) return;
    node.position.y = sealing.current ? stampYAt(dwellProgress.current) : STAMP_UP_Y;
  });

  return (
    <group ref={group} position={[0, STAMP_UP_Y, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.11, 28]} />
        <meshStandardMaterial color="#c45a2c" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.06, 28]} />
        <meshStandardMaterial color="#a84822" metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.1, 0.11, 0.06, 28]} />
        <meshStandardMaterial color="#8a9298" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.07, 0.115, 0.42, 28]} />
        <meshStandardMaterial color="#5e676e" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 32]} />
        <meshStandardMaterial color="#c4a574" metalness={0.92} roughness={0.16} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.048, 0]}>
        <torusGeometry args={[0.215, 0.028, 12, 48]} />
        <meshStandardMaterial color="#c4a574" metalness={0.94} roughness={0.14} />
      </mesh>
    </group>
  );
}

/**
 * Label applicator — boom supports a wrap ring; pads live ON the ring only
 * (no diameter bar through the can). Ring orbits 720° while riding top→bottom
 * in sync with the procedural label reveal.
 */
const LABEL_CLAMP_Y = CAN_Y + 0.02;
const CLAMP_CLOSED_X = 0.34;
/** Wide travel so enter/exit reads clearly. */
const CLAMP_OPEN_X = 1.22;
const CLAMP_EXIT_OPEN = 1;
/** Fast open + close — no sluggish lag. */
const CLAMP_GATE_LERP = 14;
/** Ring just outside the can body — pads mount on this torus. */
const CLAMP_RING_R = CAN_WRAP.radius + 0.07;
/** Two full turns while the wrap walks lid → foot. */
const CLAMP_ORBIT_TURNS = 2;
/** Outer face of closed entry pad — cans must clear this while gates are shut. */
const CLAMP_GATE_PLANE = -(CLAMP_CLOSED_X - 0.02);

function LabelApplicatorClamp({
  dwellProgress,
  sealing,
  labeling,
  holding,
  gateOpen,
  labelApply,
}: {
  dwellProgress: MutableRefObject<number>;
  sealing: MutableRefObject<boolean>;
  labeling: MutableRefObject<boolean>;
  holding: MutableRefObject<boolean>;
  /** Reserved — bay approach still written by LineRig for future gate cueing. */
  approach: MutableRefObject<number>;
  /** 0–1 shared with LineRig for gate collision. */
  gateOpen: MutableRefObject<number>;
  /** 0–1 wrap apply (top→bottom) for the can in the bay. */
  labelApply: MutableRefObject<number>;
}) {
  const carriage = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const padA = useRef<Group>(null);
  const padB = useRef<Group>(null);
  const roller = useRef<Group>(null);
  const jawEntry = useRef<Group>(null);
  const jawExit = useRef<Group>(null);
  const entryOpen = useRef(1);
  const exitOpen = useRef(1);
  const applySmooth = useRef(0);

  useFrame((_, delta) => {
    const step = Math.min(Math.max(delta, 0), 1 / 30);
    const active = sealing.current && labeling.current;
    const hold = holding.current;
    const d = dwellProgress.current;

    let entryTarget = 1;
    let exitTarget = 1;
    let applyTarget = 0;

    if (hold) {
      entryTarget = 0;
      exitTarget = CLAMP_EXIT_OPEN;
      applyTarget = 1;
    } else if (active) {
      // Short open seat → snappy close → wrap orbit → snappy exit open
      if (d < 0.14) {
        entryTarget = 1;
        exitTarget = 1;
      } else if (d < 0.26) {
        const close = 1 - smoothstep(0.14, 0.26, d);
        entryTarget = close;
        exitTarget = close;
      } else if (d < 0.74) {
        entryTarget = 0;
        exitTarget = 0;
        applyTarget = smoothstep(0.28, 0.72, d);
      } else {
        entryTarget = 0;
        exitTarget = smoothstep(0.74, 0.86, d);
        applyTarget = 1;
      }
    } else {
      entryTarget = 1;
      exitTarget = 1;
    }

    entryOpen.current += (entryTarget - entryOpen.current) * Math.min(1, step * CLAMP_GATE_LERP);
    exitOpen.current += (exitTarget - exitOpen.current) * Math.min(1, step * CLAMP_GATE_LERP);

    applySmooth.current += (applyTarget - applySmooth.current) * Math.min(1, step * 10);
    const apply = applySmooth.current;
    labelApply.current = apply;
    gateOpen.current = Math.min(entryOpen.current, exitOpen.current);

    const entryX = CLAMP_CLOSED_X + (CLAMP_OPEN_X - CLAMP_CLOSED_X) * entryOpen.current;
    const exitX = CLAMP_CLOSED_X + (CLAMP_OPEN_X - CLAMP_CLOSED_X) * exitOpen.current;
    if (jawEntry.current) jawEntry.current.position.x = -entryX;
    if (jawExit.current) jawExit.current.position.x = exitX;

    // Carriage rides lid→foot; inner ring orbits exactly 720° with the reveal.
    const topY = CAN_WRAP.height * 0.42;
    const botY = -CAN_WRAP.height * 0.42;
    const ringY = apply < 0.01 ? topY : topY + (botY - topY) * apply;
    const orbit = apply * Math.PI * 2 * CLAMP_ORBIT_TURNS;
    if (carriage.current) carriage.current.position.y = ringY;
    if (spin.current) spin.current.rotation.y = orbit;
    if (padA.current) padA.current.rotation.z = orbit * 1.2;
    if (padB.current) padB.current.rotation.z = -orbit * 1.2;
    if (roller.current) roller.current.rotation.x = orbit * 3;
  });

  const padInset = 0.028;
  const railZ = -(CLAMP_RING_R + 0.05);
  const wrapHalf = CAN_WRAP.height * 0.55;

  return (
    <group position={[0, LABEL_CLAMP_Y, 0]}>
      {/* Mast + boom from the back rail — stays behind the can */}
      <mesh position={[0, 0.55, -0.88]} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 1.15, 16]} />
        <meshStandardMaterial color="#2f363c" metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, -0.88]} castShadow>
        <boxGeometry args={[0.22, 0.09, 0.22]} />
        <meshStandardMaterial color="#4a5258" metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.06, -0.7]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.4]} />
        <meshStandardMaterial color="#3a424a" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Vertical slide rail behind the ring — no bar through the can */}
      <mesh position={[0, 0, railZ]} castShadow>
        <boxGeometry args={[0.055, wrapHalf * 2, 0.055]} />
        <meshStandardMaterial color="#4a5258" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Side gates — short rear brackets; never cross the can axis */}
      <group ref={jawEntry} position={[-CLAMP_OPEN_X, 0, 0]}>
        <mesh position={[0.02, 0, -0.22]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.36]} />
          <meshStandardMaterial color="#3a424a" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.1]} />
          <meshStandardMaterial color="#5e676e" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#c4a574" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>
      <group ref={jawExit} position={[CLAMP_OPEN_X, 0, 0]}>
        <mesh position={[-0.02, 0, -0.22]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.36]} />
          <meshStandardMaterial color="#3a424a" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.1]} />
          <meshStandardMaterial color="#5e676e" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[-0.01, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#c4a574" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>

      {/* Carriage slides on rear rail; pads/roller orbit on the ring */}
      <group ref={carriage} position={[0, CAN_WRAP.height * 0.42, 0]}>
        <mesh position={[0, 0, railZ]} castShadow>
          <boxGeometry args={[0.1, 0.09, 0.1]} />
          <meshStandardMaterial color="#5e676e" metalness={0.78} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, (railZ - CLAMP_RING_R) * 0.5]} castShadow>
          <boxGeometry args={[0.045, 0.045, Math.abs(railZ + CLAMP_RING_R)]} />
          <meshStandardMaterial color="#3a424a" metalness={0.7} roughness={0.35} />
        </mesh>

        <group ref={spin}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[CLAMP_RING_R, 0.016, 10, 56]} />
            <meshStandardMaterial color="#6a737a" metalness={0.8} roughness={0.28} />
          </mesh>

          {/* Copper pad @ +X — mounted on ring only */}
          <group ref={padA} position={[CLAMP_RING_R, 0, 0]}>
            <mesh position={[-(padInset + 0.01), 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.045, 20]} />
              <meshStandardMaterial color="#c4a574" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0.02, 0, 0]} castShadow>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="#5e676e" metalness={0.75} roughness={0.3} />
            </mesh>
          </group>

          {/* Copper pad @ −X */}
          <group ref={padB} position={[-CLAMP_RING_R, 0, 0]}>
            <mesh position={[padInset + 0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.045, 20]} />
              <meshStandardMaterial color="#c4a574" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[-0.02, 0, 0]} castShadow>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="#5e676e" metalness={0.75} roughness={0.3} />
            </mesh>
          </group>

          {/* Yellow roller @ +Z */}
          <group ref={roller} position={[0, 0, CLAMP_RING_R]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 20]} />
              <meshStandardMaterial color="#e8c57a" metalness={0.55} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.04]} castShadow>
              <boxGeometry args={[0.045, 0.045, 0.04]} />
              <meshStandardMaterial color="#4a5258" metalness={0.7} roughness={0.32} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}


/** Phase 4 kitbash — legs on the BACK rail only (camera side stays open). */
function KitbashFillerBay() {
  // Moving tread: z ∈ [-0.64, 0.64]. Fixed side rails at z=±0.66.
  // Front legs (+z) sit between camera and cans and block the view — use back rail only.
  const RAIL_Z = -0.66;
  const LEG_HALF = 0.075;
  // Outer face of back rail; foot must stay entirely z ≤ -0.64 (off the tread).
  const LEG_Z = RAIL_Z - 0.02 - LEG_HALF; // ≈ -0.755
  // Chassis top ≈ 0.21 — foot sits on it; post overlaps foot so no floating gap.
  const FOOT_Y = 0.175;
  const LEG_BOT = 0.14;
  const LEG_TOP = 2.89;
  const LEG_H = LEG_TOP - LEG_BOT;
  const LEG_CY = (LEG_TOP + LEG_BOT) * 0.5;

  const leg = (x: number) => (
    <group key={`leg-${x}`}>
      <mesh position={[x, FOOT_Y, LEG_Z]} castShadow>
        <boxGeometry args={[0.3, 0.09, 0.24]} />
        <meshStandardMaterial color="#2a3036" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[x, LEG_CY, LEG_Z]} castShadow>
        <boxGeometry args={[LEG_HALF * 2, LEG_H, LEG_HALF * 2]} />
        <meshStandardMaterial color="#2f363c" metalness={0.65} roughness={0.4} />
      </mesh>
      {/* Clamp hugging the back rail from outside */}
      <mesh position={[x, 0.3, RAIL_Z - 0.02]} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.06]} />
        <meshStandardMaterial color="#4a5258" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );

  return (
    <group>
      <mesh position={[0, 2.95, -0.15]}>
        <boxGeometry args={[2.6, 0.12, 1.35]} />
        <meshStandardMaterial color="#3a424a" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Side legs only — center post removed (blocked stamp view) */}
      {leg(-1.15)}
      {leg(1.15)}

      <mesh position={[0, 2.45, -0.9]}>
        <boxGeometry args={[1.8, 0.4, 0.32]} />
        <meshStandardMaterial color="#4a545c" metalness={0.6} roughness={0.38} />
      </mesh>
      {/* Horizontal arm centered over stamp axis (x=0) */}
      <mesh position={[0.35, 2.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 20]} />
        <meshStandardMaterial color="#6a737a" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Fixed guide collar on gantry — stamp slides on the same axis */}
      <mesh position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
        <meshStandardMaterial color="#4a5258" metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh position={[0, 2.48, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.12, 24]} />
        <meshStandardMaterial color="#2f363c" metalness={0.65} roughness={0.4} />
      </mesh>

      {[-0.7, 0.7].map((x) => (
        <group key={`bulb-${x}`} position={[x, 2.78, 0.35]}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#ffc58a"
              emissive="#ff9a4a"
              emissiveIntensity={2.4}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
          <pointLight intensity={2.4} color="#ffb070" distance={5} />
        </group>
      ))}
    </group>
  );
}

/**
 * Phase 5b — transfer channel + pusher that travels far out toward the sleeve.
 */
function PackGuideRails({ pusherZ }: { pusherZ: MutableRefObject<number> }) {
  const pad = useRef<Group>(null);
  useFrame(() => {
    if (pad.current) pad.current.position.z = pusherZ.current;
  });

  const deckZ0 = 0.58;
  const deckZ1 = ALIGN_Z + 0.2;
  const deckMid = (deckZ0 + deckZ1) * 0.5;
  const deckLen = deckZ1 - deckZ0;
  const guideX = BOX_OUTER_W * 0.5 + 0.06;

  return (
    <group>
      {/* Transfer deck — belt edge out to the pad stop */}
      <mesh position={[CARTON_X, BELT_TOP - 0.02, deckMid]} receiveShadow>
        <boxGeometry args={[BOX_OUTER_W + 0.2, 0.05, deckLen]} />
        <meshStandardMaterial color="#4a5258" metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[CARTON_X - guideX, BELT_TOP + 0.08, deckMid]}>
        <boxGeometry args={[0.05, 0.12, deckLen]} />
        <meshStandardMaterial color="#6a737a" metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh position={[CARTON_X + guideX, BELT_TOP + 0.08, deckMid]}>
        <boxGeometry args={[0.05, 0.12, deckLen]} />
        <meshStandardMaterial color="#6a737a" metalness={0.7} roughness={0.32} />
      </mesh>
      {/* Large pusher pad — rides far out with the diverting can */}
      <group ref={pad} position={[CARTON_X, BELT_TOP + 0.14, PUSHER_IDLE_Z]}>
        <mesh>
          <boxGeometry args={[BOX_OUTER_W * 0.95, 0.14, 0.28]} />
          <meshStandardMaterial color="#c4a574" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.14, -0.18]}>
          <boxGeometry args={[0.16, 0.38, 0.16]} />
          <meshStandardMaterial color="#8a9298" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.34, -0.18]}>
          <boxGeometry args={[BOX_OUTER_W * 0.7, 0.07, 0.12]} />
          <meshStandardMaterial color="#6a737a" metalness={0.75} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3-pack kraft carton — one solid shell; brand as inset panels (no corner fight).
 * Flaps auto-close after 3 cans seat; tape only once flaps are shut.
 */
function OpenCartonCase({
  brandMap,
  tapeMap,
  closeProgress,
  tapeProgress,
}: {
  brandMap: CanvasTexture | null;
  tapeMap: CanvasTexture | null;
  closeProgress: MutableRefObject<number>;
  tapeProgress: MutableRefObject<number>;
}) {
  const flapBack = useRef<Group>(null);
  const flapFront = useRef<Group>(null);
  const flapLeft = useRef<Group>(null);
  const flapRight = useRef<Group>(null);
  const tape = useRef<Mesh>(null);

  useFrame(() => {
    const c = Math.min(1, Math.max(0, closeProgress.current));
    const e = smoothstep(0, 1, c);
    if (flapBack.current) flapBack.current.rotation.x = -0.95 * (1 - e);
    if (flapFront.current) flapFront.current.rotation.x = 1.15 * (1 - e);
    if (flapLeft.current) flapLeft.current.rotation.z = -1.05 * (1 - e);
    if (flapRight.current) flapRight.current.rotation.z = 1.05 * (1 - e);

    // Never show tape until flaps are closed.
    const t = c >= TAPE_AFTER_CLOSE ? Math.min(1, Math.max(0, tapeProgress.current)) : 0;
    if (tape.current) {
      const span = smoothstep(0, 1, t);
      tape.current.scale.x = Math.max(0.02, span);
      tape.current.position.x = (-BOX_OUTER_W * 0.5 + BOX_WALL) * (1 - span);
      tape.current.visible = t > 0.02;
      const mat = tape.current.material as MeshStandardMaterial;
      mat.opacity = 0.15 + span * 0.85;
    }
  });

  const board = "#c4a574";
  const boardDark = "#9a7a45";
  const boardIn = "#6b4f2e";
  const base: [number, number, number] = [CARTON_X, CARTON_BASE_Y, CARTON_Z];
  const outerW = BOX_OUTER_W;
  const outerD = BOX_OUTER_D;
  const innerW = BOX_INNER_W;
  const innerD = BOX_INNER_D;
  const wall = BOX_WALL;
  const h = BOX_INNER_H;
  const halfW = outerW * 0.5;
  const halfD = outerD * 0.5;
  const iHalfW = innerW * 0.5;
  const iHalfD = innerD * 0.5;
  // Brand panels sit slightly proud of kraft — never share a corner edge.
  const brandPad = 0.012;

  const BrandPanel = ({
    position,
    rotation,
    args,
  }: {
    position: [number, number, number];
    rotation?: [number, number, number];
    args: [number, number];
  }) => (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args} />
      <meshStandardMaterial
        map={brandMap ?? undefined}
        color={brandMap ? "#ffffff" : boardDark}
        roughness={0.78}
        metalness={0.04}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );

  return (
    <group position={base}>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[outerW + 0.28, 0.1, outerD + 0.28]} />
        <meshStandardMaterial color="#3a4046" metalness={0.55} roughness={0.45} />
      </mesh>

      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[innerW, 0.03, innerD]} />
        <meshStandardMaterial color={boardIn} roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Kraft shell — front/back full width; sides sit between them (one box). */}
      <mesh position={[0, h * 0.5, halfD - wall * 0.5]}>
        <boxGeometry args={[outerW, h, wall]} />
        <meshStandardMaterial color={board} roughness={0.84} metalness={0.04} />
      </mesh>
      <mesh position={[0, h * 0.5, -halfD + wall * 0.5]}>
        <boxGeometry args={[outerW, h, wall]} />
        <meshStandardMaterial color={boardDark} roughness={0.84} metalness={0.04} />
      </mesh>
      <mesh position={[-halfW + wall * 0.5, h * 0.5, 0]}>
        <boxGeometry args={[wall, h, innerD]} />
        <meshStandardMaterial color={board} roughness={0.84} metalness={0.04} />
      </mesh>
      <mesh position={[halfW - wall * 0.5, h * 0.5, 0]}>
        <boxGeometry args={[wall, h, innerD]} />
        <meshStandardMaterial color={boardDark} roughness={0.84} metalness={0.04} />
      </mesh>

      {/* Interior liners */}
      <mesh position={[0, h * 0.5, iHalfD - 0.01]}>
        <boxGeometry args={[innerW - 0.02, h - 0.04, 0.02]} />
        <meshStandardMaterial color="#4a3420" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, h * 0.5, -iHalfD + 0.01]}>
        <boxGeometry args={[innerW - 0.02, h - 0.04, 0.02]} />
        <meshStandardMaterial color="#4a3420" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[-iHalfW + 0.01, h * 0.5, 0]}>
        <boxGeometry args={[0.02, h - 0.04, innerD - 0.02]} />
        <meshStandardMaterial color="#4a3420" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[iHalfW - 0.01, h * 0.5, 0]}>
        <boxGeometry args={[0.02, h - 0.04, innerD - 0.02]} />
        <meshStandardMaterial color="#4a3420" roughness={0.92} metalness={0} />
      </mesh>

      {/* Jeeru brand faces — inset so corners stay kraft */}
      <BrandPanel
        position={[0, h * 0.5, halfD + brandPad]}
        args={[outerW - wall * 2.2, h - 0.08]}
      />
      <BrandPanel
        position={[0, h * 0.5, -halfD - brandPad]}
        rotation={[0, Math.PI, 0]}
        args={[outerW - wall * 2.2, h - 0.08]}
      />
      <BrandPanel
        position={[halfW + brandPad, h * 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        args={[innerD - 0.06, h - 0.08]}
      />
      <BrandPanel
        position={[-halfW - brandPad, h * 0.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        args={[innerD - 0.06, h - 0.08]}
      />

      {/* Kraft flaps — close into one lid */}
      <group ref={flapBack} position={[0, h, halfD - wall]}>
        <mesh position={[0, 0, outerD * 0.22]}>
          <boxGeometry args={[outerW - 0.02, 0.028, outerD * 0.45]} />
          <meshStandardMaterial color={board} roughness={0.84} metalness={0.04} />
        </mesh>
      </group>
      <group ref={flapFront} position={[0, h, -halfD + wall]}>
        <mesh position={[0, 0, -outerD * 0.2]}>
          <boxGeometry args={[outerW - 0.02, 0.028, outerD * 0.42]} />
          <meshStandardMaterial color={boardDark} roughness={0.84} metalness={0.04} />
        </mesh>
      </group>
      <group ref={flapLeft} position={[-halfW + wall, h, 0]}>
        <mesh position={[-outerW * 0.18, 0, 0]}>
          <boxGeometry args={[outerW * 0.38, 0.028, outerD - 0.04]} />
          <meshStandardMaterial color={board} roughness={0.84} metalness={0.04} />
        </mesh>
      </group>
      <group ref={flapRight} position={[halfW - wall, h, 0]}>
        <mesh position={[outerW * 0.18, 0, 0]}>
          <boxGeometry args={[outerW * 0.38, 0.028, outerD - 0.04]} />
          <meshStandardMaterial color={boardDark} roughness={0.84} metalness={0.04} />
        </mesh>
      </group>

      <mesh
        ref={tape}
        position={[0, h + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[outerW - wall * 2, 0.14]} />
        <meshStandardMaterial
          map={tapeMap ?? undefined}
          color={tapeMap ? "#ffffff" : "#1a3a8f"}
          roughness={0.55}
          metalness={0.08}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Phase 6 — kraft 3-pack trays under the main belt.
 * Index-step motion (hold → ease one pitch → hold), synced to bay seal.
 * Recycle only off-camera so wraps never pop in frame.
 */
const TRAY_COUNT = 5;
const TRAY_SPACING = 2.15;
const TRAY_LOOP = TRAY_COUNT * TRAY_SPACING;
/** Centered under the tread (z≈0), below the chassis. */
const TRAY_Z = 0;
const TRAY_Y = -0.34;
const TRAY_HOLD = 0.95;
const TRAY_MOVE = 0.55;

function LowerTrayStation({
  beltOffset,
  pauseRemain,
  dwellProgress,
  sealing,
  brandMap,
}: {
  beltOffset: MutableRefObject<number>;
  pauseRemain: MutableRefObject<number>;
  dwellProgress: MutableRefObject<number>;
  sealing: MutableRefObject<boolean>;
  brandMap: CanvasTexture | null;
}) {
  const trays = useRef<(Group | null)[]>([]);
  const flaps = useRef<{ l: Group | null; r: Group | null; f: Group | null; b: Group | null }[]>(
    Array.from({ length: TRAY_COUNT }, () => ({ l: null, r: null, f: null, b: null })),
  );
  const fold = useRef<number[]>(Array.from({ length: TRAY_COUNT }, () => 0));
  const stepsDone = useRef(0);
  const moving = useRef(false);
  const moveT = useRef(0);
  const holdT = useRef(0);
  const wasSealing = useRef(false);

  useFrame((_, delta) => {
    const step = Math.min(Math.max(delta, 0), 1 / 30);
    const bayPaused = pauseRemain.current > 0;

    // Next index step when a seal dwell ends, or on a steady hold cadence.
    if (sealing.current || bayPaused) {
      wasSealing.current = true;
      holdT.current = 0;
    } else if (wasSealing.current && !moving.current) {
      wasSealing.current = false;
      moving.current = true;
      moveT.current = 0;
    } else if (!moving.current && !bayPaused) {
      holdT.current += step;
      if (holdT.current >= TRAY_HOLD) {
        holdT.current = 0;
        moving.current = true;
        moveT.current = 0;
      }
    }

    let travel = stepsDone.current * TRAY_SPACING;
    if (moving.current) {
      moveT.current = Math.min(1, moveT.current + step / TRAY_MOVE);
      const e = smoothstep(0, 1, moveT.current);
      travel += e * TRAY_SPACING;
      if (moveT.current >= 1) {
        moving.current = false;
        moveT.current = 0;
        stepsDone.current += 1;
        travel = stepsDone.current * TRAY_SPACING;
      }
    }

    for (let i = 0; i < TRAY_COUNT; i += 1) {
      const node = trays.current[i];
      if (!node) continue;

      const raw = i * TRAY_SPACING + travel;
      const u = ((raw % TRAY_LOOP) + TRAY_LOOP) % TRAY_LOOP;
      const x = -TRAY_LOOP * 0.5 + u;
      node.position.x = x;
      node.position.y = 0.035;
      node.position.z = 0;

      // Form under bay while holding; stay formed until recycle off-screen.
      const atBay = !moving.current && Math.abs(x) < 0.75;
      const offscreen = Math.abs(x) > TRAY_LOOP * 0.45;
      let target = fold.current[i] ?? 0;
      if (offscreen) target = 0;
      else if (atBay) target = 1;
      else if ((fold.current[i] ?? 0) > 0.5 && x > -0.2) target = 1;
      const rate = atBay ? 3.2 : offscreen ? 8 : 1.6;
      fold.current[i] = (fold.current[i] ?? 0) + (target - (fold.current[i] ?? 0)) * Math.min(1, step * rate);

      const sealBoost =
        sealing.current && atBay ? smoothstep(0.2, 0.9, dwellProgress.current) * 0.15 : 0;
      const ang = Math.min(1, (fold.current[i] ?? 0) + sealBoost) * 1.15;
      const f = flaps.current[i]!;
      if (f.l) f.l.rotation.z = -ang;
      if (f.r) f.r.rotation.z = ang;
      if (f.f) f.f.rotation.x = ang * 0.95;
      if (f.b) f.b.rotation.x = -ang * 0.95;
    }

    void beltOffset.current;
  });

  const kraft = "#c4a574";
  const kraftDark = "#9a7a45";
  const well = "#6b4f2e";
  const scale = 0.82;
  const outerW = BOX_OUTER_W * scale;
  const outerD = Math.min(BOX_OUTER_D * scale, 0.95);
  const wallH = BOX_INNER_H * 0.28;
  const halfW = outerW * 0.5;
  const halfD = outerD * 0.5;
  const pitch = CAN_PITCH * scale;

  return (
    <group position={[0, TRAY_Y, TRAY_Z]}>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[BELT_LEN * 0.85, 0.06, 1.15]} />
        <meshStandardMaterial color="#2a3036" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <boxGeometry args={[BELT_LEN * 0.82, 0.02, 0.95]} />
        <meshStandardMaterial color="#3a424a" metalness={0.55} roughness={0.48} />
      </mesh>
      {[-0.5, 0.5].map((z) => (
        <mesh key={`tray-rail-${z}`} position={[0, 0.02, z]}>
          <boxGeometry args={[BELT_LEN * 0.82, 0.025, 0.03]} />
          <meshStandardMaterial color="#5a636b" metalness={0.75} roughness={0.32} />
        </mesh>
      ))}

      {Array.from({ length: TRAY_COUNT }, (_, i) => (
        <group
          key={`tray-${i}`}
          ref={(node) => {
            trays.current[i] = node;
          }}
          position={[-TRAY_LOOP * 0.5 + i * TRAY_SPACING, 0.035, 0]}
        >
          <mesh receiveShadow>
            <boxGeometry args={[outerW, 0.028, outerD]} />
            <meshStandardMaterial color={kraft} roughness={0.86} metalness={0.04} />
          </mesh>
          <mesh position={[0, 0.016, 0]}>
            <boxGeometry args={[outerW - 0.04, 0.004, outerD - 0.04]} />
            <meshStandardMaterial color={kraftDark} roughness={0.9} metalness={0.02} />
          </mesh>
          {Array.from({ length: PACK_CAPACITY }, (_, s) => {
            const wx = (s - (PACK_CAPACITY - 1) / 2) * pitch;
            return (
              <mesh key={`well-${i}-${s}`} position={[wx, 0.022, 0]}>
                <cylinderGeometry args={[CAN_R * 0.78, CAN_R * 0.82, 0.03, 20]} />
                <meshStandardMaterial color={well} roughness={0.92} metalness={0} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.02, halfD - 0.02]}>
            <boxGeometry args={[outerW * 0.4, 0.018, 0.012]} />
            <meshStandardMaterial
              map={brandMap ?? undefined}
              color={brandMap ? "#ffffff" : kraftDark}
              roughness={0.8}
              metalness={0.04}
            />
          </mesh>

          <group
            ref={(node) => {
              flaps.current[i]!.l = node;
            }}
            position={[-halfW, 0.012, 0]}
          >
            <mesh position={[-0.04, wallH * 0.5, 0]}>
              <boxGeometry args={[0.08, wallH, outerD - 0.02]} />
              <meshStandardMaterial color={kraftDark} roughness={0.84} metalness={0.04} />
            </mesh>
          </group>
          <group
            ref={(node) => {
              flaps.current[i]!.r = node;
            }}
            position={[halfW, 0.012, 0]}
          >
            <mesh position={[0.04, wallH * 0.5, 0]}>
              <boxGeometry args={[0.08, wallH, outerD - 0.02]} />
              <meshStandardMaterial color={kraftDark} roughness={0.84} metalness={0.04} />
            </mesh>
          </group>
          <group
            ref={(node) => {
              flaps.current[i]!.f = node;
            }}
            position={[0, 0.012, halfD]}
          >
            <mesh position={[0, wallH * 0.5, 0.04]}>
              <boxGeometry args={[outerW - 0.02, wallH, 0.08]} />
              <meshStandardMaterial color={kraft} roughness={0.84} metalness={0.04} />
            </mesh>
          </group>
          <group
            ref={(node) => {
              flaps.current[i]!.b = node;
            }}
            position={[0, 0.012, -halfD]}
          >
            <mesh position={[0, wallH * 0.5, -0.04]}>
              <boxGeometry args={[outerW - 0.02, wallH, 0.08]} />
              <meshStandardMaterial color={kraft} roughness={0.84} metalness={0.04} />
            </mesh>
          </group>
        </group>
      ))}

      <pointLight position={[0, 0.35, 0.2]} intensity={0.9} color="#d4b090" distance={3.2} />
    </group>
  );
}

function LineRig({ rolling }: { rolling: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const seals = useRef<InstancedMesh>(null);
  const labels = useRef<(InstancedMesh | null)[]>([null, null, null]);
  const flash = useRef<PointLight>(null);
  const rollers = useRef<Group>(null);
  const cleats = useRef<InstancedMesh>(null);
  const offset = useRef(0);
  const pauseRemain = useRef(0);
  const dwellProgress = useRef(0);
  const sealing = useRef(false);
  const labeling = useRef(false);
  const clampHolding = useRef(false);
  const clampApproach = useRef(0);
  const clampGateOpen = useRef(1);
  const labelApply = useRef(0);
  const clampHoldRemain = useRef(0);
  const pausedSlot = useRef(-1);
  const hitA = useRef(false);
  const hitB = useRef(false);
  /** 0 = open, 1 = first-hit high rim, 2 = final packaged */
  const sealStage = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const packPhase = useRef<PackPhase[]>(Array.from({ length: COUNT }, () => 0));
  const packT = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const packStartX = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const packDone = useRef<boolean[]>(Array.from({ length: COUNT }, () => false));
  const packRiding = useRef<boolean[]>(Array.from({ length: COUNT }, () => false));
  const packRotX = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const packSlot = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const packCount = useRef(0);
  /** Flavors already claimed for the open carton (in-flight + seated). */
  const packClaimed = useRef<number[]>([]);
  /** Alternates mono (3 same) ↔ mixed (one of each). */
  const packFillMode = useRef<PackFillMode>("mono");
  /** Target flavor when packing a mono carton. */
  const packMonoFlavor = useRef(0);
  const autoClose = useRef(0);
  const autoTape = useRef(0);
  const sealedHold = useRef(0);
  const cartonClose = useRef(0);
  const cartonTape = useRef(0);
  const canPos = useRef<{ x: number; y: number; z: number }[]>(
    Array.from({ length: COUNT }, () => ({ x: 0, y: CAN_Y, z: 0 })),
  );
  const pusherZ = useRef(PUSHER_IDLE_Z);
  const lastX = useRef<number[]>(Array.from({ length: COUNT }, () => 0));
  const geometry = useMemo(() => createSlimCanGeometry(), []);
  const sealGeo = useMemo(() => {
    const g = new TorusGeometry(0.205, 0.011, 10, 48);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  // Full-body wrap — one geometry+reveal attr per flavor (shared attr would fight).
  const labelGeos = useMemo(() => LABEL_KINDS.map(() => createWipeWrapGeometry()), []);
  const beltMap = useMemo(() => (typeof document === "undefined" ? null : createBeltTexture()), []);
  const rollerMap = useMemo(() => (typeof document === "undefined" ? null : createRollerTexture()), []);
  const CLEAT_COUNT = 40;
  const CLEAT_SPACING = BELT_LEN / CLEAT_COUNT;
  const logoImg = useBrandLogoImage();
  const labelMaps = useMemo(() => {
    return LABEL_KINDS.map((kind) => {
      const tex = createBrandLabelTexture(kind, logoImg);
      tex.wrapS = RepeatWrapping;
      tex.wrapT = ClampToEdgeWrapping;
      tex.anisotropy = 8;
      return tex;
    });
  }, [logoImg]);
  const labelMats = useMemo(
    () => labelMaps.map((tex) => createWipeWrapMaterial(tex)),
    [labelMaps],
  );
  const cartonBrandMap = useMemo(() => createCartonBrandTexture(logoImg), [logoImg]);
  const tapeMap = useMemo(() => (typeof document === "undefined" ? null : createJeeruTapeTexture()), []);
  const rollingRef = useRef(rolling);
  rollingRef.current = rolling;

  const writeInstances = (s: number) => {
    const inst = mesh.current;
    if (!inst) return;
    const labelCounts = [0, 0, 0];
    let activePusherZ = PUSHER_IDLE_Z;

    for (let n = 0; n < COUNT; n += 1) {
      const pos = canPos.current[n]!;
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;
      const stage = sealStage.current[n] ?? 0;
      const phase = packPhase.current[n] ?? 0;
      const rotX = packRotX.current[n] ?? 0;
      const scale = phase === 0 ? seatScale(x) : 1;

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, 0, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      inst.setMatrixAt(n, dummy.matrix);
      const base = n % 2 === 0 ? aluminumA : aluminumB;
      inst.setColorAt(n, stage >= 2 ? sealedTint : base);

      if (phase === 1 || phase === 2) {
        // Pad rides under/behind the can all the way out to ALIGN_Z.
        activePusherZ = Math.max(activePusherZ, z - 0.1);
      } else if (phase === 3 || phase === 4) {
        // Park pad at the align stop while the can flips clear.
        activePusherZ = Math.max(activePusherZ, ALIGN_Z - 0.08);
      }

      if (seals.current) {
        if (stage >= 1) {
          const rimY = stage === 1 ? RIM_HIGH : RIM_FINAL;
          dummy.position.set(x, y + rimY * Math.cos(rotX), z + rimY * Math.sin(rotX));
          dummy.rotation.set(rotX, 0, 0);
          dummy.scale.set(stage === 1 ? 1.04 : 1, 1, stage === 1 ? 1.04 : 1);
          dummy.updateMatrix();
          seals.current.setMatrixAt(n, dummy.matrix);
          seals.current.setColorAt(n, goldSeal);
        } else {
          dummy.position.set(0, -20, 0);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          seals.current.setMatrixAt(n, dummy.matrix);
        }
      }

      // Full wrap — top→bottom wipe via aReveal (no Y-scale UV squash).
      const applying =
        sealing.current && pausedSlot.current === n && labelApply.current > 0.02;
      const reveal = stage >= 2 ? 1 : applying ? labelApply.current : 0;
      if (reveal > 0.01) {
        const kind = canFlavorKind(n);
        const sleeve = labels.current[kind];
        if (sleeve) {
          const i = labelCounts[kind]!;
          if (i < COUNT) {
            const faceY = labelFaceYaw(x, z);
            dummy.position.set(
              x,
              y + CAN_WRAP.y * Math.cos(rotX),
              z + CAN_WRAP.y * Math.sin(rotX),
            );
            dummy.rotation.set(rotX, faceY, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            sleeve.setMatrixAt(i, dummy.matrix);
            const revealAttr = sleeve.geometry.getAttribute("aReveal") as InstancedBufferAttribute | undefined;
            if (revealAttr) revealAttr.setX(i, reveal);
            labelCounts[kind] = i + 1;
          }
        }
      }
    }

    pusherZ.current = activePusherZ;

    inst.count = COUNT;
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    if (seals.current) {
      seals.current.count = COUNT;
      seals.current.instanceMatrix.needsUpdate = true;
      if (seals.current.instanceColor) seals.current.instanceColor.needsUpdate = true;
    }
    labels.current.forEach((sleeve, kind) => {
      if (!sleeve) return;
      sleeve.count = labelCounts[kind] ?? 0;
      sleeve.instanceMatrix.needsUpdate = true;
      const revealAttr = sleeve.geometry.getAttribute("aReveal") as InstancedBufferAttribute | undefined;
      if (revealAttr) revealAttr.needsUpdate = true;
    });

    if (cleats.current) {
      for (let i = 0; i < CLEAT_COUNT; i += 1) {
        const cx = ((i * CLEAT_SPACING + s) % BELT_LEN) - BELT_LEN / 2;
        dummy.position.set(cx, BELT_TOP + 0.012, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        cleats.current.setMatrixAt(i, dummy.matrix);
      }
      cleats.current.instanceMatrix.needsUpdate = true;
    }
  };

  useLayoutEffect(() => {
    writeInstances(offset.current);
    return () => {
      beltMap?.dispose();
      rollerMap?.dispose();
      sealGeo.dispose();
      labelGeos.forEach((g) => g.dispose());
      labelMats.forEach((m) => m.dispose());
      labelMaps.forEach((t) => t.dispose());
      cartonBrandMap.dispose();
      tapeMap?.dispose();
    };
    // writeInstances closes over latest refs; re-seed when label assets change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional asset-keyed init
  }, [geometry, beltMap, rollerMap, sealGeo, labelGeos, labelMats, labelMaps, cartonBrandMap, tapeMap]);

  useFrame((_, delta) => {
    const step = Math.min(Math.max(delta, 0), 1 / 30);

    if (rollingRef.current) {
      if (pauseRemain.current > 0) {
        sealing.current = true;
        clampHolding.current = false;
        pauseRemain.current -= step;
        dwellProgress.current = Math.min(1, 1 - pauseRemain.current / DWELL_SEC);
        const slot = pausedSlot.current;

        // Hit 1 → high rim
        if (!hitA.current && dwellProgress.current >= 0.22 && slot >= 0) {
          sealStage.current[slot] = 1;
          hitA.current = true;
          if (flash.current) flash.current.intensity = 10;
        }
        // Hit 2 → final packaged rim once wrap apply finishes
        if (!hitB.current && dwellProgress.current >= 0.72 && labelApply.current >= 0.92 && slot >= 0) {
          sealStage.current[slot] = 2;
          hitB.current = true;
          if (flash.current) flash.current.intensity = 16;
        }

        if (pauseRemain.current <= 0) {
          pauseRemain.current = 0;
          dwellProgress.current = 1;
          sealing.current = false;
          // Every can holds for the exit gate beat after stamp/label.
          if (slot >= 0) {
            clampHoldRemain.current = CLAMP_HOLD_SEC;
            clampHolding.current = true;
          } else {
            offset.current += BAY_CLEAR;
            dwellProgress.current = 0;
            pausedSlot.current = -1;
            hitA.current = false;
            hitB.current = false;
            clampHolding.current = false;
          }
        }
      } else if (clampHoldRemain.current > 0) {
        // Stamp up, exit cracked — can waits a beat inside the open exit gate.
        sealing.current = false;
        clampHolding.current = true;
        dwellProgress.current = 1;
        clampHoldRemain.current -= step;
        if (clampHoldRemain.current <= 0) {
          clampHoldRemain.current = 0;
          clampHolding.current = false;
          offset.current += BAY_CLEAR;
          dwellProgress.current = 0;
          pausedSlot.current = -1;
          hitA.current = false;
          hitB.current = false;
        }
      } else {
        sealing.current = false;
        clampHolding.current = false;
        dwellProgress.current = 0;
        labelApply.current = 0;
        const prev = offset.current;
        let nextOffset = prev + step * CRUISE_SPEED;

        // Gate collision — don't drive a bare can through closed jaws.
        if (clampGateOpen.current < 0.75) {
          for (let n = 0; n < COUNT; n += 1) {
            if ((sealStage.current[n] ?? 0) >= 2) continue;
            if ((packPhase.current[n] ?? 0) !== 0) continue;
            if (packRiding.current[n]) continue;
            const prevX = wrapAlongBelt(n * SPACING + prev);
            const nextX = wrapAlongBelt(n * SPACING + nextOffset);
            if (prevX < CLAMP_GATE_PLANE && nextX >= CLAMP_GATE_PLANE && nextX - prevX < SPACING * 0.5) {
              nextOffset = prev + (CLAMP_GATE_PLANE - 0.02 - prevX);
              break;
            }
          }
        }

        offset.current = nextOffset;
        if (beltMap) {
          beltMap.offset.x = (beltMap.offset.x - (nextOffset - prev) * BELT_UV_PER_WORLD) % 1;
        }
        if (rollers.current) {
          const spin = offset.current / 0.11;
          rollers.current.children.forEach((child) => {
            child.rotation.x = spin;
          });
        }

        for (let n = 0; n < COUNT; n += 1) {
          // Fully packaged cans pass through without another seal cycle.
          if ((sealStage.current[n] ?? 0) >= 2) continue;
          if ((packPhase.current[n] ?? 0) !== 0) continue;
          if (packRiding.current[n]) continue;
          const prevX = wrapAlongBelt(n * SPACING + prev);
          const nextX = wrapAlongBelt(n * SPACING + offset.current);
          const crossed = prevX < BAY_X && nextX >= BAY_X && nextX - prevX < SPACING * 0.5;
          if (crossed) {
            // Only seat once gates are clear — otherwise wait at the plane.
            if (clampGateOpen.current < 0.85) {
              offset.current = prev + (CLAMP_GATE_PLANE - 0.02 - prevX);
              break;
            }
            offset.current = prev + (BAY_X - prevX);
            pauseRemain.current = DWELL_SEC;
            dwellProgress.current = 0;
            pausedSlot.current = n;
            hitA.current = false;
            hitB.current = false;
            sealing.current = true;
            clampHolding.current = false;
            break;
          }
        }
      }
    }

    if (flash.current && flash.current.intensity > 0) {
      flash.current.intensity = Math.max(0, flash.current.intensity - step * 22);
    }

    // Phase 5/6 — labeled cans into 3-pack; after 3, auto-close then tape.
    const beltMoving =
      rollingRef.current && pauseRemain.current <= 0 && clampHoldRemain.current <= 0;
    const host = typeof document !== "undefined" ? document.querySelector("[data-factory-stage]") : null;
    let scrollClose = 0;
    if (host) {
      const rawClose = parseFloat(host.getAttribute("data-carton-close") || "0");
      scrollClose = Number.isFinite(rawClose) ? Math.min(1, Math.max(0, rawClose)) : 0;
    }

    // Keep flaps open until all 3 seats are filled — scroll must not seal early.
    const boxFull = packCount.current >= PACK_CAPACITY;
    if (boxFull && autoClose.current < 1) {
      autoClose.current = Math.min(1, autoClose.current + step / CLOSE_DUR);
    }
    // Tape only after flaps are fully closed.
    if (autoClose.current >= TAPE_AFTER_CLOSE && autoTape.current < 1) {
      autoTape.current = Math.min(1, autoTape.current + step / TAPE_DUR);
    }
    if (autoTape.current >= 1) {
      sealedHold.current += step;
      // Don't recycle the sealed pack while scroll is still driving the close/tape beat.
      if (sealedHold.current >= SEALED_HOLD && scrollClose < 0.92) {
        for (let n = 0; n < COUNT; n += 1) {
          if ((packPhase.current[n] ?? 0) !== 4) continue;
          sealStage.current[n] = 0;
          packPhase.current[n] = 0;
          packDone.current[n] = false;
          packRiding.current[n] = false;
          packRotX.current[n] = 0;
          packSlot.current[n] = 0;
          const x = ENTER_X + 0.2 + (n % 3) * 0.05;
          canPos.current[n] = { x, y: seatY(x), z: 0 };
          lastX.current[n] = x;
        }
        packCount.current = 0;
        packClaimed.current = [];
        // Next carton: alternate mono ↔ mixed; advance mono flavor each mono cycle.
        if (packFillMode.current === "mono") {
          packFillMode.current = "mixed";
        } else {
          packFillMode.current = "mono";
          packMonoFlavor.current = (packMonoFlavor.current + 1) % 3;
        }
        autoClose.current = 0;
        autoTape.current = 0;
        sealedHold.current = 0;
      }
    }

    if (boxFull) {
      cartonClose.current = Math.max(scrollClose, autoClose.current);
      const tapeFromScroll =
        scrollClose >= TAPE_AFTER_CLOSE ? smoothstep(TAPE_AFTER_CLOSE, 1, scrollClose) : 0;
      const closeDone = cartonClose.current >= TAPE_AFTER_CLOSE;
      cartonTape.current = closeDone ? Math.max(autoTape.current, tapeFromScroll) : 0;
    } else {
      cartonClose.current = 0;
      cartonTape.current = 0;
      autoClose.current = 0;
      autoTape.current = 0;
    }

    // Label clamp — every can; keep approach hot until seated.
    {
      const slot = pausedSlot.current;
      labeling.current = (sealing.current || clampHolding.current) && slot >= 0;

      let approach = 0;
      if (sealing.current && dwellProgress.current < 0.2) {
        approach = 1;
      } else if (!sealing.current && !clampHolding.current) {
        for (let n = 0; n < COUNT; n += 1) {
          if ((sealStage.current[n] ?? 0) >= 2) continue;
          if ((packPhase.current[n] ?? 0) !== 0) continue;
          if (packRiding.current[n]) continue;
          const x = wrapAlongBelt(n * SPACING + offset.current);
          if (x < CLAMP_APPROACH_X || x > BAY_X + 0.05) continue;
          approach = Math.max(approach, smoothstep(CLAMP_APPROACH_X, -0.05, x));
        }
      }
      clampApproach.current = approach;
    }

    // Only block new diverts once the box is full (never mid-fill from scroll).
    const closing = boxFull;
    let packBusy = packPhase.current.some((p) => p === 1 || p === 2 || p === 3);
    const solids = buildPackSolids(pusherZ.current);
    const divertSolids = buildPackSolids(pusherZ.current, { includePad: false, includeFloor: false });

    const canJoinOpenPack = (n: number): boolean => {
      if (packClaimed.current.length >= PACK_CAPACITY) return false;
      const kind = canFlavorKind(n);
      if (packFillMode.current === "mono") {
        return kind === packMonoFlavor.current;
      }
      // Mixed: one of each — reject a flavor already claimed.
      return !packClaimed.current.includes(kind);
    };

    for (let n = 0; n < COUNT; n += 1) {
      let phase = packPhase.current[n] ?? 0;

      if (phase === 0) {
        if (packRiding.current[n]) {
          if (beltMoving) {
            canPos.current[n]!.x += step * CRUISE_SPEED;
          }
          canPos.current[n]!.y = CAN_Y;
          canPos.current[n]!.z = 0;
          packRotX.current[n] = 0;
          if (canPos.current[n]!.x >= EXIT_X) {
            sealStage.current[n] = 0;
            packDone.current[n] = false;
            packRiding.current[n] = false;
            const x = wrapAlongBelt(n * SPACING + offset.current);
            canPos.current[n] = { x, y: seatY(x), z: 0 };
            lastX.current[n] = x;
          }
        } else {
          const x = wrapAlongBelt(n * SPACING + offset.current);
          if (lastX.current[n]! > 4 && x < -4) {
            sealStage.current[n] = 0;
            packDone.current[n] = false;
            packRiding.current[n] = false;
            packRotX.current[n] = 0;
          }
          lastX.current[n] = x;

          if (
            beltMoving &&
            !packBusy &&
            !closing &&
            canJoinOpenPack(n) &&
            (sealStage.current[n] ?? 0) >= 2 &&
            !packDone.current[n] &&
            packCount.current < PACK_CAPACITY &&
            x >= PACK_GATE_X &&
            x < PACK_GATE_X + 0.45
          ) {
            packPhase.current[n] = 1;
            packT.current[n] = 0;
            packStartX.current[n] = x;
            packSlot.current[n] = packClaimed.current.length;
            packClaimed.current.push(canFlavorKind(n));
            packBusy = true;
            phase = 1;
          } else {
            canPos.current[n] = { x, y: seatY(x), z: 0 };
            packRotX.current[n] = 0;
          }
        }
      }

      phase = packPhase.current[n] ?? 0;

      if (phase === 1) {
        packT.current[n] = (packT.current[n] ?? 0) + step;
        const u = Math.min(1, (packT.current[n] ?? 0) / ALIGN_DUR);
        const e = smoothstep(0, 1, u);
        const sx = packStartX.current[n] ?? PACK_GATE_X;
        const railHop = Math.sin(Math.min(1, e / 0.35) * Math.PI) * 0.22 * (e < 0.55 ? 1 : 0);
        const desired = {
          x: sx + (ALIGN_X - sx) * e,
          y: CAN_Y + railHop,
          z: ALIGN_Z * e,
        };
        canPos.current[n] = resolveCanPose(desired.x, desired.y, desired.z, 0, divertSolids);
        packRotX.current[n] = 0;
        if (u >= 1) {
          packPhase.current[n] = 2;
          packT.current[n] = 0;
        }
      } else if (phase === 2) {
        packT.current[n] = (packT.current[n] ?? 0) + step;
        canPos.current[n] = resolveCanPose(ALIGN_X, CAN_Y, ALIGN_Z, 0, divertSolids);
        packRotX.current[n] = 0;
        if ((packT.current[n] ?? 0) >= ALIGN_HOLD) {
          packPhase.current[n] = 3;
          packT.current[n] = 0;
        }
      } else if (phase === 3) {
        // Pure kinematic tumble from pad → box seats (no collision fighting the flip).
        packT.current[n] = (packT.current[n] ?? 0) + step;
        const u = Math.min(1, (packT.current[n] ?? 0) / JUMP_DUR);
        const slot = packSlot.current[n] ?? 0;
        const settleX = packSlotX(slot);
        const settleZ = CARTON_Z;
        const peakY = BOX_RIM_Y + CAN_HALF_H + 0.28;
        // Full forward flip into the carton — reads clearly off the shelf.
        const rotX = -Math.PI * 2 * smoothstep(0, 0.92, u);

        let desired: { x: number; y: number; z: number };
        if (u < 0.22) {
          const t = smoothstep(0, 1, u / 0.22);
          desired = {
            x: ALIGN_X,
            y: CAN_Y + (peakY - CAN_Y) * t,
            z: ALIGN_Z,
          };
        } else if (u < 0.62) {
          const t = smoothstep(0, 1, (u - 0.22) / 0.4);
          const arc = Math.sin(t * Math.PI) * 0.08;
          desired = {
            x: ALIGN_X + (settleX - ALIGN_X) * t,
            y: peakY + arc,
            z: ALIGN_Z + (settleZ - ALIGN_Z) * t,
          };
        } else {
          const t = smoothstep(0, 1, (u - 0.62) / 0.38);
          desired = {
            x: settleX,
            y: peakY + (BOX_CAN_Y - peakY) * t,
            z: settleZ,
          };
        }

        if (u < 0.88) {
          canPos.current[n] = desired;
        } else {
          // Soft land against floor / walls only in the last beat.
          canPos.current[n] = resolveCanPose(desired.x, desired.y, desired.z, rotX, solids);
        }
        packRotX.current[n] = rotX;

        if (u >= 1) {
          packPhase.current[n] = 4;
          packT.current[n] = 0;
          packDone.current[n] = true;
          packRotX.current[n] = 0;
          canPos.current[n] = { x: settleX, y: BOX_CAN_Y, z: settleZ };
          packCount.current = Math.min(PACK_CAPACITY, packCount.current + 1);
        }
      } else if (phase === 4) {
        const slot = packSlot.current[n] ?? 0;
        canPos.current[n] = { x: packSlotX(slot), y: BOX_CAN_Y, z: CARTON_Z };
        packRotX.current[n] = 0;
      }
    }

    writeInstances(offset.current);
  });

  return (
    <group>
      <FactoryEnvironment />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[BELT_LEN + 2, 2.8]} />
        <meshStandardMaterial color="#141820" roughness={0.85} metalness={0.15} />
      </mesh>

      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[BELT_LEN, 0.14, 1.5]} />
        <meshStandardMaterial color="#3a4046" metalness={0.75} roughness={0.36} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BELT_TOP + 0.001, 0]} receiveShadow>
        <planeGeometry args={[BELT_LEN, 1.28]} />
        <meshStandardMaterial
          map={beltMap ?? undefined}
          color={beltMap ? "#ffffff" : "#8d959c"}
          metalness={0.28}
          roughness={0.7}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      {/* Physical cleats — travel with the line so motion reads at the bottom */}
      <instancedMesh ref={cleats} args={[undefined, undefined, CLEAT_COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.14, 0.03, 1.05]} />
        <meshStandardMaterial color="#7a848e" metalness={0.25} roughness={0.75} />
      </instancedMesh>

      {[-0.66, 0.66].map((z) => (
        <mesh key={z} position={[0, 0.3, z]}>
          <boxGeometry args={[BELT_LEN, 0.04, 0.04]} />
          <meshStandardMaterial color="#2e343a" metalness={0.65} roughness={0.32} />
        </mesh>
      ))}

      <group ref={rollers}>
        {[-9.6, -6.4, -3.2, 0, 3.2, 6.4, 9.6].map((x) => (
          <mesh key={`roll-${x}`} rotation={[0, 0, Math.PI / 2]} position={[x, 0.08, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 1.38, 24]} />
            <meshStandardMaterial
              map={rollerMap ?? undefined}
              color={rollerMap ? "#ffffff" : "#4a5258"}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* End portals — belt disappears into housings so the line never looks cut off */}
      {([-1, 1] as const).map((side) => {
        const x = side * (BELT_LEN * 0.5 - 0.35);
        return (
          <group key={`portal-${side}`} position={[x, 0.55, 0]}>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.9, 1.6, 1.85]} />
              <meshStandardMaterial color="#1a1e22" metalness={0.55} roughness={0.45} />
            </mesh>
            <mesh position={[side * -0.2, 0.15, 0]}>
              <boxGeometry args={[0.35, 1.05, 1.45]} />
              <meshStandardMaterial color="#050607" metalness={0.2} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[1.05, 0.12, 1.95]} />
              <meshStandardMaterial color="#2e343a" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        );
      })}

      <KitbashFillerBay />
      <LowerTrayStation
        beltOffset={offset}
        pauseRemain={pauseRemain}
        dwellProgress={dwellProgress}
        sealing={sealing}
        brandMap={cartonBrandMap}
      />
      <PackGuideRails pusherZ={pusherZ} />
      <OpenCartonCase
        brandMap={cartonBrandMap}
        tapeMap={tapeMap}
        closeProgress={cartonClose}
        tapeProgress={cartonTape}
      />
      <pointLight ref={flash} position={[0, 1.55, 0.55]} intensity={0} color="#fff2c8" distance={5} />
      <StampHead dwellProgress={dwellProgress} sealing={sealing} />
      <LabelApplicatorClamp
        dwellProgress={dwellProgress}
        sealing={sealing}
        labeling={labeling}
        holding={clampHolding}
        approach={clampApproach}
        gateOpen={clampGateOpen}
        labelApply={labelApply}
      />

      <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} frustumCulled={false} castShadow>
        <meshStandardMaterial
          metalness={0.96}
          roughness={0.2}
          envMapIntensity={1.15}
          transparent={false}
          opacity={1}
        />
      </instancedMesh>

      <instancedMesh ref={seals} args={[sealGeo, undefined, COUNT]} frustumCulled={false}>
        <meshStandardMaterial metalness={0.96} roughness={0.14} color="#e0b35a" />
      </instancedMesh>

      {LABEL_KINDS.map((kind, i) => (
        <instancedMesh
          key={`${kind}-${logoImg ? "logo" : "plain"}`}
          ref={(node) => {
            labels.current[i] = node;
          }}
          args={[labelGeos[i], labelMats[i], COUNT]}
          frustumCulled={false}
          castShadow
        />
      ))}
    </group>
  );
}

/** Phase 2+ — factory bay: 若竹 rim, 蜜柑 wash, 珊瑚 kick. */
function Lights({ soft }: { soft: boolean }) {
  const pinkKick = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    if (pinkKick.current) {
      pinkKick.current.intensity = 2.0 + Math.sin(clock.elapsedTime * 1.55) * 0.45;
    }
  });

  return (
    <>
      <color attach="background" args={[FX.nasu]} />
      <fog attach="fog" args={[FX.wallDeep, 15, 36]} />
      <hemisphereLight color={FX.byakugun} groundColor="#1a1420" intensity={0.4} />
      <ambientLight intensity={0.14} color={FX.byakugun} />

      <directionalLight
        position={[6.2, 8.2, 5.0]}
        intensity={0.75}
        color="#fff0d4"
        castShadow={!soft}
        shadow-mapSize={[soft ? 256 : 1024, soft ? 256 : 1024]}
        shadow-bias={-0.00025}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 若竹 rim — bamboo green, not hero blue */}
      <directionalLight position={[-7.5, 3.4, -4.5]} intensity={2.0} color={FX.wakatake} />
      <spotLight
        position={[5.0, 5.2, 6.5]}
        angle={0.55}
        penumbra={0.8}
        intensity={soft ? 5 : 8.5}
        color={FX.mikan}
        distance={20}
      />

      {/* 蜜柑 wash along the line */}
      <spotLight
        position={[0, 5.0, -3.0]}
        angle={0.72}
        penumbra={0.85}
        intensity={soft ? 3.2 : 5.5}
        color={FX.mikan}
        distance={18}
      />

      {/* 珊瑚 kick */}
      <pointLight
        ref={pinkKick}
        position={[2.4, 1.0, 2.6]}
        intensity={2.1}
        color={FX.sango}
        distance={7}
      />
      <pointLight position={[7.8, 1.3, 1.8]} intensity={1.8} color={FX.sango} distance={6} />
    </>
  );
}

/**
 * Playful bay — 茄子紺/青磁 walls, 若竹 windows, 蜜柑/珊瑚 rails.
 * Travels with the line so pan never empties.
 */
function FactoryEnvironment() {
  const neon = useRef<MeshStandardMaterial>(null);
  const bulbs = useRef<(MeshStandardMaterial | null)[]>([]);
  const spots = useRef<(SpotLight | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (neon.current) {
      neon.current.emissiveIntensity = 1.1 + Math.sin(t * 1.7) * 0.35;
    }
    bulbs.current.forEach((mat, i) => {
      if (!mat) return;
      const pulse = 0.92 + Math.sin(t * 2.0 + i * 1.6) * 0.07 + Math.sin(t * 5.1 + i) * 0.03;
      mat.emissiveIntensity = 2.2 + pulse * 1.6;
      const spot = spots.current[i];
      if (spot) spot.intensity = 10 * pulse;
    });
  });

  const bayXs = [-8.5, -5.1, -1.7, 1.7, 5.1, 8.5];

  return (
    <group>
      <mesh position={[0, 2.5, -4.35]} receiveShadow>
        <planeGeometry args={[44, 8.5]} />
        <meshStandardMaterial color={FX.wallDeep} roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.0, -4.28]}>
        <planeGeometry args={[44, 2.8]} />
        <meshStandardMaterial color={FX.wallMid} roughness={0.88} metalness={0.06} />
      </mesh>

      {bayXs.map((x, i) => (
        <group key={`win-${x}`} position={[x, 2.35, -4.05]}>
          <mesh>
            <planeGeometry args={[2.35, 1.25]} />
            <meshStandardMaterial
              color={FX.wakatake}
              emissive={FX.wakatake}
              emissiveIntensity={1.05 + (i % 2) * 0.2}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.5, 1.38, 0.04]} />
            <meshStandardMaterial color={FX.column} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.58, 0.04]}>
            <boxGeometry args={[2.2, 0.05, 0.03]} />
            <meshStandardMaterial
              color={FX.mikan}
              emissive={FX.mikan}
              emissiveIntensity={0.95}
              roughness={0.35}
            />
          </mesh>
          {i % 3 === 1 && (
            <mesh position={[0, 0.55, 0.04]}>
              <boxGeometry args={[2.2, 0.04, 0.03]} />
              <meshStandardMaterial
                color={FX.sango}
                emissive={FX.sango}
                emissiveIntensity={1.05}
                roughness={0.3}
              />
            </mesh>
          )}
          <pointLight position={[0, 0, 0.7]} intensity={3.0} color={FX.wakatake} distance={5.5} />
        </group>
      ))}

      <mesh position={[0, 1.45, -4.0]}>
        <boxGeometry args={[40, 0.06, 0.06]} />
        <meshStandardMaterial
          color={FX.mikan}
          emissive={FX.mikan}
          emissiveIntensity={1.15}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[0, 1.37, -3.98]}>
        <boxGeometry args={[40, 0.03, 0.045]} />
        <meshStandardMaterial
          ref={neon}
          color={FX.sango}
          emissive={FX.sango}
          emissiveIntensity={1.25}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 4.4, -4.1]}>
        <boxGeometry args={[42, 0.1, 0.08]} />
        <meshStandardMaterial
          color={FX.mikan}
          emissive={FX.mikan}
          emissiveIntensity={0.75}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[-14.5, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color={FX.wallDeep} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[14.5, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color={FX.wallDeep} roughness={0.9} metalness={0.05} />
      </mesh>

      {bayXs.map((x, i) => (
        <group key={`hang-${x}`} position={[x * 0.85, 2.85, 1.05]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.4, 6]} />
            <meshStandardMaterial color="#1a1c22" metalness={0.4} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.07, 0.14, 16]} />
            <meshStandardMaterial color="#2a3038" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial
              ref={(m) => {
                bulbs.current[i] = m;
              }}
              color={FX.mikan}
              emissive={FX.mikan}
              emissiveIntensity={3.0}
              roughness={0.28}
            />
          </mesh>
          <spotLight
            ref={(l) => {
              spots.current[i] = l;
            }}
            position={[0, -0.08, 0.08]}
            angle={0.58}
            penumbra={0.78}
            intensity={10}
            color={FX.mikan}
            distance={8}
            castShadow={false}
          />
        </group>
      ))}

      <pointLight position={[8.2, 2.2, -1.8]} intensity={3.4} color={FX.mikan} distance={8} />
      <pointLight position={[0, 1.0, 1.6]} intensity={2.2} color={FX.sango} distance={5} />
      {[-6, 0, 6].map((x) => (
        <pointLight key={`cove-${x}`} position={[x, 3.4, -3.4]} intensity={2.6} color={FX.wakatake} distance={8} />
      ))}

      {[-2.8, 0, 2.8].map((z) => (
        <mesh key={`beam-z-${z}`} position={[0, 4.85, z]}>
          <boxGeometry args={[34, 0.1, 0.16]} />
          <meshStandardMaterial color={FX.column} metalness={0.55} roughness={0.42} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.028, 1.0]} receiveShadow>
        <planeGeometry args={[44, 14]} />
        <meshStandardMaterial color="#0c1814" roughness={0.82} metalness={0.16} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[BELT_LEN + 4, 3.4]} />
        <meshStandardMaterial color="#16352c" roughness={0.55} metalness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.014, 1.48]}>
        <planeGeometry args={[BELT_LEN + 2, 0.1]} />
        <meshStandardMaterial
          color={FX.mikan}
          emissive={FX.mikan}
          emissiveIntensity={0.65}
          roughness={0.42}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.014, -1.48]}>
        <planeGeometry args={[BELT_LEN + 2, 0.07]} />
        <meshStandardMaterial
          color={FX.wakatake}
          emissive={FX.wakatake}
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[12, 2.1, -3.9]}>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial
          color={FX.wakatake}
          emissive={FX.wakatake}
          emissiveIntensity={0.85}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[-12, 2.1, -3.9]}>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial
          color={FX.mikan}
          emissive={FX.mikan}
          emissiveIntensity={0.7}
          roughness={0.45}
        />
      </mesh>

      <mesh position={[1.5, 1.6, 1.2]} rotation={[-0.55, 0.15, 0]}>
        <planeGeometry args={[10, 3.5]} />
        <meshBasicMaterial color={FX.sango} transparent opacity={0.055} depthWrite={false} />
      </mesh>
      <mesh position={[-1.0, 2.4, -2.4]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[16, 2.4]} />
        <meshBasicMaterial color={FX.wakatake} transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  );
}

function LineTravel({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const panTarget = useRef(0);
  const panSmooth = useRef(0);
  const armed = useRef(false);
  /** Responsive travel — less pan on portrait so the 3-pack stays centered. */
  const panDist = useRef(LINE_PAN_X);
  const { camera } = useThree();

  useEffect(() => {
    const syncPanDist = () => {
      const w = window.innerWidth;
      // Leave the carton further right of world-0 on narrow FOV so it isn’t clipped left.
      if (w < 640) panDist.current = Math.max(4.8, CARTON_X - 2.15);
      else if (w < 900) panDist.current = Math.max(5.6, CARTON_X - 1.35);
      else panDist.current = LINE_PAN_X;
    };
    syncPanDist();
    window.addEventListener("resize", syncPanDist);

    const host = document.querySelector("[data-factory-stage]");
    if (!host) {
      return () => window.removeEventListener("resize", syncPanDist);
    }
    const sync = () => {
      armed.current = host.hasAttribute("data-on");
      const v = parseFloat(host.getAttribute("data-line-pan") || "0");
      panTarget.current =
        armed.current && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(host, { attributes: true, attributeFilter: ["data-line-pan", "data-on"] });
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", syncPanDist);
    };
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const step = Math.min(delta * 3.2, 1);
    panSmooth.current += (panTarget.current - panSmooth.current) * step;
    if (!armed.current) panSmooth.current = 0;
    const dist = panDist.current;
    group.current.position.x = -panSmooth.current * dist;

    // On mobile / tablet, ease look-at toward the framed carton so section 2→3 stays centered.
    const narrow = typeof window !== "undefined" && window.innerWidth < 900;
    if (narrow && armed.current) {
      const cartonViewX = CARTON_X - panSmooth.current * dist;
      const lookX = cartonViewX * panSmooth.current * 0.65;
      camera.lookAt(lookX, 0.7, 0.45);
    } else {
      camera.lookAt(0, 0.72, 0);
    }
  });

  return <group ref={group}>{children}</group>;
}

function Tone() {
  const { gl, camera } = useThree();
  useLayoutEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.22;
    gl.shadowMap.type = PCFSoftShadowMap;
    camera.lookAt(0, 0.72, 0);
    camera.near = 0.05;
    camera.far = 80;
    camera.updateProjectionMatrix();
  }, [gl, camera]);
  return null;
}

export function BottlingLineCanvas({ rolling = true }: { rolling?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const [soft, setSoft] = useState(false);
  const armedLatch = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    setSoft(window.matchMedia("(pointer: coarse)").matches);

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        const hitting = Boolean(entry?.isIntersecting);
        setInView((prev) => {
          if (hitting && ratio >= 0.06) return true;
          if (!hitting || ratio < 0.02) return false;
          return prev;
        });
      },
      { threshold: [0, 0.02, 0.06, 0.2, 0.4] },
    );
    io.observe(node);

    const host = node.closest("[data-factory-stage]");
    let offTimer: ReturnType<typeof setTimeout> | null = null;
    const syncArmed = () => {
      const on = !host || host.hasAttribute("data-on");
      if (on) {
        if (offTimer) {
          clearTimeout(offTimer);
          offTimer = null;
        }
        armedLatch.current = true;
        setArmed(true);
        return;
      }
      if (!armedLatch.current || offTimer) return;
      offTimer = setTimeout(() => {
        offTimer = null;
        if (!host?.hasAttribute("data-on")) {
          armedLatch.current = false;
          setArmed(false);
        }
      }, 140);
    };
    syncArmed();
    const mo = host ? new MutationObserver(syncArmed) : null;
    if (host && mo) mo.observe(host, { attributes: true, attributeFilter: ["data-on"] });

    return () => {
      io.disconnect();
      mo?.disconnect();
      if (offTimer) clearTimeout(offTimer);
    };
  }, []);

  const live = inView && armed;

  return (
    <div ref={rootRef} className="bottling-line">
      <Canvas
        camera={{ position: [5.9, 2.55, 7.1], fov: 28 }}
        dpr={soft ? 1 : [1, 1.4]}
        frameloop={live ? "always" : "never"}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: !soft,
          alpha: false,
          powerPreference: soft ? "low-power" : "high-performance",
          stencil: false,
        }}
        shadows={!soft}
      >
        <Tone />
        <AdaptiveDpr pixelated />
        <Lights soft={soft} />
        {/* Local Lightformers only — no CDN HDR, so the bay loads offline / on localhost. */}
        <Environment resolution={soft ? 128 : 256} environmentIntensity={0.42}>
          <Lightformer intensity={2.4} position={[0, 6, 0]} scale={[18, 1.4, 1]} form="rect" />
          <Lightformer
            intensity={1.1}
            position={[-7, 2, 2]}
            scale={[4, 10, 1]}
            form="rect"
            color="#c8e8d8"
          />
          <Lightformer
            intensity={0.95}
            position={[8, 1.5, 3]}
            scale={[4, 9, 1]}
            form="rect"
            color="#ffd4a8"
          />
          <Lightformer intensity={0.55} position={[0, -1, -5]} scale={[20, 6, 1]} color="#1a3a2e" />
        </Environment>
        <Suspense fallback={null}>
          <LineTravel>
            <LineRig rolling={rolling && live} />
          </LineTravel>
        </Suspense>
        <ContactShadows position={[0, -0.02, 0]} opacity={0.55} scale={22} blur={2.8} far={5} />
      </Canvas>
    </div>
  );
}
