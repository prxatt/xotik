export type CapabilityTier = 0 | 1 | 2;

export type TierDetectionResult = {
  tier: CapabilityTier;
  score: number;
  reasons: string[];
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function getNetworkInfo(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function probeWebGL2(): { available: boolean; reason?: string } {
  if (typeof document === "undefined") {
    return { available: false, reason: "no document" };
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return { available: false, reason: "webgl2 unavailable" };
    return { available: true };
  } catch {
    return { available: false, reason: "webgl2 probe failed" };
  }
}

/** Median frame time over a short GPU draw probe (ms). Lower is better. */
export async function probeGpuFrameTime(samples = 8): Promise<number | null> {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const gl = canvas.getContext("webgl2");
  if (!gl) return null;

  const glCtx = gl;

  const vertexSrc = `#version 300 es
    in vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }
  `;
  const fragmentSrc = `#version 300 es
    precision mediump float;
    out vec4 o;
    void main() { o = vec4(0.1, 0.2, 0.3, 1.0); }
  `;

  function compile(type: number, source: string) {
    const shader = glCtx.createShader(type);
    if (!shader) return null;
    glCtx.shaderSource(shader, source);
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) return null;
    return shader;
  }

  const vs = compile(glCtx.VERTEX_SHADER, vertexSrc);
  const fs = compile(glCtx.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return null;

  const program = glCtx.createProgram();
  if (!program) return null;
  glCtx.attachShader(program, vs);
  glCtx.attachShader(program, fs);
  glCtx.linkProgram(program);
  if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) return null;

  const buf = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf);
  glCtx.bufferData(
    glCtx.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    glCtx.STATIC_DRAW,
  );
  const loc = glCtx.getAttribLocation(program, "a");
  glCtx.enableVertexAttribArray(loc);
  glCtx.vertexAttribPointer(loc, 2, glCtx.FLOAT, false, 0, 0);
  glCtx.useProgram(program);

  const times: number[] = [];
  for (let i = 0; i < samples; i += 1) {
    const start = performance.now();
    glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
    glCtx.finish();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)] ?? null;
}

export async function detectCapabilityTier(): Promise<TierDetectionResult> {
  const reasons: string[] = [];
  let score = 0;

  if (typeof window === "undefined") {
    return { tier: 1, score: 0, reasons: ["ssr default"] };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    reasons.push("prefers-reduced-motion");
    score -= 3;
  }

  const webgl = probeWebGL2();
  if (webgl.available) {
    score += 2;
    reasons.push("webgl2");
  } else {
    score -= 4;
    reasons.push(webgl.reason ?? "no webgl2");
  }

  const connection = getNetworkInfo();
  if (connection?.saveData) {
    score -= 3;
    reasons.push("saveData");
  }

  const effectiveType = connection?.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g") {
    score -= 3;
    reasons.push(`effectiveType:${effectiveType}`);
  } else if (effectiveType === "4g" || effectiveType === "5g") {
    score += 1;
    reasons.push(`effectiveType:${effectiveType}`);
  }

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (deviceMemory !== undefined) {
    if (deviceMemory >= 6) {
      score += 1;
      reasons.push(`deviceMemory:${deviceMemory}`);
    }
  } else {
    reasons.push("deviceMemory:unknown (no penalty)");
  }

  if (navigator.hardwareConcurrency >= 6) {
    score += 1;
    reasons.push(`hardwareConcurrency:${navigator.hardwareConcurrency}`);
  }

  const frameTime = await probeGpuFrameTime();
  if (frameTime !== null) {
    if (frameTime < 16.7) {
      score += 2;
      reasons.push(`gpuProbe:${frameTime.toFixed(1)}ms`);
    } else {
      reasons.push(`gpuProbe-slow:${frameTime.toFixed(1)}ms`);
    }
  }

  let tier: CapabilityTier;
  if (score <= 0) tier = 0;
  else if (score <= 3) tier = 1;
  else tier = 2;

  if (reducedMotion) tier = 0;

  return { tier, score, reasons };
}
