import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Node {
  id: string;
  position: [number, number, number];
  skill: string;
  level: number;
}

const mockNodes: Node[] = [
  { id: '1', position: [0, 0, 0], skill: 'Python', level: 5 },
  { id: '2', position: [2, 1, 1], skill: 'Machine Learning', level: 4 },
  { id: '3', position: [-2, -1, 1], skill: 'Data Science', level: 3 },
  { id: '4', position: [1, -2, -1], skill: 'AWS', level: 4 },
  { id: '5', position: [-1, 2, -1], skill: 'Deep Learning', level: 2 },
];

function Node({ position, skill }: { position: [number, number, number]; skill: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#1e40af"
        anchorX="center"
        anchorY="middle"
      >
        {skill}
      </Text>
    </group>
  );
}

function SkillCluster() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-primary-50 to-white rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {mockNodes.map((node) => (
          <Node key={node.id} position={node.position} skill={node.skill} />
        ))}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default SkillCluster;