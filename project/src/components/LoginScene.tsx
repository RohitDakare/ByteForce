import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LoginScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Slow rotation
      groupRef.current.rotation.y += 0.005;
    }

    if (cardRef.current) {
      // Card pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      cardRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glowing card */}
      <mesh ref={cardRef} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshPhongMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.5}
          shininess={50}
        />
      </mesh>

      {/* Decorative particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const theta = (i / 20) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const y = (Math.random() - 0.5) * 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05]} />
            <meshPhongMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default LoginScene;
