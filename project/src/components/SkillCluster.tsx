import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface SkillNodeProps {
  position: THREE.Vector3;
  skill: {
    id: number;
    name: string;
    level: number;
    visual: {
      scale: number;
      emissiveIntensity: number;
      rotationSpeed: number;
      floatIntensity: number;
    };
  };
}

const SkillNode: React.FC<SkillNodeProps> = ({ position, skill }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      // Rotation animation based on skill level
      meshRef.current.rotation.x += 0.01 * skill.visual.rotationSpeed;
      meshRef.current.rotation.y += 0.01 * skill.visual.rotationSpeed;

      // Floating animation with intensity based on skill level
      const floatY = Math.sin(state.clock.elapsedTime + floatOffset.current) * skill.visual.floatIntensity;
      meshRef.current.position.y = position.y + floatY;
      textRef.current.position.y = position.y + floatY + 1.2;

      // Billboard text (always face camera)
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[skill.visual.scale, 0]} />
        <meshPhongMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={skill.visual.emissiveIntensity}
          shininess={50}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[position.x, position.y + 1.2, position.z]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`${skill.name} (${skill.level})`}
      </Text>
    </>
  );
};

const SkillCluster: React.FC = () => {
  const { skills, loading, error, refreshSkills } = useApp();

  // Calculate positions in a spherical arrangement
  const getSkillPositions = (skills: any[]) => {
    return skills.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const radius = 3;

      return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur rounded-lg">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading Skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900/20 backdrop-blur rounded-lg">
        <div className="text-center text-red-100 p-8">
          <h3 className="text-xl font-bold mb-2">Error Loading Skills</h3>
          <p>{error}</p>
          <button
            onClick={() => refreshSkills()}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const positions = getSkillPositions(skills);

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <fog attach="fog" args={['#000', 5, 15]} />
        
        {skills.map((skill, index) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            position={positions[index]}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SkillCluster;