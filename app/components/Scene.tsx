'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const works = [
  '/work/002-real-estate-ig-feed.jpg',
  '/work/004-fha-vs-conventional.jpg',
  '/work/010-skincare-myths-or-facts.jpg',
  '/work/013-if-you-could-only-pick-one.jpg',
  '/work/015-happy-easter.jpg',
  '/work/009-realtor-introduction.jpg',
  '/work/006-just-sold-highlights.jpg',
  '/work/012-nene-chicken.jpg',
  '/work/014-still-thinking-about-this.jpg',
];

const vert = /* glsl */ `
  uniform float uCurl;
  uniform float uScrollVel;
  uniform float uTime;
  varying vec2 vUv;
  varying float vLift;

  void main(){
    vUv = uv;
    vec3 p = position;

    // page-corner curl — right edge lifts toward camera, arched along Y
    float edge = smoothstep(0.45, 1.0, uv.x);
    float arc  = sin(uv.y * 3.14159);
    float lift = edge * edge * arc * uCurl * 0.32;
    p.z += lift;

    // scroll-velocity micro-stretch — felt, not seen
    p.y += -sin(uv.x * 3.14159) * uScrollVel * 0.045;

    // ambient breathing — extremely subtle, only along z, only when curl rests
    float breathe = (1.0 - uCurl) * sin(uTime * 0.6) * 0.004;
    p.z += breathe;

    vLift = lift;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec3 uPaper;
  uniform float uWarmth;
  uniform float uGrain;
  uniform float uCurl;
  varying vec2 vUv;
  varying float vLift;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float vnoise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  // anisotropic fbm — stretched along x to read as paper fibers
  float fbmPaper(vec2 p){
    vec2 q = p * vec2(0.35, 1.0);
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++){
      v += a * vnoise(q);
      q *= 2.07;
      a *= 0.55;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;

    // paper-fold crossfade along a diagonal — soft edge, no dissolve
    float fold = (uv.x * 0.6 + (1.0 - uv.y) * 0.4);
    float prog = smoothstep(0.0, 1.0, uProgress);
    float edge = smoothstep(prog - 0.08, prog + 0.08, fold);

    // slight scale on the incoming texture for a fresh-page feel
    vec2 uvA = (uv - 0.5) * mix(1.0, 0.985, uProgress) + 0.5;
    vec2 uvB = (uv - 0.5) * mix(1.04, 1.0, uProgress) + 0.5;

    vec3 a = texture2D(uTexA, uvA).rgb;
    vec3 b = texture2D(uTexB, uvB).rgb;
    vec3 col = mix(b, a, edge);

    // warm-shadow Portra-style tone bias — only in dark midtones
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 warm = vec3(0.788, 0.643, 0.478);
    float shadowMask = smoothstep(0.6, 0.0, lum);
    col = mix(col, col * warm * 1.55, shadowMask * uWarmth);

    // mild highlight lift, kept neutral
    float hiMask = smoothstep(0.7, 1.0, lum);
    col = mix(col, col * vec3(1.02, 1.01, 0.99), hiMask * 0.5);

    // anisotropic paper-fiber grain composited
    float fiber = fbmPaper(uv * vec2(280.0, 540.0));
    float specks = hash(uv * vec2(1900.0, 2700.0) + uTime * 0.18);
    float paperMix = mix(fiber, specks, 0.25);
    col = mix(col, col * (0.78 + paperMix * 0.42), uGrain);

    // fold-edge crease highlight & shadow as the wipe sweeps
    float crease = 1.0 - smoothstep(0.0, 0.08, abs(fold - prog));
    col += crease * 0.04;
    col -= smoothstep(prog + 0.02, prog + 0.18, fold) * 0.0;
    col *= 1.0 - smoothstep(prog - 0.22, prog - 0.06, fold) * 0.05;

    // page-curl highlight on the right edge — sells the lift
    float liftHi = smoothstep(0.0, 0.45, vLift) * 0.18;
    col += liftHi;
    float liftShadow = smoothstep(0.0, 0.35, uCurl) * smoothstep(0.55, 0.45, vUv.x) * 0.06;
    col -= liftShadow;

    // soft inner vignette for editorial depth
    vec2 c2 = vUv - 0.5;
    float vig = smoothstep(0.85, 0.25, length(c2) * 1.4);
    col *= mix(0.86, 1.0, vig);

    // left-edge fade so hero typography breathes
    float leftFade = smoothstep(0.0, 0.16, vUv.x);
    col = mix(uPaper, col, leftFade);
    float alpha = leftFade;

    // top/bottom feather so plane melts into paper
    alpha *= smoothstep(0.0, 0.05, vUv.y);
    alpha *= smoothstep(0.0, 0.05, 1.0 - vUv.y);

    gl_FragColor = vec4(col, alpha);
  }
`;

function PaperPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const textures = useTexture(works) as THREE.Texture[];
  const { size, viewport } = useThree();

  const idxA = useRef(0);
  const idxB = useRef(1);
  const progress = useRef(0);
  const curl = useRef(0);
  const curlTarget = useRef(0);
  const scrollVel = useRef(0);
  const pointer = useRef(new THREE.Vector2(0, 0));

  const isMobile = size.width < 768;

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.anisotropy = 4;
    });
  }, [textures]);

  useEffect(() => {
    let killed = false;
    let tween: gsap.core.Tween | null = null;
    const cycle = () => {
      if (killed) return;
      tween = gsap.to(progress, {
        current: 1,
        duration: reducedMotion ? 0.2 : 1.05,
        ease: 'power2.inOut',
        onComplete: () => {
          if (killed) return;
          idxA.current = idxB.current;
          idxB.current = (idxB.current + 1) % textures.length;
          progress.current = 0;
        },
      });
    };
    const i = window.setInterval(cycle, reducedMotion ? 6000 : 5000);
    return () => {
      killed = true;
      tween?.kill();
      window.clearInterval(i);
    };
  }, [textures.length, reducedMotion]);

  useFrame((state, delta) => {
    const lenis = (window as unknown as { __lenis?: { velocity: number } }).__lenis;
    const rawVel = lenis ? lenis.velocity : 0;
    const targetVel = Math.max(-1, Math.min(1, rawVel * 0.012));
    scrollVel.current += (targetVel - scrollVel.current) * 0.12;

    pointer.current.lerp(state.pointer, 0.08);

    if (!reducedMotion) {
      const planeCenterX = isMobile ? 0.0 : 0.45;
      const dx = pointer.current.x - planeCenterX;
      const dy = pointer.current.y - 0.0;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / 1.1);
      const rightBias = Math.max(0, pointer.current.x - planeCenterX + 0.1);
      curlTarget.current = Math.min(1, proximity * 0.55 + rightBias * 0.7);
    } else {
      curlTarget.current = 0;
    }
    curl.current += (curlTarget.current - curl.current) * 0.08;

    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value += delta;
      u.uProgress.value = progress.current;
      u.uTexA.value = textures[idxA.current];
      u.uTexB.value = textures[idxB.current];
      u.uCurl.value = curl.current;
      u.uScrollVel.value = scrollVel.current;
    }
  });

  const planeWidth = isMobile
    ? Math.min(viewport.width * 0.78, 2.2)
    : Math.min(Math.max(viewport.width * 0.42, 1.35), 1.85);
  const planeSize: [number, number] = [planeWidth, planeWidth];

  const halfVW = viewport.width / 2;
  const halfPW = planeWidth / 2;
  // desktop: sit just right of viewport center, near the headline's trailing edge
  // mobile: dead-center horizontally, sit in lower third
  const posX = isMobile ? 0 : Math.min(halfVW - halfPW - 0.25, halfPW * 0.55);
  const posY = isMobile ? -viewport.height * 0.22 : 0;

  return (
    <mesh ref={meshRef} position={[posX, posY, 0]} rotation={[0, -0.08, 0]}>
      <planeGeometry args={[planeSize[0], planeSize[1], 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uTexA: { value: textures[0] },
          uTexB: { value: textures[1] },
          uPaper: { value: new THREE.Color('#F4F1EA') },
          uWarmth: { value: 0.12 },
          uGrain: { value: 0.18 },
          uCurl: { value: 0 },
          uScrollVel: { value: 0 },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function PaperBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh position={[0, 0, -2]} scale={14}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          precision highp float;
          uniform float uTime;
          varying vec2 vUv;
          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float vnoise(vec2 p){
            vec2 i=floor(p), f=fract(p);
            float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
            vec2 u=f*f*(3.-2.*f);
            return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
          }
          void main(){
            vec3 paper = vec3(0.957, 0.945, 0.918);
            vec3 warm  = vec3(0.929, 0.898, 0.844);
            vec3 deep  = vec3(0.898, 0.860, 0.802);

            // warm bias toward bottom-right where the page sits
            vec2 c = vUv - vec2(0.74, 0.42);
            float r = length(c * vec2(1.15, 1.0));
            vec3 col = mix(paper, warm, smoothstep(0.0, 0.55, r));
            col = mix(col, deep, smoothstep(0.55, 1.05, r) * 0.55);

            // soft halo where hero copy lives — lifts type off paper
            float hl = smoothstep(0.0, 0.55, 0.55 - length(vUv - vec2(0.2, 0.62)));
            col += hl * 0.02;

            // anisotropic paper-fiber backdrop noise — very subtle
            float fiber = vnoise(vec2(vUv.x * 80.0, vUv.y * 240.0));
            col = mix(col, col * (0.94 + fiber * 0.06), 0.45);

            // ultra-fine grain
            float g = hash(vUv * 2400.0 + uTime * 0.4);
            col += (g - 0.5) * 0.012;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.2], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <PaperBackdrop />
          <PaperPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}
