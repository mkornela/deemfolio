import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const COUNT = 220;

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!ref.current || reduced) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      arr[ix] += velocities[ix] + Math.sin(t * 0.12 + i) * 0.0004;
      arr[ix + 1] += velocities[ix + 1] + Math.cos(t * 0.1 + i) * 0.0004;
      arr[ix + 2] += velocities[ix + 2];

      const dist = Math.sqrt(arr[ix] ** 2 + arr[ix + 1] ** 2 + arr[ix + 2] ** 2);
      if (dist > 9) {
        arr[ix] *= 0.7;
        arr[ix + 1] *= 0.7;
        arr[ix + 2] *= 0.7;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.02 + pointer.x * 0.04;
    ref.current.rotation.x = pointer.y * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7c8aff"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

function FloatingShape({
  geometry,
  color,
  position,
  rotationSpeed,
  scale,
}: {
  geometry: React.ReactNode;
  color: string;
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    if (!reduced) {
      ref.current.rotation.x += rotationSpeed[0] * 0.01;
      ref.current.rotation.y += rotationSpeed[1] * 0.01;
      ref.current.rotation.z += rotationSpeed[2] * 0.01;
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.2;
      ref.current.position.x = position[0] + pointer.x * 0.25;
      ref.current.position.z = position[2] + pointer.y * 0.18;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.18}
        wireframe
      />
    </mesh>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1;
    ref.current.rotation.y = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={ref}>
      {[1.2, 1.6, 2.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[r, 0.015, 16, 100]} />
          <meshBasicMaterial color={i === 1 ? '#f0a8c0' : '#7c8aff'} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles />
      <Rings />
      <FloatingShape
        geometry={<icosahedronGeometry args={[1, 0]} />}
        color="#7c8aff"
        position={[2.8, 0.6, -1.2]}
        rotationSpeed={[0.5, 0.7, 0.3]}
        scale={0.55}
      />
      <FloatingShape
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#f0a8c0"
        position={[-2.4, -0.4, -0.8]}
        rotationSpeed={[0.6, 0.4, 0.5]}
        scale={0.5}
      />
      <FloatingShape
        geometry={<octahedronGeometry args={[1, 0]} />}
        color="#a78bfa"
        position={[0.6, -1.4, -2.2]}
        rotationSpeed={[0.4, 0.6, 0.4]}
        scale={0.45}
      />
    </>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_60%)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(3,3,8,0.8)_100%)]" />
    </div>
  );
}
