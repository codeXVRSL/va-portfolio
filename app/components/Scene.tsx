'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vDisp;

  float noise(vec3 p){
    return sin(p.x*1.7+uTime*0.4)*sin(p.y*1.3-uTime*0.3)*sin(p.z*1.1+uTime*0.2);
  }

  void main(){
    vUv = uv;
    vec3 pos = position;
    float n = noise(vec3(pos.xy*1.6, uTime*0.2));
    float warp = mix(0.05, 0.42, uProgress);
    pos.z += n * warp;
    vDisp = n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;
  varying float vDisp;

  float parabola(float x, float k){
    return pow(4.0 * x * (1.0 - x), k);
  }

  void main(){
    float t = vUv.y + vDisp*0.25 + sin(uTime*0.15)*0.05;
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, t));
    col = mix(col, uColorC, smoothstep(0.55, 1.0, t + vDisp*0.4));

    float dt = parabola(uProgress, 1.2);
    float bands = sin((vUv.y + vDisp*0.4)*42.0 + uTime*0.2) * 0.5 + 0.5;
    col = mix(col, col * (0.85 + bands*0.18), 0.55 + dt*0.35);

    float vig = smoothstep(1.3, 0.2, length(vUv - 0.5)*1.6);
    col *= mix(0.85, 1.0, vig);

    float grain = fract(sin(dot(vUv*1024.0, vec2(12.9898,78.233)))*43758.5453);
    col += (grain - 0.5) * 0.04;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (!matRef.current) return;
    const tween = gsap.to(matRef.current.uniforms.uProgress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-0.18, 0, 0]}>
      <planeGeometry args={[6, 6, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uColorA: { value: new THREE.Color('#EFEAE0') },
          uColorB: { value: new THREE.Color('#C66B3D') },
          uColorC: { value: new THREE.Color('#0B0B0A') },
        }}
        wireframe={false}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 3.2], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Plane />
        </Suspense>
      </Canvas>
    </div>
  );
}
