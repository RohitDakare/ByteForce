import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Preload, Center, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from './ErrorBoundary';

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

// Create a semi-transparent loading box
function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
    </mesh>
  );
}

// Loading screen with progress and error handling
function LoadingScreen() {
  const { active, progress, errors } = useProgress();
  
  if (!active && errors.length === 0) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-primary-50 bg-opacity-75">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-primary-900">Loading visualization... {progress.toFixed(0)}%</p>
        {errors.length > 0 && (
          <p className="text-red-600 mt-2">Error loading assets. Please try again.</p>
        )}
      </div>
    </div>
  );
}

// Skill node with loading states and animations
function Node({ position, skill, level }: { position: [number, number, number]; skill: string; level: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const { camera } = useThree();
  const [isReady, setIsReady] = useState(false);
  const [isTextLoaded, setIsTextLoaded] = useState(false);

  // Handle text loading
  useEffect(() => {
    if (textRef.current) {
      const loadText = async () => {
        try {
          await textRef.current.sync();
          setIsTextLoaded(true);
          // Only set ready when both mesh and text are loaded
          if (meshRef.current) {
            setIsReady(true);
          }
        } catch (error) {
          console.error('Error loading text:', error);
        }
      };
      loadText();
    }
  }, []);

  // Update ready state when mesh is available
  useEffect(() => {
    if (meshRef.current && isTextLoaded) {
      setIsReady(true);
    }
  }, [meshRef.current, isTextLoaded]);

  // Handle animations
  useFrame((state) => {
    if (meshRef.current && isReady) {
      // Gentle floating animation based on skill level
      meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * level * 0.2) * 0.002;
      // Rotation speed based on skill level
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1 * (level / 3);
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1 * (level / 3);

      // Make text always face camera
      if (textRef.current) {
        textRef.current.lookAt(camera.position);
      }
    }
  });

  const scale = 0.2 + (level * 0.08); // Scale based on skill level

  return (
    <group position={position}>
      <Suspense fallback={<LoadingBox />}>
        <mesh ref={meshRef} scale={[scale, scale, scale]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color="#3b82f6"
            roughness={0.3}
            metalness={0.7}
            emissive="#1d4ed8"
            emissiveIntensity={0.2 * (level / 3)}
            transparent
            opacity={isReady ? 1 : 0.5}
          />
        </mesh>
        <Center>
          <Text
            ref={textRef}
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="#1e40af"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            outlineWidth={0.02}
            outlineColor="#ffffff"
            characters={skill} // Only preload needed characters
          >
            {skill}
          </Text>
        </Center>
      </Suspense>
    </group>
  );
}

// Scene with preloading and asset management
function Scene() {
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Pre-warm the scene and preload assets
  useEffect(() => {
    const preloadScene = async () => {
      try {
        // Create a temporary renderer for pre-warming
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(1, 1);
        
        // Create a temporary scene and camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        
        // Add some basic geometry to warm up the GPU
        const geometry = new THREE.OctahedronGeometry(0.3);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Render once to warm up
        renderer.render(scene, camera);
        
        // Clean up
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        
        // Mark as preloaded
        setIsPreloaded(true);
      } catch (error) {
        console.error('Error pre-warming scene:', error);
      }
    };
    preloadScene();
  }, []);

  return (
    <>
      <color attach="background" args={['#f8fafc']} />
      <fog attach="fog" args={['#f8fafc', 10, 20]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Skill nodes */}
      {isPreloaded && mockNodes.map((node) => (
        <Node key={node.id} position={node.position} skill={node.skill} level={node.level} />
      ))}

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Preload all assets */}
      <Preload all />
    </>
  );
}

// Main component with error boundaries and loading states
function SkillCluster() {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-primary-50 to-white rounded-xl overflow-hidden shadow-xl">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]} // Responsive rendering
          shadows
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <div className="absolute inset-0 pointer-events-none" />
      </Suspense>
    </div>
  );
}

export default SkillCluster;