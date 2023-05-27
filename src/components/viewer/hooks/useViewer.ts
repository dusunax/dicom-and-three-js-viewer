import { useEffect, useState } from "react";
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export default function useViewer() {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | undefined>();

  const initRenderer = () => {
    const camera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1;

    const scene = new Scene();
    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const newRenderer = new WebGLRenderer({ antialias: true });
    newRenderer.setSize(window.innerWidth, window.innerHeight - 200);
    newRenderer.setAnimationLoop(rotate);

    setRenderer(newRenderer);

    function rotate(time: number) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;

      newRenderer.render(scene, camera);
    }
  };

  useEffect(() => {
    initRenderer();
  }, []);

  return { renderer };
}
