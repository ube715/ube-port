"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/CinematicLayer.module.css';

export default function CinematicLayer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const particlesCount = 260;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const basePositions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const phases = new Float32Array(particlesCount);
    const amplitudes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i += 1) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 18;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      phases[i] = Math.random() * Math.PI * 2;
      amplitudes[i] = Math.random() * 0.24 + 0.08;

      const isWarm = Math.random() > 0.4;
      const c = isWarm ? new THREE.Color(0xffb36a) : new THREE.Color(0xf9f9ff);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, material);
    scene.add(particles);

    camera.position.set(0, 0, 10);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      particles.rotation.y = elapsed * 0.02;
      particles.position.y = Math.sin(elapsed * 0.4) * 0.18;

      const positionsArray = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i += 1) {
        const idx = i * 3;
        const wave = Math.sin(elapsed * 0.4 + phases[i]) * amplitudes[i];
        positionsArray[idx] = basePositions[idx] + Math.cos(elapsed * 0.16 + phases[i]) * amplitudes[i] * 0.45;
        positionsArray[idx + 1] = basePositions[idx + 1] + wave;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className={styles.canvasWrapper} ref={mountRef} />;
}
