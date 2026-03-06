import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 200;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      sz[i] = Math.random() * 3 + 0.5;

      // Mix between purple, blue and gold
      const type = Math.random();
      if (type < 0.4) {
        // Purple
        col[i * 3] = 0.55 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.3 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
      } else if (type < 0.7) {
        // Gold
        col[i * 3] = 0.95 + Math.random() * 0.05;
        col[i * 3 + 1] = 0.75 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.3 + Math.random() * 0.1;
      } else {
        // Blue
        col[i * 3] = 0.3 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.4 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }

    return [pos, sz, col];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.002;
      posArray[i3] += Math.cos(time * 0.2 + i * 0.15) * 0.001;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.015;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.3,
        color: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#d4a020" : "#3b82f6",
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const orb = orbs[i];
      if (!orb) return;
      child.position.y = orb.position[1] + Math.sin(time * orb.speed + i) * 0.5;
      child.position.x = orb.position[0] + Math.cos(time * orb.speed * 0.7 + i) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

const HeroParticles = () => {
  return (
    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
};

export default HeroParticles;
