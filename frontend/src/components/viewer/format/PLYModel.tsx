import { useState, useEffect, useRef } from "react";

import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Float32BufferAttribute } from "three";

/** plyFile: ply model File을 load합니다. */
function loadPLYModelByFile(
  renderer: THREE.WebGLRenderer,
  container: any,
  scene: THREE.Scene,
  plyFile: File
) {
  console.log("파일 로더");
  const loader = new PLYLoader();

  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target && event.target.result) {
      let plyData: string | ArrayBuffer = event.target.result;

      if (typeof plyData === "string") {
        const encoder = new TextEncoder();
        plyData = encoder.encode(plyData);
      }

      const plyDataUint8 = new Uint8Array(plyData);
      const geometry = loader.parse(plyDataUint8);
      console.log(geometry);

      handleGeometry(renderer, container, scene, geometry);
    }
  };

  reader.readAsArrayBuffer(plyFile);
}

/** plyPath: 경로의 ply model을 load합니다. */
function loadPLYModelBySrc(
  renderer: THREE.WebGLRenderer,
  container: any,
  scene: THREE.Scene,
  plyPath: string
) {
  console.log("경로 로더");

  const loader = new PLYLoader();
  loader.load(plyPath, (geometry) => {
    handleGeometry(renderer, container, scene, geometry);
  });
}

function handleGeometry(
  renderer: THREE.WebGLRenderer,
  container: any,
  scene: THREE.Scene,
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>
) {
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

    cameraZ = Math.max(x * 3, y * 3, z * 3);
  } else {
    x = y = z = 0;
    cameraZ = 1000;
  }

  const material = new THREE.MeshStandardMaterial({
    color: "#fffcf1",
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.rotation.set(-(Math.PI / 4) * 2, (Math.PI / 4) * 2, Math.PI / 16);
  // Rotate by 45 degrees = Math.PI / 4

  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1
  );

  camera.position.set(x, y, cameraZ);
  camera.lookAt(mesh as any);

  var lightHolder = new THREE.Group();

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 0).normalize();
  lightHolder.add(directionalLight);

  scene.add(lightHolder);

  const light = new THREE.AmbientLight("#FFF", 0.3);
  scene.add(light);
  scene.add(mesh);

  const controls = new OrbitControls(camera, container);
  controls.enableZoom = true;
  // controls.autoRotate = true; // 자동 회전

  function animate() {
    requestAnimationFrame(animate);
    lightHolder.quaternion.copy(camera.quaternion);
    controls.update();

    renderer.clear();
    renderer.render(scene, camera);
  }

  animate();
}

export default function PLYModel({ file }: { file: File | null }) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  // const [loading, setLoading] = useState(true);
  const [rendererEl, setRendererEl] = useState<any | null>(null);

  useEffect(() => {
    console.log("file changed", file);

    const { current: container } = refContainer;

    if (container) {
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

      if (file === null) {
        // loadPLYModelBySrc(renderer, container, scene, "/models/goat-skull.ply");
        loadPLYModelBySrc(renderer, container, scene, "/models/cast-teeth.ply");
      } else {
        loadPLYModelByFile(renderer, container, scene, file);
      }
    }

    return () => {
      rendererEl && rendererEl.dispose();
    };
  }, [file]);

  return (
    <div ref={refContainer}>
      <span className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-300">
        Loading...
      </span>
    </div>
  );
}
