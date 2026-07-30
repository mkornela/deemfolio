import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const techs = [
  { label: 'React', color: '#7c8aff', lat: 30, lng: -80 },
  { label: 'Node.js', color: '#6ee7b7', lat: -20, lng: -40 },
  { label: 'Express', color: '#6ee7b7', lat: -40, lng: -70 },
  { label: 'Go', color: '#a78bfa', lat: 50, lng: 100 },
  { label: 'Python', color: '#f0a8c0', lat: -50, lng: 120 },
  { label: 'Three.js', color: '#7c8aff', lat: 20, lng: 160 },
  { label: 'SQLite', color: '#a78bfa', lat: -10, lng: 20 },
  { label: 'Tailwind', color: '#7c8aff', lat: 60, lng: -30 },
  { label: 'Framer', color: '#f0a8c0', lat: -60, lng: -60 },
  { label: 'R3F', color: '#7c8aff', lat: 70, lng: 150 },
  { label: 'Wails', color: '#a78bfa', lat: -30, lng: -110 },
  { label: 'tmi.js', color: '#6ee7b7', lat: 10, lng: -150 },
];

const R = 2.2;

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = lng * (Math.PI / 180);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeInner() {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const reduced = useReducedMotion();
  const targetRotation = useRef(0);

  const markers = useMemo(
    () =>
      techs.map((t) => ({
        ...t,
        pos: latLngToVec3(t.lat, t.lng, R),
      })),
    []
  );

  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    for (let phi = -60; phi <= 60; phi += 30) {
      const pts: THREE.Vector3[] = [];
      for (let theta = 0; theta <= 360; theta += 6) {
        const rad = phi * (Math.PI / 180);
        const t = theta * (Math.PI / 180);
        pts.push(
          new THREE.Vector3(
            R * Math.cos(rad) * Math.cos(t),
            R * Math.sin(rad),
            R * Math.cos(rad) * Math.sin(t)
          )
        );
      }
      lines.push(pts);
    }

    for (let theta = 0; theta < 360; theta += 30) {
      const pts: THREE.Vector3[] = [];
      for (let phi = -90; phi <= 90; phi += 4) {
        const rad = phi * (Math.PI / 180);
        const t = theta * (Math.PI / 180);
        pts.push(
          new THREE.Vector3(
            R * Math.cos(rad) * Math.cos(t),
            R * Math.sin(rad),
            R * Math.cos(rad) * Math.sin(t)
          )
        );
      }
      lines.push(pts);
    }

    return lines;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (reduced) {
      groupRef.current.rotation.y += delta * 0.08;
      return;
    }

    const target = pointer.x * 0.3;
    targetRotation.current += (target - targetRotation.current) * 0.02;
    groupRef.current.rotation.y += delta * 0.15 + targetRotation.current * delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      {gridLines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#7c8aff"
          opacity={0.15}
          transparent
          lineWidth={0.5}
        />
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R + 0.05, R + 0.12, 64]} />
        <meshBasicMaterial color="#7c8aff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      <mesh>
        <sphereGeometry args={[R * 0.3, 16, 16]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.06} />
      </mesh>

      {markers.map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh>
            <ringGeometry args={[0.12, 0.22, 16]} />
            <meshBasicMaterial
              color={m.color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={m.color} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial color={m.color} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}

      {markers.map((m, i) => (
        <Text
          key={`label-${i}`}
          position={m.pos.clone().multiplyScalar(1.35)}
          fontSize={0.12}
          color={m.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#030308"
        >
          {m.label}
        </Text>
      ))}
    </group>
  );
}

export default function TechGlobe() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/50">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={reduced ? [1, 1] : [1, 1.5]}
        gl={{ antialias: false }}
      >
        <ambientLight intensity={0.3} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
        <GlobeInner />
      </Canvas>
    </div>
  );
}
