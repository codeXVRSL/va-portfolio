'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
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
];

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uTransition;
  uniform float uScroll;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vDisp;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
  }

  float parabola(float x, float k){ return pow(4.0 * x * (1.0 - x), k); }

  void main(){
    vUv = uv;
    vec3 pos = position;
    float n = noise(pos.xy * 2.5 + uTime * 0.15);
    float peak = parabola(uTransition, 1.6);
    float warp = peak * 0.55 + sin(uTime * 0.25) * 0.015;
    pos.z += (n - 0.5) * warp;
    pos.x += uPointer.x * 0.04;
    pos.y += uPointer.y * 0.04 - uScroll * 0.35;
    vDisp = n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uTransition;
  uniform float uScroll;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec3 uAccent;
  uniform vec3 uPaper;
  varying vec2 vUv;
  varying float vDisp;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

  float parabola(float x, float k){ return pow(4.0 * x * (1.0 - x), k); }

  void main(){
    float t = smoothstep(0.0, 1.0, uTransition);
    float ripple = (vDisp - 0.5) * 0.22 * parabola(uTransition, 1.4);
    vec2 uv = vUv + vec2(ripple);

    float peak = parabola(uTransition, 1.6);
    float shift = peak * 0.012;
    vec3 a;
    a.r = texture2D(uTexA, uv + vec2(shift, 0.0)).r;
    a.g = texture2D(uTexA, uv).g;
    a.b = texture2D(uTexA, uv - vec2(shift, 0.0)).b;
    vec3 b;
    b.r = texture2D(uTexB, uv + vec2(shift, 0.0)).r;
    b.g = texture2D(uTexB, uv).g;
    b.b = texture2D(uTexB, uv - vec2(shift, 0.0)).b;

    float mask = smoothstep(t - 0.18, t + 0.18, vDisp);
    vec3 col = mix(a, b, 1.0 - mask);

    // LED grid overlay — subtle
    float gx = abs(sin(vUv.x * 220.0));
    float gy = abs(sin(vUv.y * 280.0));
    float grid = (1.0 - smoothstep(0.85, 1.0, gx)) * (1.0 - smoothstep(0.85, 1.0, gy));
    col *= mix(0.96, 1.0, grid);

    // grain
    float g = hash(vUv * vec2(1080.0, 1920.0) + uTime);
    col += (g - 0.5) * 0.05;

    // accent rim — left edge picks up brand color subtly
    float rim = smoothstep(0.0, 0.18, vUv.x);
    col = mix(uAccent * 0.5 + col * 0.5, col, rim);

    // vignette
    float v = smoothstep(1.2, 0.3, length(vUv - 0.5) * 1.6);
    col *= mix(0.82, 1.0, v);

    // soft paper fade on left edge — protects readability of hero text
    float leftFade = smoothstep(0.0, 0.45, vUv.x);
    col = mix(uPaper, col, leftFade);
    float alpha = leftFade;

    // gentle fade on top/bottom too so plane breathes into page
    float topFade = smoothstep(0.0, 0.12, vUv.y);
    float botFade = smoothstep(0.0, 0.12, 1.0 - vUv.y);
    alpha *= topFade * botFade;

    gl_FragColor = vec4(col, alpha);
  }
`;

function ContentPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const textures = useTexture(works) as THREE.Texture[];

  const idxA = useRef(0);
  const idxB = useRef(1);
  const transition = useRef(0);
  const scrollRef = useRef(0);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const { size } = useThree();

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  }, [textures]);

  useEffect(() => {
    let killed = false;
    const cycle = () => {
      if (killed) return;
      gsap.to(transition, {
        current: 1,
        duration: 1.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (killed) return;
          idxA.current = idxB.current;
          idxB.current = (idxB.current + 1) % textures.length;
          transition.current = 0;
        },
      });
    };
    const i = window.setInterval(cycle, 3600);
    return () => {
      killed = true;
      window.clearInterval(i);
    };
  }, [textures.length]);

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

  const isMobile = size.width < 768;
  const baseScale = useRef(isMobile ? 0.7 : 0.95);
  const basePosX = useRef(isMobile ? 0.0 : 1.35);
  const basePosY = useRef(isMobile ? -0.7 : 0.15);

  useEffect(() => {
    baseScale.current = isMobile ? 0.7 : 0.95;
    basePosX.current = isMobile ? 0.0 : 1.35;
    basePosY.current = isMobile ? -0.7 : 0.15;
  }, [isMobile]);

  useFrame((state, delta) => {
    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value += delta;
      u.uTransition.value = transition.current;
      u.uScroll.value = scrollRef.current;
      u.uTexA.value = textures[idxA.current];
      u.uTexB.value = textures[idxB.current];
      pointerRef.current.lerp(state.pointer, 0.04);
      u.uPointer.value.copy(pointerRef.current);
    }
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.x = basePosX.current + Math.sin(t * 0.45) * 0.09 + pointerRef.current.x * 0.08;
      meshRef.current.position.y =
        basePosY.current + Math.sin(t * 0.32) * 0.08 + Math.cos(t * 0.22) * 0.04 + pointerRef.current.y * 0.05;
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.04;
      meshRef.current.rotation.y = -0.22 + Math.sin(t * 0.28) * 0.07 + pointerRef.current.x * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 0.18) * 0.04;
      const s = baseScale.current * (1 + Math.sin(t * 0.55) * 0.02);
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, -0.22, 0]}>
      <planeGeometry args={[1.4, 1.75, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uTransition: { value: 0 },
          uScroll: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uTexA: { value: textures[0] },
          uTexB: { value: textures[1] },
          uAccent: { value: new THREE.Color('#C66B3D') },
          uPaper: { value: new THREE.Color('#F4F1EA') },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function AmbientGradient() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh position={[0, 0, -2]} scale={10}>
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
            vec3 cream = vec3(0.937, 0.918, 0.878);
            float r = length(vUv - 0.5);
            vec3 col = mix(paper, cream * 0.94, smoothstep(0.0, 0.85, r));
            float g = hash(vUv * 2048.0 + uTime);
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
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 3.2], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <AmbientGradient />
          <ContentPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}
