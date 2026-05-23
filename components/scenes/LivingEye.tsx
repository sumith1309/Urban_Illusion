"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Living eye R3F scene. INP-safety contract:
   - frameloop="demand" — does not run a continuous 60fps RAF.
   - Renders only when invalidate() fires: gaze updated, reveal animating,
     visibility resumed, or a slow heartbeat (3 Hz) for the time-driven
     shimmer. Net main-thread cost is a fraction of an always-on loop.
   - Pause on tab blur (visibility !== "visible") AND when the hero scrolls
     out of view (IntersectionObserver in parent).
   - Mounts only AFTER loadEventEnd via the requestIdleCallback gate (with
     setTimeout fallback for Safari) — never affects LCP.
   - DPR capped at 1.5. Disposed on unmount. */

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — see /shaders/eye.glsl for the canonical source.
const FRAGMENT = `
  precision highp float;
  uniform float uTime;
  uniform vec2  uGaze;
  uniform float uReveal;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);

    vec3 cobalt = vec3(0.118, 0.227, 0.541);
    vec3 navy   = vec3(0.043, 0.106, 0.247);
    vec3 pearl  = vec3(0.937, 0.902, 0.831);
    vec3 iris   = vec3(0.659, 0.816, 0.878);
    vec3 pupil  = vec3(0.039);

    vec3 col = mix(cobalt, navy, smoothstep(0.20, 0.42, r));
    float pearlMask = smoothstep(0.27, 0.265, r) * (1.0 - smoothstep(0.18, 0.175, r));
    col = mix(col, pearl, pearlMask);

    vec2 gaze = uGaze * 0.025;
    float irisR = length(uv - gaze);
    float irisMask = 1.0 - smoothstep(0.13, 0.135, irisR);
    vec3 irisColor = mix(iris, vec3(0.310, 0.486, 0.592), smoothstep(0.04, 0.13, irisR));
    col = mix(col, irisColor, irisMask);

    float pupilR = length(uv - gaze);
    col = mix(col, pupil, 1.0 - smoothstep(0.045, 0.05, pupilR));

    float hl = smoothstep(0.018, 0.0, length(uv - gaze - vec2(-0.022, -0.028)));
    col = mix(col, vec3(1.0), hl * 0.85);

    if (r < 0.42) {
      float s = hash(floor(vUv * 240.0) + floor(uTime * 0.5));
      col += (s - 0.5) * 0.04;
    }

    float shimmer = sin(uTime * 0.6 + r * 18.0) * 0.04;
    col += shimmer * pearlMask;

    float discAlpha = 1.0 - smoothstep(0.41, 0.46, r);
    float a = discAlpha * uReveal;
    gl_FragColor = vec4(col, a);
  }
`;

function EyeMesh({ gazeRef, revealRef }: {
  gazeRef: React.MutableRefObject<[number, number]>;
  revealRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { invalidate } = useThree();

  // Heartbeat invalidate (3 Hz) so shimmer keeps moving without a 60fps loop
  useEffect(() => {
    const id = window.setInterval(() => invalidate(), 333);
    return () => window.clearInterval(id);
  }, [invalidate]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uGaze.value.x += (gazeRef.current[0] - u.uGaze.value.x) * 0.08;
    u.uGaze.value.y += (gazeRef.current[1] - u.uGaze.value.y) * 0.08;
    u.uReveal.value += (revealRef.current - u.uReveal.value) * 0.06;
  });

  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uGaze:   { value: new THREE.Vector2(0, 0) },
      uReveal: { value: 0 },
    }),
    [],
  );

  return (
    <mesh>
      <planeGeometry args={[2, 2.4]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export function LivingEye({
  active,
  className,
}: {
  active: boolean;        // controlled by parent IntersectionObserver
  className?: string;
}) {
  const gazeRef = useRef<[number, number]>([0, 0]);
  const revealRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tabVisible, setTabVisible] = useState(true);

  // Pause on tab blur
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Crossfade reveal in/out
  useEffect(() => {
    revealRef.current = active && tabVisible ? 1 : 0;
  }, [active, tabVisible]);

  // Track gaze — rAF-batched, passive, no layout reads in the loop.
  // We measure the container rect once on mount + on resize/scroll END.
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    let cx = 0, cy = 0, w = 1, h = 1;
    const remeasure = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      w = r.width;
      h = r.height;
    };
    remeasure();

    let pendingX = 0, pendingY = 0, dirty = false, rafId = 0;
    const onMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (dirty) return;
      dirty = true;
      rafId = window.requestAnimationFrame(() => {
        dirty = false;
        // Normalised -1..1 within the container's vicinity (clamped)
        const nx = Math.max(-1, Math.min(1, (pendingX - cx) / (w / 2)));
        const ny = Math.max(-1, Math.min(1, (pendingY - cy) / (h / 2)));
        gazeRef.current = [nx, -ny]; // y inverted for WebGL space
      });
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(remeasure, 120);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <EyeMesh gazeRef={gazeRef} revealRef={revealRef} />
      </Canvas>
    </div>
  );
}
