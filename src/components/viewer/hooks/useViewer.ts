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

      return newRenderer;
    }
  );

  return { renderer: threeRenderer.value, loading: threeRenderer.loading };
}
