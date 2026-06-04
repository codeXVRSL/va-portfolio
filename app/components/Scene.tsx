'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uTransition;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec3 uPaper;
  uniform float uRadius;
  uniform float uAspect;
  uniform float uShadow;
  uniform float uLeftFade;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

  // signed-distance to rounded rectangle in uv space
  float sdRoundedBox(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main(){
    // remap uv so (0,0) is center, normalize for aspect
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec2 half = vec2(uAspect * 0.5, 0.5);

    // outer signed distance — negative inside card, positive outside
    float d = sdRoundedBox(p, half - uRadius, uRadius) - uRadius;

    // card mask with anti-aliased edge
    float aa = fwidth(d) * 1.2;
    float cardMask = 1.0 - smoothstep(-aa, aa, d);

    // soft outer drop-shadow halo
    float shadow = smoothstep(uShadow, 0.0, d) * 0.32;

    // soft mask wipe between A and B, biased by a smooth noise field
    float n = hash(floor(vUv * 8.0));
    n = mix(n, vUv.y, 0.55);
    float wipe = smoothstep(uTransition - 0.22, uTransition + 0.22, n);

    // subtle scale-in feel on incoming texture
    float zoom = mix(1.04, 1.0, smoothstep(0.0, 1.0, uTransition));
    vec2 uvB = (vUv - 0.5) * zoom + 0.5;
    vec2 uvA = (vUv - 0.5) * mix(1.0, 0.98, uTransition) + 0.5;

    vec3 a = texture2D(uTexA, uvA).rgb;
    vec3 b = texture2D(uTexB, uvB).rgb;
    vec3 col = mix(b, a, wipe);

    // soft inner vignette on the card itself for editorial depth
    float r = length((vUv - 0.5) * vec2(uAspect, 1.0));
    col *= mix(1.0, 0.86, smoothstep(0.25, 0.85, r));

    // warm highlight pulled slightly toward center
    col = mix(col, col * vec3(1.05, 1.02, 0.97), 0.18);

    // fine grain
    float g = hash(vUv * vec2(1600.0, 2400.0) + uTime * 0.6);
    col += (g - 0.5) * 0.025;

    // left-edge fade so right-stacked cards don't fight hero text
    float leftFade = smoothstep(0.0, uLeftFade, vUv.x);
    col = mix(uPaper, col, leftFade);

    // composite: paper-tinted shadow halo first, then card on top
    vec3 shadowCol = mix(uPaper, vec3(0.05, 0.045, 0.04), 0.45);
    vec3 outCol = mix(shadowCol, col, cardMask);
    float outA = max(cardMask, shadow) * leftFade;

    gl_FragColor = vec4(outCol, outA);
  }
`;

type CardConfig = {
  size: [number, number];
  position: [number, number, number];
  rotation: number;
  scale: number;
  radius: number;
  shadow: number;
  leftFade: number;
  textureSet: number[];
  cycleMs: number;
  driftAmp: number;
  parallax: number;
};

function Card({
  textures,
  config,
  isMobile,
}: {
  textures: THREE.Texture[];
  config: CardConfig;
  isMobile: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const idxA = useRef(config.textureSet[0]);
  const idxB = useRef(config.textureSet[1 % config.textureSet.length]);
  const cursor = useRef(0);
  const transition = useRef(0);
  const scrollRef = useRef(0);
  const pointerRef = useRef(new THREE.Vector2(0, 0));

  const aspect = config.size[0] / config.size[1];

  useEffect(() => {
    let killed = false;
    const cycle = () => {
      if (killed) return;
      gsap.to(transition, {
        current: 1,
        duration: 1.4,
        ease: 'power3.inOut',
        onComplete: () => {
          if (killed) return;
          idxA.current = idxB.current;
          cursor.current = (cursor.current + 1) % config.textureSet.length;
          idxB.current = config.textureSet[cursor.current];
          transition.current = 0;
        },
      });
    };
    const i = window.setInterval(cycle, config.cycleMs);
    return () => {
      killed = true;
      window.clearInterval(i);
    };
  }, [config.cycleMs, config.textureSet]);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  useFrame((state, delta) => {
    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value += delta;
      u.uTransition.value = transition.current;
      u.uTexA.value = textures[idxA.current];
      u.uTexB.value = textures[idxB.current];
      pointerRef.current.lerp(state.pointer, 0.05);
    }
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      const [px, py, pz] = config.position;
      const drift = config.driftAmp;
      const par = config.parallax;
      const mobileBias = isMobile ? 0.45 : 1.0;

      meshRef.current.position.x =
        px * mobileBias +
        Math.sin(t * 0.32 + py) * drift +
        pointerRef.current.x * par * 0.18;
      meshRef.current.position.y =
        py +
        Math.cos(t * 0.26 + px) * drift * 0.9 +
        pointerRef.current.y * par * 0.14 -
        scrollRef.current * par * 0.9;
      meshRef.current.position.z = pz;

      meshRef.current.rotation.z =
        config.rotation + Math.sin(t * 0.22 + px) * 0.018;
      meshRef.current.rotation.y =
        Math.sin(t * 0.18) * 0.04 + pointerRef.current.x * 0.05 * par;
      meshRef.current.rotation.x =
        Math.cos(t * 0.16) * 0.025 + pointerRef.current.y * 0.04 * par;

      const breathing = 1 + Math.sin(t * 0.5 + py) * 0.012;
      const s = config.scale * (isMobile ? 0.8 : 1.0) * breathing;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[config.size[0], config.size[1], 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uTransition: { value: 0 },
          uTexA: { value: textures[idxA.current] },
          uTexB: { value: textures[idxB.current] },
          uPaper: { value: new THREE.Color('#F4F1EA') },
          uRadius: { value: config.radius },
          uAspect: { value: aspect },
          uShadow: { value: config.shadow },
          uLeftFade: { value: config.leftFade },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Gallery() {
  const textures = useTexture(works) as THREE.Texture[];
  const { size } = useThree();
  const isMobile = size.width < 768;

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.anisotropy = 4;
    });
  }, [textures]);

  const cards = useMemo<CardConfig[]>(
    () => [
      // foreground hero card — biased right, largest, most visible
      {
        size: [1.05, 1.32],
        position: [1.55, 0.12, 0.55],
        rotation: -0.06,
        scale: 1.0,
        radius: 0.06,
        shadow: 0.22,
        leftFade: 0.18,
        textureSet: [0, 3, 5, 7],
        cycleMs: 4200,
        driftAmp: 0.05,
        parallax: 1.0,
      },
      // mid card — upper-right, smaller, slight tilt right
      {
        size: [0.78, 0.98],
        position: [2.15, 0.95, -0.05],
        rotation: 0.11,
        scale: 0.78,
        radius: 0.07,
        shadow: 0.28,
        leftFade: 0.04,
        textureSet: [1, 4, 8, 2],
        cycleMs: 5400,
        driftAmp: 0.07,
        parallax: 0.55,
      },
      // back card — lower-right, smallest, biggest tilt, most recessed
      {
        size: [0.7, 0.88],
        position: [1.25, -1.05, -0.6],
        rotation: 0.18,
        scale: 0.7,
        radius: 0.08,
        shadow: 0.36,
        leftFade: 0.08,
        textureSet: [2, 6, 0, 4],
        cycleMs: 6200,
        driftAmp: 0.06,
        parallax: 0.32,
      },
    ],
    [],
  );

  return (
    <group>
      {cards.map((c, i) => (
        <Card key={i} textures={textures} config={c} isMobile={isMobile} />
      ))}
    </group>
  );
}

function AmbientBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh position={[0, 0, -2]} scale={12}>
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
          void main(){
            vec3 paper = vec3(0.957, 0.945, 0.918);
            vec3 warm  = vec3(0.929, 0.898, 0.844);
            vec3 deep  = vec3(0.902, 0.866, 0.810);

            // soft warm bias toward bottom-right where the cards live
            vec2 c = vUv - vec2(0.72, 0.42);
            float r = length(c * vec2(1.2, 1.0));
            vec3 col = mix(paper, warm, smoothstep(0.0, 0.55, r));
            col = mix(col, deep, smoothstep(0.55, 1.0, r) * 0.7);

            // sweeping highlight near hero text — subtle
            float hl = smoothstep(0.0, 0.55, 0.55 - length(vUv - vec2(0.18, 0.62)));
            col += hl * 0.018;

            // ultra-fine paper grain
            float g = hash(vUv * 2400.0 + uTime * 0.4);
            col += (g - 0.5) * 0.014;

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
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 3.4], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <AmbientBackdrop />
          <Gallery />
        </Suspense>
      </Canvas>
    </div>
  );
}
