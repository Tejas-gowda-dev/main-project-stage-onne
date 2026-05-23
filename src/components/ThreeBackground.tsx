import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. Neon Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 1.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3B82F6, 4, 100);
    blueLight.position.set(-20, 10, 15);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x8B5CF6, 4, 100);
    purpleLight.position.set(20, -10, 15);
    scene.add(purpleLight);

    // 3. Central Glowing Torus Knot Geometry
    const torusKnotGeo = new THREE.TorusKnotGeometry(8, 2.2, 150, 16, 3, 4);
    
    // Core glowing wireframe
    const torusKnotMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    scene.add(torusKnot);

    // Outer subtle neon overlay for deep neon simulation
    const torusKnotOuterMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const torusKnotOuter = new THREE.Mesh(torusKnotGeo, torusKnotOuterMat);
    torusKnotOuter.scale.set(1.03, 1.03, 1.03);
    scene.add(torusKnotOuter);

    // 4. Circuit Particle Field Setup (3000+ points)
    const particleCount = 3200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    const colorBlue = new THREE.Color(0x3B82F6);
    const colorCyan = new THREE.Color(0x00FFFF);
    const colorPurple = new THREE.Color(0x8B5CF6);

    for (let i = 0; i < particleCount; i++) {
      // Form a sphere / neural shell cluster
      const radius = 30 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign dynamic colored gradients across particles
      const randomValue = Math.random();
      const chosenColor = randomValue < 0.45 ? colorBlue : randomValue < 0.8 ? colorCyan : colorPurple;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      // Set drift speed velocities
      velocities.push(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015
      );
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circle shader texture simulation so particles are perfectly round and glowing
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(0,255,255,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 5. Connecting Lines (Sparse grid neural network / circuit boards lines)
    // To preserve extreme performance, we randomly pair particles once and connect them with segment lines.
    const maxLines = 150;
    const lineIndices: number[] = [];
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineColors = new Float32Array(maxLines * 2 * 3);

    for (let l = 0; l < maxLines; l++) {
      const idxA = Math.floor(Math.random() * particleCount);
      let idxB = Math.floor(Math.random() * particleCount);
      while (idxA === idxB) {
        idxB = Math.floor(Math.random() * particleCount);
      }
      lineIndices.push(idxA, idxB);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      linewidth: 1
    });

    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(networkLines);

    // 6. Mouse parallax event tracking
    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normalizedX * 6;
      mouseRef.current.targetY = normalizedY * 6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Render Loop with smooth parallax and geometry rotations
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Slow drift of particle positions
      const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as any;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];

        // Boundaries check – bounce or recycle
        const dist = Math.sqrt(
          posArray[i * 3] ** 2 +
          posArray[i * 3 + 1] ** 2 +
          posArray[i * 3 + 2] ** 2
        );
        if (dist > 78) {
          posArray[i * 3] *= -0.95;
          posArray[i * 3 + 1] *= -0.95;
          posArray[i * 3 + 2] *= -0.95;
        }
      }
      posAttr.needsUpdate = true;

      // Update neural line connections based on the current randomized coordinates
      const linePosAttr = lineGeo.getAttribute('position') as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as any;
      const lineColArray = (lineGeo.getAttribute('color') as THREE.BufferAttribute).array as any;

      let activeLineCount = 0;
      for (let l = 0; l < maxLines; l++) {
        const idA = lineIndices[l * 2];
        const idB = lineIndices[l * 2 + 1];

        const xA = posArray[idA * 3];
        const yA = posArray[idA * 3 + 1];
        const zA = posArray[idA * 3 + 2];

        const xB = posArray[idB * 3];
        const yB = posArray[idB * 3 + 1];
        const zB = posArray[idB * 3 + 2];

        // Draw connections if distance hasn't grown too large
        const dx = xA - xB;
        const dy = yA - yB;
        const dz = zA - zB;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 32) {
          linePosArray[activeLineCount * 6] = xA;
          linePosArray[activeLineCount * 6 + 1] = yA;
          linePosArray[activeLineCount * 6 + 2] = zA;
          linePosArray[activeLineCount * 6 + 3] = xB;
          linePosArray[activeLineCount * 6 + 4] = yB;
          linePosArray[activeLineCount * 6 + 5] = zB;

          // Multi-gradient glowing blue-to-cyan color line
          lineColArray[activeLineCount * 6] = 0.02;
          lineColArray[activeLineCount * 6 + 1] = 0.5;
          lineColArray[activeLineCount * 6 + 2] = 0.8;

          lineColArray[activeLineCount * 6 + 3] = 0.0;
          lineColArray[activeLineCount * 6 + 4] = 0.7;
          lineColArray[activeLineCount * 6 + 5] = 0.7;

          activeLineCount++;
        }
      }
      linePosAttr.needsUpdate = true;
      const lineColAttr = lineGeo.getAttribute('color') as THREE.BufferAttribute;
      if (lineColAttr) lineColAttr.needsUpdate = true;

      // Rotate neural particle constellations
      particlePoints.rotation.y = time * 0.02;
      particlePoints.rotation.x = time * 0.01;

      // Rotate central Torus Knot
      torusKnot.rotation.x = time * 0.12;
      torusKnot.rotation.y = time * 0.18;

      torusKnotOuter.rotation.x = -time * 0.08;
      torusKnotOuter.rotation.y = -time * 0.14;

      // Pulse torus scale slightly
      const pulseFactor = 1 + Math.sin(time * 2.5) * 0.025;
      torusKnot.scale.set(pulseFactor, pulseFactor, pulseFactor);

      // Smooth mouse parallax movement (Lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x;
      camera.position.y = mouseRef.current.y;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Dynamic resize support with ResizeObserver for ultimate precision
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // dispose geometries/materials
      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      torusKnotOuterMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      id="three-network-canvas"
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 bg-cyber-bg overflow-hidden pointer-events-none"
    />
  );
}
