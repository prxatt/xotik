"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import {
  Color,
  DirectionalLight,
  Group,
  MeshStandardMaterial,
  PerspectiveCamera,
  SpotLight,
  ClampToEdgeWrapping,
  RepeatWrapping,
} from "three";
import {
  createFullCanWrapGeometry,
  createSlimCanBodyGeometry,
  createSlimCanHardwareGeometry,
} from "@/components/three/SlimCan";
import {
  CAN_WRAP,
  createBrandLabelTexture,
  type CanLabelKind,
} from "@/components/three/createBrandLabelTexture";

/** Per-flavor studio bounce — matches billboard stage, never shared red. */
const STAGE: Record<CanLabelKind, { bounce: string; kick: string; fill: string; shadow: string }> = {
  jeeru: { bounce: "#c4102e", kick: "#ffd0d6", fill: "#fff8f0", shadow: "#3a0008" },
  cola: { bounce: "#2a1810", kick: "#e07a2f", fill: "#fff1d6", shadow: "#0a0604" },
  lemon: { bounce: "#f2d12b", kick: "#7ec850", fill: "#fffff0", shadow: "#163018" },
};

const KINDS: CanLabelKind[] = ["jeeru", "cola", "lemon"];
const BRAND_LOGO_SRC = "/assets/reference/brand/xotik-logo.png";
/** Snappy double-orbit present beat. */
const ORBIT_SEC = 0.38;
const ORBIT_TURNS = 2;

/**
 * Brand art sits at u=0.5 on the wrap → object −X.
 * Camera looks from +Z, so yaw π/2 faces the label at the lens.
 */
const LABEL_FACE_YAW = Math.PI / 2;

function kindIndex(kind: CanLabelKind) {
  return kind === "jeeru" ? 0 : kind === "cola" ? 1 : 2;
}

/** Hard launch, soft land. */
function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

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

function frameForViewport(widthPx: number, heightPx: number) {
  const portrait = heightPx > widthPx * 1.05;
  const narrow = widthPx < 768;
  if (narrow && portrait) {
    return {
      scale: 1.18,
      position: [0, -0.18, 0] as [number, number, number],
      rotation: [0.04, -0.42, 0] as [number, number, number],
      camera: [0, 0.02, 4.35] as [number, number, number],
      fov: 34,
      bob: 0.014,
      spin: 0.28,
      shadowY: -0.95,
    };
  }
  if (narrow) {
    return {
      scale: 1.2,
      position: [0, -0.12, 0] as [number, number, number],
      rotation: [0.05, -0.48, 0] as [number, number, number],
      camera: [0, 0.12, 3.85] as [number, number, number],
      fov: 32,
      bob: 0.02,
      spin: 0.34,
      shadowY: -1.0,
    };
  }
  return {
    scale: 1.48,
    position: [0, -0.08, 0] as [number, number, number],
    rotation: [0.06, -0.55, 0] as [number, number, number],
    camera: [0, 0.18, 3.35] as [number, number, number],
    fov: 30,
    bob: 0.026,
    spin: 0.4,
    shadowY: -1.05,
  };
}

function ShowcaseCan({
  kindRef,
  spinning,
  frame,
  morphRef,
  reducedMotion,
}: {
  kindRef: MutableRefObject<CanLabelKind>;
  spinning: boolean;
  frame: ReturnType<typeof frameForViewport>;
  morphRef: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const bodyGeo = useMemo(() => createSlimCanBodyGeometry(), []);
  const hardwareGeo = useMemo(() => createSlimCanHardwareGeometry(), []);
  const wrapGeo = useMemo(() => createFullCanWrapGeometry(), []);
  const logoImg = useBrandLogoImage();
  const labelMaps = useMemo(() => {
    return KINDS.map((k) => {
      const tex = createBrandLabelTexture(k, logoImg);
      tex.wrapS = RepeatWrapping;
      tex.wrapT = ClampToEdgeWrapping;
      tex.anisotropy = 8;
      return tex;
    });
  }, [logoImg]);

  /** Dim under-wrap metal — never steals the label or flashes with env. */
  const bodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color("#a8b0b8"),
        metalness: 0.85,
        roughness: 0.42,
        envMapIntensity: 0.25,
        transparent: false,
        opacity: 1,
      }),
    [],
  );

  const hardwareMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color("#c8ced6"),
        metalness: 1,
        roughness: 0.22,
        envMapIntensity: 0.7,
        transparent: false,
        opacity: 1,
      }),
    [],
  );

  const wrapMat = useMemo(
    () =>
      new MeshStandardMaterial({
        map: labelMaps[0],
        metalness: 0.02,
        roughness: 0.48,
        envMapIntensity: 0.22,
        transparent: false,
        opacity: 1,
        depthWrite: true,
        toneMapped: true,
      }),
    [labelMaps],
  );

  const activeKind = useRef<CanLabelKind>(kindRef.current);
  const orbit = useRef(0);
  const queued = useRef<CanLabelKind | null>(null);
  const yaw = useRef(LABEL_FACE_YAW - frame.rotation[1]);
  const settleYaw = useRef(0);

  const applyLabel = (kind: CanLabelKind) => {
    const tex = labelMaps[kindIndex(kind)];
    if (!tex) return;
    wrapMat.map = tex;
    wrapMat.needsUpdate = true;
  };

  useEffect(() => {
    applyLabel(activeKind.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelMaps, wrapMat]);

  useEffect(() => {
    return () => {
      bodyGeo.dispose();
      hardwareGeo.dispose();
      wrapGeo.dispose();
      bodyMat.dispose();
      hardwareMat.dispose();
      wrapMat.dispose();
      labelMaps.forEach((t) => t.dispose());
    };
  }, [bodyGeo, hardwareGeo, wrapGeo, bodyMat, hardwareMat, wrapMat, labelMaps]);

  const beginOrbit = (next: CanLabelKind) => {
    if (next === activeKind.current && orbit.current <= 0) return;
    activeKind.current = next;
    // New label first — visible the moment the switch starts.
    applyLabel(next);
    // Face brand art at the camera, then whip a clean 360.
    yaw.current = LABEL_FACE_YAW - frame.rotation[1];
    settleYaw.current = 0;
    orbit.current = reducedMotion ? 1 : 0.0001;
  };

  const finishOrbit = () => {
    yaw.current += Math.PI * 2 * ORBIT_TURNS;
    settleYaw.current = 0;
    orbit.current = 0;
    morphRef.current = 0;
    const next = queued.current;
    queued.current = null;
    if (next && next !== activeKind.current) beginOrbit(next);
  };

  useFrame((_, delta) => {
    const target = kindRef.current;

    if (orbit.current > 0 && orbit.current < 1) {
      if (target !== activeKind.current) queued.current = target;
    } else if (target !== activeKind.current) {
      beginOrbit(target);
    }

    if (orbit.current > 0 && orbit.current < 1) {
      orbit.current = Math.min(1, orbit.current + delta / ORBIT_SEC);
      const u = easeOutQuint(orbit.current);
      settleYaw.current = u * Math.PI * 2 * ORBIT_TURNS;
      morphRef.current = u;
      if (orbit.current >= 1) finishOrbit();
    } else if (orbit.current >= 1) {
      finishOrbit();
    } else {
      morphRef.current = 0;
    }

    if (!group.current) return;
    const t = orbit.current > 0 ? orbit.current : 0;
    const u = t > 0 ? easeOutQuint(t) : 0;

    const pull = t > 0 && t < 0.4 ? Math.sin((t / 0.4) * Math.PI) * 0.06 : 0;
    const present = t > 0.55 ? Math.sin(((t - 0.55) / 0.45) * Math.PI) * 0.08 : 0;
    const s = frame.scale * (1 - pull + present);
    // Keep lean tiny — big lean reads as lighting warp on the cylinder.
    const lean = t > 0 ? Math.sin(u * Math.PI * 2 * ORBIT_TURNS) * 0.03 * (1 - t) : 0;

    group.current.scale.setScalar(s);
    group.current.position.set(
      frame.position[0],
      frame.position[1] +
        present * 0.045 +
        (t > 0 ? Math.sin(u * Math.PI) * 0.03 : 0) +
        Math.sin(performance.now() * 0.00115) * frame.bob * (t > 0 ? 0.2 : 1),
      frame.position[2],
    );

    if (spinning && t <= 0) yaw.current += delta * frame.spin;

    group.current.rotation.y = frame.rotation[1] + yaw.current + settleYaw.current;
    group.current.rotation.x = frame.rotation[0] + lean * 0.4;
    group.current.rotation.z = frame.rotation[2] - lean * 0.25;
  });

  return (
    <group ref={group}>
      <mesh geometry={bodyGeo} material={bodyMat} castShadow />
      <mesh
        geometry={wrapGeo}
        position={[0, CAN_WRAP.y, 0]}
        material={wrapMat}
        castShadow
        receiveShadow
      />
      <mesh geometry={hardwareGeo} material={hardwareMat} castShadow />
      <mesh position={[0, 0.602, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.205, 0.01, 12, 64]} />
        <meshStandardMaterial color="#e0b84a" metalness={1} roughness={0.22} envMapIntensity={0.55} />
      </mesh>
    </group>
  );
}

function AdaptiveCamera({ frame }: { frame: ReturnType<typeof frameForViewport> }) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.position.set(...frame.camera);
    camera.fov = frame.fov;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, frame, size.width, size.height]);

  return null;
}

/**
 * Stable studio kit — env colors only change when settled.
 * Mid-orbit Lightformer swaps were flashing speculars on the can body.
 */
function StudioLights({ kindRef, morphRef }: { kindRef: MutableRefObject<CanLabelKind>; morphRef: MutableRefObject<number> }) {
  const kickRef = useRef<DirectionalLight>(null);
  const spotRef = useRef<SpotLight>(null);
  const settled = useRef<CanLabelKind>(kindRef.current);
  const [bounce, setBounce] = useState(STAGE[kindRef.current].bounce);
  const [kick, setKick] = useState(STAGE[kindRef.current].kick);

  useFrame(() => {
    // Only commit flavor lighting after the orbit finishes.
    if (morphRef.current > 0.02) return;
    const target = kindRef.current;
    if (target === settled.current) return;
    settled.current = target;
    const stage = STAGE[target];
    setBounce(stage.bounce);
    setKick(stage.kick);
    if (kickRef.current) kickRef.current.color.set(stage.kick);
    if (spotRef.current) spotRef.current.color.set(stage.fill);
  });

  const stage = STAGE[settled.current];

  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight
        position={[2.8, 5.2, 3.2]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff8f0"
      />
      <directionalLight ref={kickRef} position={[-3.5, 1.8, -1.5]} intensity={0.4} color={stage.kick} />
      <spotLight
        ref={spotRef}
        position={[0, 4.5, 2]}
        angle={0.45}
        penumbra={0.75}
        intensity={0.85}
        color={stage.fill}
      />
      <Environment resolution={128} environmentIntensity={0.55}>
        <Lightformer intensity={2.4} position={[0, 5, 0]} scale={[12, 1.2, 1]} form="rect" color="#ffffff" />
        <Lightformer intensity={1.1} position={[-6, 1, 1]} scale={[3, 8, 1]} form="rect" color="#ffffff" />
        <Lightformer intensity={0.7} position={[6, 0.5, 2]} scale={[3, 7, 1]} form="rect" color={kick} />
        <Lightformer intensity={0.45} position={[0, -2, -4]} scale={[10, 4, 1]} color={bounce} />
      </Environment>
    </>
  );
}

function StudioShadows({
  kindRef,
  morphRef,
  shadowY,
}: {
  kindRef: MutableRefObject<CanLabelKind>;
  morphRef: MutableRefObject<number>;
  shadowY: number;
}) {
  const [color, setColor] = useState(STAGE[kindRef.current].shadow);
  const [opacity, setOpacity] = useState(kindRef.current === "lemon" ? 0.35 : 0.5);

  useFrame(() => {
    if (morphRef.current > 0.02) return;
    const target = kindRef.current;
    const next = STAGE[target].shadow;
    const nextOp = target === "lemon" ? 0.35 : 0.5;
    if (color !== next) setColor(next);
    if (opacity !== nextOp) setOpacity(nextOp);
  });

  return (
    <ContactShadows
      position={[0, shadowY, 0]}
      opacity={opacity}
      scale={8}
      blur={2.6}
      far={4.5}
      color={color}
    />
  );
}

function Rig({
  kindRef,
  spinning,
  reducedMotion,
}: {
  kindRef: MutableRefObject<CanLabelKind>;
  spinning: boolean;
  reducedMotion: boolean;
}) {
  const { size } = useThree();
  const morphRef = useRef(0);
  const frame = useMemo(
    () => frameForViewport(size.width, size.height),
    [size.width, size.height],
  );

  return (
    <>
      <AdaptiveCamera frame={frame} />
      <StudioLights kindRef={kindRef} morphRef={morphRef} />
      <ShowcaseCan
        kindRef={kindRef}
        spinning={spinning}
        frame={frame}
        morphRef={morphRef}
        reducedMotion={reducedMotion}
      />
      <StudioShadows kindRef={kindRef} morphRef={morphRef} shadowY={frame.shadowY} />
    </>
  );
}

export function ProductLineCanvas({
  kind,
  reducedMotion = false,
}: {
  kind: CanLabelKind;
  reducedMotion?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const kindRef = useRef<CanLabelKind>(kind);
  const [inView, setInView] = useState(true);
  const [soft, setSoft] = useState(false);
  kindRef.current = kind;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    setSoft(window.matchMedia("(pointer: coarse)").matches);
    const io = new IntersectionObserver(
      ([entry]) =>
        setInView(Boolean(entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.05)),
      { threshold: [0, 0.05, 0.2] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="product-line-canvas">
      <Canvas
        camera={{ position: [0, 0.05, 4.55], fov: 34 }}
        dpr={soft ? 1 : [1, 1.6]}
        frameloop={inView ? "always" : "never"}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: !soft,
          alpha: true,
          powerPreference: soft ? "low-power" : "high-performance",
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Rig
            kindRef={kindRef}
            spinning={!reducedMotion && inView}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
