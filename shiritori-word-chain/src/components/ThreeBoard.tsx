import { useEffect, useRef } from "react";

export default function ThreeBoard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    let renderer: any = null;
    let animationFrameId: number;

    const initThree = () => {
      if (!containerRef.current || !active) return;
      const THREE = (window as any).THREE;
      if (!THREE) return;

      const container = containerRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // Scene, Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 11, 11);
      camera.lookAt(0, 0, 0);

      // Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Clean up previous canvas if any
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.82);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
      directionalLight.position.set(5, 10, 7);
      scene.add(directionalLight);

      // Board Colors (Kawaii Palette)
      const colors = {
        primary: 0xff94b4,
        secondary: 0xe0d5f6,
        accent: 0xa7f3d0,
        board: 0xfdf7ff,
        tile: 0xffffff
      };

      // Create the Board (Monopoly style 5x5 grid)
      const boardSize = 5;
      const tileSize = 2;
      const boardPadding = 0.2;

      const boardGroup = new THREE.Group();

      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          // Only build the perimeter for a Monopoly feel
          if (i === 0 || i === boardSize - 1 || j === 0 || j === boardSize - 1) {
            const tileGeom = new THREE.BoxGeometry(
              tileSize - boardPadding,
              0.5,
              tileSize - boardPadding
            );
            const tileMat = new THREE.MeshPhongMaterial({
              color: (i + j) % 2 === 0 ? colors.tile : colors.secondary,
              flatShading: true,
            });
            const tile = new THREE.Mesh(tileGeom, tileMat);
            tile.position.set(
              (i - (boardSize - 1) / 2) * tileSize,
              0,
              (j - (boardSize - 1) / 2) * tileSize
            );
            boardGroup.add(tile);

            // Add colored "property" stripe on top
            const stripeGeom = new THREE.BoxGeometry(
              tileSize - boardPadding,
              0.1,
              (tileSize - boardPadding) * 0.2
            );
            const stripeMat = new THREE.MeshPhongMaterial({ color: colors.primary });
            const stripe = new THREE.Mesh(stripeGeom, stripeMat);
            stripe.position.set(
              tile.position.x,
              0.3,
              tile.position.z + (tileSize / 2 - 0.2)
            );
            boardGroup.add(stripe);
          }
        }
      }
      scene.add(boardGroup);

      // Character 1: Neko (Pink)
      const characterGroup = new THREE.Group();
      const bodyGeom = new THREE.SphereGeometry(0.5, 24, 24);
      const bodyMat = new THREE.MeshPhongMaterial({ color: colors.primary });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      characterGroup.add(body);

      const earGeom = new THREE.ConeGeometry(0.2, 0.4, 4);
      const earMat = new THREE.MeshPhongMaterial({ color: colors.primary });
      
      const leftEar = new THREE.Mesh(earGeom, earMat);
      leftEar.position.set(-0.3, 0.5, 0);
      leftEar.rotation.z = 0.3;
      characterGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeom, earMat);
      rightEar.position.set(0.3, 0.5, 0);
      rightEar.rotation.z = -0.3;
      characterGroup.add(rightEar);

      characterGroup.position.set(-4, 0.7, 4); // Starting position
      scene.add(characterGroup);

      // Power-up item (Rotating Diamond)
      const powerUpGeom = new THREE.OctahedronGeometry(0.4);
      const powerUpMat = new THREE.MeshPhongMaterial({
        color: colors.accent,
        emissive: colors.accent,
        emissiveIntensity: 0.3,
      });
      const powerUp = new THREE.Mesh(powerUpGeom, powerUpMat);
      powerUp.position.set(4, 1.2, -4);
      scene.add(powerUp);

      // Handle Resize
      const handleResize = () => {
        if (!container || !active) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener("resize", handleResize);

      // Animation Loop
      function animate() {
        if (!active) return;
        animationFrameId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Float character
        characterGroup.position.y = 0.7 + Math.sin(time * 3) * 0.1;

        // Rotate board slightly for depth
        boardGroup.rotation.y = Math.sin(time * 0.2) * 0.05;

        // Rotate powerup
        powerUp.rotation.y += 0.02;
        powerUp.position.y = 1.2 + Math.cos(time * 2) * 0.2;

        renderer.render(scene, camera);
      }

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
      };
    };

    // Load Three.js from CDN script if not globally available
    if (!(window as any).THREE) {
      const script = document.createElement("script");
      script.src = "https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js";
      script.async = true;
      script.onload = () => {
        if (active) initThree();
      };
      document.head.appendChild(script);
    } else {
      initThree();
    }

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full text-transparent"
      id="threejs-board-container"
    />
  );
}
