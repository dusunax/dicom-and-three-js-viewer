import { useState, useEffect, useRef } from "react";

import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Float32BufferAttribute } from "three";

function loadPLYModel(
  scene: THREE.Scene,
  plyPath: string,
  renderer: THREE.WebGLRenderer,
  container: any
) {
  const loader = new PLYLoader();

  loader.load(plyPath, (geometry) => {
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = new Float32BufferAttribute(
      positionAttribute.count * 3,
      3
    );

    geometry.setAttribute("normal", normalAttribute);
    geometry.computeVertexNormals();

    geometry.center();

    geometry.computeBoundingBox();

    let x, y, z, cameraZ;

    if (geometry.boundingBox) {
      x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
      z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

      cameraZ = Math.max(x * 2.5, y * 2.5, z * 2.5);
    } else {
      x = y = z = 0;
      cameraZ = 0;
    }

    const material = new THREE.MeshStandardMaterial({
      color: "#fffcf1",
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1
    );

    camera.position.set(0, 0, 1000);
    camera.lookAt(mesh as any);

    const controls = new OrbitControls(camera, container);
    controls.enableZoom = true;
    controls.autoRotate = true;

    var lightHolder = new THREE.Group();

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0).normalize();
    lightHolder.add(directionalLight);

    scene.add(lightHolder);

    const light = new THREE.AmbientLight("#FFF", 0.3);
    scene.add(light);
    scene.add(mesh);

    function animate() {
      requestAnimationFrame(animate);
      lightHolder.quaternion.copy(camera.quaternion);
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();

      renderer.render(scene, camera);
    }
    animate();
  });
}

const SampleModel = () => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [rendererEl, setRendererEl] = useState<any | null>(null);

  useEffect(() => {
    const { current: container } = refContainer;

    if (container && !rendererEl) {
      const scW = window.innerWidth;
      const scH = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);

      container.innerHTML = "";
      container.appendChild(renderer.domElement);
      setRendererEl(renderer);

      const scene = new THREE.Scene();

      loadPLYModel(scene, "/models/goat-skull.ply", renderer, container);
    }

    return () => {
      rendererEl && rendererEl.dispose();
    };
  }, []);

  return (
    <div ref={refContainer}>
      {loading && <span className=" text-red-300">Loading...</span>}
    </div>
  );
};

export default function PLYModel() {
  return (
    <div>
      <SampleModel />
    </div>
  );
}
