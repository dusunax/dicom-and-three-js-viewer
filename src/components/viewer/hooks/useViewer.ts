import { useAsync } from "react-use";

import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export default function useViewer() {
  // ----------------------------------------------------------------
  // ThreeJS 랜더링
  // ----------------------------------------------------------------

  /** 랜더링 초기화 */
  const renderer = useAsync(
    async (): Promise<THREE.WebGLRenderer | undefined> => {
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

      return newRenderer;
    }
  );

  return { renderer: renderer.value, loading: renderer.loading };
}
