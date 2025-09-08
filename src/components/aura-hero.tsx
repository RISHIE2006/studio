'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { random } from '@/lib/utils';

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [random(-5, 5), random(-5, 5), random(-5, 5)],
      scale: random(0.1, 0.5),
      rotation: [random(0, Math.PI), random(0, Math.PI), random(0, Math.PI)],
    }));
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { x, y, z } = new THREE.Vector3(...particle.position);
      
      const time = state.clock.getElapsedTime();
      y -= 0.01;
      if (y < -5) y = 5;

      dummy.position.set(x, y, z);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.rotation.set(
        particle.rotation[0] + time * 0.1,
        particle.rotation[1] + time * 0.1,
        particle.rotation[2] + time * 0.1
      );
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1.5} roughness={0.2} />
    </instancedMesh>
  );
}

export function AuraHero() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#1e3a8a" intensity={2} />
       <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Particles count={150}/>
      </Float>
      <Sparkles count={50} scale={5} size={1} speed={0.5} color="#0ea5e9" />
    </Canvas>
  );
}
