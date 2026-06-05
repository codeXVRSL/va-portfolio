'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform float uVel;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform vec3  uPaper;
  uniform vec3  uWarm;
  uniform vec3  uShadow;
  uniform vec3  uClay;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);

    // pure paper base
    vec3 col = uPaper;

    // ONE slow drifting warm wash, anchored upper-right
    float t = uTime * 0.025;
    vec2 c1 = vec2(0.78 + sin(t * 0.6) * 0.04, 0.34 + cos(t * 0.7) * 0.03);
    float warmD = length((uv - c1) * vec2(1.1, 1.0));
    float warmGlow = smoothstep(0.85, 0.15, warmD);
    col = mix(col, uWarm, warmGlow * 0.55);

    // single soft clay caustic — barely there, far upper-right corner
    vec2 c2 = vec2(0.92, 0.88);
    float clayD = length((uv - c2) * vec2(1.3, 1.0));
    float clay = smoothstep(0.55, 0.0, clayD);
    col = mix(col, uClay, clay * 0.07);

    // mouse-follow whisper — luxury parallax sheen
    vec2 mp = (uMouse - 0.5) * vec2(aspect, 1.0);
    vec2 pp = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float mouseGlow = smoothstep(0.7, 0.0, length(pp - mp));
    col = mix(col, uPaper * 1.04, mouseGlow * 0.12);

    // scroll-velocity warm pulse — only blooms when fling-scrolling
    float velPulse = clamp(abs(uVel) * 0.4, 0.0, 0.18);
    col = mix(col, uWarm, velPulse);

    // anisotropic paper-fiber — drifts slightly with scroll
    vec2 fp = vec2(uv.x * 110.0, uv.y * 320.0 + uScroll * 30.0);
    float fiber = vnoise(fp);
    col = mix(col, col * (0.96 + fiber * 0.04), 0.4);

    // ultra-fine animated grain
    float gr = hash(uv * 2400.0 + uTime * 0.42);
    col += (gr - 0.5) * 0.012;

    // soft top-bottom feather
    float topFade = smoothstep(0.0, 0.04, uv.y);
    float botFade = smoothstep(0.0, 0.04, 1.0 - uv.y);
    col = mix(uShadow, col, min(topFade, botFade) * 0.5 + 0.5);

    // gentle vignette
    float vig = smoothstep(1.35, 0.35, length((uv - 0.5) * vec2(0.95, 1.05)));
    col = mix(uShadow, col, mix(0.85, 1.0, vig));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function PaperBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const scrollY = useRef(0);
  const vel = useRef(0);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVel: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPaper: { value: new THREE.Color('#F6F1E6') },
      uWarm: { value: new THREE.Color('#EFE2C9') },
      uShadow: { value: new THREE.Color('#DDCBAF') },
      uClay: { value: new THREE.Color('#C66B3D') },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;

    const lenis = (window as unknown as {
      __lenis?: { scroll: number; velocity: number };
    }).__lenis;
    const targetScroll = lenis ? lenis.scroll / Math.max(window.innerHeight, 1) : 0;
    scrollY.current += (targetScroll - scrollY.current) * 0.08;
    u.uScroll.value = scrollY.current;

    const targetVel = lenis ? Math.max(-1, Math.min(1, lenis.velocity * 0.005)) : 0;
    vel.current += (targetVel - vel.current) * 0.1;
    u.uVel.value = vel.current;

    mouseTarget.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    mouse.current.lerp(mouseTarget.current, 0.04);
    u.uMouse.value.copy(mouse.current);

    const { width, height } = state.size;
    u.uRes.value.set(width, height);
  });

  return (
    <mesh position={[0, 0, -1]} scale={20}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <PaperBackdrop />
        </Suspense>
      </Canvas>
    </div>
  );
}
