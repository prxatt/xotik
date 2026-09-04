import {
  CanvasTexture,
  SRGBColorSpace,
} from "three";

export type CanLabelKind = "jeeru" | "cola" | "lemon";

/** Full-body wrap — covers shoulder→foot on SlimCan (not a mid-band sleeve). */
export const CAN_WRAP = {
  radius: 0.2558,
  height: 1.04,
  y: -0.02,
} as const;

const SPECS: Record<
  CanLabelKind,
  {
    bg: string;
    bgDeep: string;
    band: string;
    accent: string;
    ink: string;
    seed: string[];
    title: string;
    sub: string;
    legal: string;
  }
> = {
  jeeru: {
    bg: "#f4f0e8",
    bgDeep: "#e8e0d2",
    band: "#1a1a1a",
    accent: "#c4102e",
    ink: "#111111",
    seed: ["#c4102e", "#f5c518", "#1a47eb", "#2e9b66", "#8b4513"],
    title: "Jeeru",
    sub: "APPLE · MASALA · FIZZ",
    legal: "J BY JEERU · 250 ml · XOTIK FRUJUS",
  },
  cola: {
    bg: "#1c100c",
    bgDeep: "#0e0806",
    band: "#f5c518",
    accent: "#e07a2f",
    ink: "#f7e7c4",
    seed: ["#f5c518", "#e07a2f", "#8b4513", "#c9953a", "#3a2218"],
    title: "XOTIK",
    sub: "COLA · DESI POP",
    legal: "J BY JEERU · 250 ml · XOTIK FRUJUS",
  },
  lemon: {
    bg: "#f7ec6a",
    bgDeep: "#e6d23a",
    band: "#163018",
    accent: "#1f7a45",
    ink: "#163018",
    seed: ["#1f7a45", "#f2d12b", "#ffffff", "#7ec850", "#c9a012"],
    title: "CLEAR",
    sub: "LEMON · J BY JEERU",
    legal: "J BY JEERU · 250 ml · XOTIK FRUJUS",
  },
};

function paintFullWrap(
  ctx: CanvasRenderingContext2D,
  kind: CanLabelKind,
  logo?: CanvasImageSource | null,
) {
  const W = 1024;
  const H = 1024;
  const spec = SPECS[kind];

  // Full opaque field (no alpha anywhere)
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, spec.bg);
  grad.addColorStop(0.55, spec.bg);
  grad.addColorStop(1, spec.bgDeep);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Top metal lip + brand rail (wraps under the neck)
  ctx.fillStyle = "#c5ccd4";
  ctx.fillRect(0, 0, W, 36);
  ctx.fillStyle = spec.band;
  ctx.fillRect(0, 36, W, 52);
  ctx.fillStyle = spec.accent;
  ctx.fillRect(0, 88, W, 10);

  // Bottom foot rail
  ctx.fillStyle = spec.accent;
  ctx.fillRect(0, H - 98, W, 10);
  ctx.fillStyle = spec.band;
  ctx.fillRect(0, H - 88, W, 52);
  ctx.fillStyle = "#c5ccd4";
  ctx.fillRect(0, H - 36, W, 36);

  // Side seam hash (reads as printed wrap, not floating art)
  ctx.fillStyle = kind === "cola" ? "#3a2a18" : kind === "lemon" ? "#e0d45a" : "#ddd6c8";
  for (let x = 0; x < W; x += 48) {
    ctx.fillRect(x, 98, 2, H - 196);
  }

  // Hero sunburst — centered on the wrap face
  const cx = W * 0.5;
  const cy = H * 0.46;
  for (let i = 0; i < 40; i += 1) {
    const a = (i / 40) * Math.PI * 2;
    const color = spec.seed[i % spec.seed.length]!;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, -168, 16, 72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = spec.seed[(i + 2) % spec.seed.length]!;
    ctx.beginPath();
    ctx.arc(0, -102, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Center badge plate — fully opaque
  ctx.fillStyle = kind === "cola" ? "#241610" : "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = spec.band;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.strokeStyle = spec.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 98, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = kind === "cola" ? "#f7e7c4" : "#111111";
  ctx.font = "700 78px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(spec.title, cx, cy - 6);

  // Flavor line under badge
  ctx.fillStyle = spec.ink;
  ctx.font = "800 36px Arial Black, Impact, sans-serif";
  ctx.fillText(spec.sub, cx, cy + 168);

  // Accent underline bar
  ctx.fillStyle = spec.accent;
  ctx.fillRect(cx - 160, cy + 196, 320, 8);

  // Legal / volume strip near foot
  ctx.fillStyle = kind === "cola" ? "#f5c518" : spec.band;
  ctx.font = "600 22px Arial, Helvetica, sans-serif";
  ctx.fillText(spec.legal, cx, H - 58);

  if (logo) {
    try {
      ctx.drawImage(logo, 40, 108, 100, 62);
      ctx.drawImage(logo, W - 140, 108, 100, 62);
      ctx.drawImage(logo, 40, H - 170, 88, 54);
      ctx.drawImage(logo, W - 128, H - 170, 88, 54);
    } catch {
      // ignore
    }
  }
}

/** Opaque full-can wrap art for product + factory (same asset). */
export function createBrandLabelTexture(
  kind: CanLabelKind,
  logo?: CanvasImageSource | null,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return new CanvasTexture(canvas);

  paintFullWrap(ctx, kind, logo);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}
