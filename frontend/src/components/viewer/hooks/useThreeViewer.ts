import { useEffect, useRef } from "react";
import { useAsync } from "react-use";

import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

export default function useViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null); // For canceling animation frame

  // ----------------------------------------------------------------
  // ThreeJS 랜더링
  // ----------------------------------------------------------------

  /** 랜더링 초기화 */
  const threeRenderer = useAsync(
    async (): Promise<THREE.WebGLRenderer | undefined> => {
      const camera = new PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
      );
      camera.position.z = 1;

      const newRenderer = new WebGLRenderer({ antialias: true });
      newRenderer.setSize(window.innerWidth, window.innerHeight);

      rendererRef.current = newRenderer;
      cameraRef.current = camera;

      return newRenderer;
    }
  );

  // 파일
  const loadModel = (url: string) => {
    const loader = new PLYLoader();

    loader.load(url, (geometry) => {
      const scene = new Scene();
      const mesh = new Mesh(geometry, new MeshNormalMaterial());
      scene.add(mesh);
      sceneRef.current = scene;
      meshRef.current = mesh;

      // Adjust position, rotation, scale as needed
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(1, 1, 1);

      // Update camera aspect ratio
      const aspectRatio = window.innerWidth / window.innerHeight;
      cameraRef.current!.aspect = aspectRatio;
      cameraRef.current!.updateProjectionMatrix();

      // Render the scene
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    });
  };

  useEffect(() => {
    const loadAndRenderModel = async () => {
      await new Promise((resolve: any) => {
        loadModel("/ply/goat-skull.ply");
        const checkLoaded = () => {
          if (sceneRef.current && meshRef.current) {
            resolve(); // Resolve the promise when the scene and mesh are loaded
          } else {
            requestAnimationFrame(checkLoaded);
          }
        };
        checkLoaded();
      });

      const render = () => {
        if (
          !cameraRef.current ||
          !rendererRef.current ||
          !containerRef.current ||
          !sceneRef.current ||
          !meshRef.current
        )
          return;

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationFrameRef.current = requestAnimationFrame(render);
      };

      animationFrameRef.current = requestAnimationFrame(render);
    };

    loadAndRenderModel();

    return () => {
      // Clean up and cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !containerRef.current) return;

    containerRef.current.appendChild(rendererRef.current.domElement);
    console.log(containerRef.current);

    return () => {
      // Clean up and remove the rendererRef.current DOM element
      rendererRef.current &&
        containerRef.current &&
        containerRef.current.removeChild(rendererRef.current.domElement);
    };
  }, []);

  return {
    renderer: rendererRef.current,
    loading: threeRenderer.loading,
    loadModel,
    containerRef,
  };
}
