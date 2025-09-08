'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HighwayAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const lines = [];
    const lineCount = 50;

    for (let i = 0; i < lineCount; i++) {
      const geometry = new THREE.PlaneGeometry(0.1, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffb347,
        side: THREE.DoubleSide,
      });
      const line = new THREE.Mesh(geometry, material);
      line.position.x = (Math.random() - 0.5) * 20;
      line.position.y = (Math.random() - 0.5) * 10;
      line.position.z = (Math.random() - 1) * 10;
      lines.push(line);
      scene.add(line);
    }

    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      lines.forEach((line) => {
        line.position.z += 0.1;
        if (line.position.z > 5) {
          line.position.z = -10;
          line.position.x = (Math.random() - 0.5) * 20;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.children.forEach(child => {
        if(child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 -z-10 h-full w-full opacity-20"
    />
  );
}
