import { Dispatch, SetStateAction } from "react";

import * as THREE from "three";
import { Float32BufferAttribute } from "three";

import {
  GuiConfig,
  LoadHandlerProps,
  LoadModelByFile,
  LoadModelBySrc,
} from "@/types/loader";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export default function usePlyViewer() {
  // ----------------------------------------------------------------
  // load handler & initialize
  // - renderer, secene
  // ----------------------------------------------------------------
  function initialize(container: HTMLDivElement) {
    const scW = window.innerWidth;
    const scH = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(scW, scH);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    return { renderer, scene };
  }

  function loadHandler({
    container,
    file,
    DEFAULT_FILE_PATH,
    isWireframe,
    guiConfig,
    setGuiConfig,
  }: LoadHandlerProps) {
    const { renderer, scene } = initialize(container);

    if (file === null) {
      loadPLYModelBySrc({
        renderer,
        container,
        scene,
        filePath: DEFAULT_FILE_PATH,
        isWireframe,
        guiConfig,
        setGuiConfig,
      });
    } else {
      loadPLYModelByFile({
        renderer,
        container,
        scene,
        modelFile: file,
        isWireframe,
        guiConfig,
        setGuiConfig,
      });
    }

    return { renderer, scene };
  }

  // ----------------------------------------------------------------
  // GUI editor
  // ----------------------------------------------------------------
  function guiEditorInit(
    guiConfig: GuiConfig,
    setGuiConfig: Dispatch<SetStateAction<GuiConfig>>
  ): void {
    if (guiConfig === undefined || document.querySelector(".lil-gui")) return;

    console.log(guiConfig);

    const gui = new GUI();
    gui.$title.innerText = "설정 ⚙ model configuration";
    gui
      .add(guiConfig, "wireframe", [true, false])
      .onFinishChange((value: boolean) =>
        setGuiConfig((prevState) => ({ ...prevState, wireframe: value }))
      );
    gui
      .add(guiConfig, "light", 0, 1, 0.1)
      .onFinishChange((value: number) =>
        setGuiConfig((prevState) => ({ ...prevState, light: value }))
      );
    gui
      .add(guiConfig, "metalness", 0, 1, 0.1)
      .onFinishChange((value: number) =>
        setGuiConfig((prevState) => ({ ...prevState, metalness: value }))
      );
    gui
      .add(guiConfig, "roughness", 0, 1, 0.1)
      .onFinishChange((value: number) =>
        setGuiConfig((prevState) => ({ ...prevState, roughness: value }))
      );
    gui
      .addColor(guiConfig, "color")
      .onFinishChange((value: string) =>
        setGuiConfig((prevState) => ({ ...prevState, color: value }))
      );

    // Move the GUI to the top right corner
    const guiElement = gui.domElement;
    guiElement.style.position = "absolute";
    guiElement.style.top = "90px";
    guiElement.style.left = "10px";
  }

  // ----------------------------------------------------------------
  // file loader
  // ----------------------------------------------------------------

  /** plyFile: ply model File을 load합니다. */
  function loadPLYModelByFile({
    renderer,
    container,
    scene,
    modelFile,
    isWireframe,
    guiConfig,
    setGuiConfig,
  }: LoadModelByFile) {
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

        const { mesh } = isWireframe
          ? handleTriMesh({ geometry, guiConfig })
          : handleGeometry({ geometry, guiConfig });

        render({
          renderer,
          container,
          scene,
          geometry,
          mesh,
          guiConfig,
        });

        guiEditorInit(guiConfig, setGuiConfig);
      }
    };
  }

  /** filePath 경로의 ply model을 load합니다. */
  function loadPLYModelBySrc({
    renderer,
    container,
    scene,
    filePath,
    isWireframe,
    guiConfig,
    setGuiConfig,
  }: LoadModelBySrc) {
    const loader = new PLYLoader();

    loader.load(filePath, async (geometry) => {
      const { mesh } = isWireframe
        ? handleTriMesh({ geometry, guiConfig })
        : handleGeometry({ geometry, guiConfig });

      render({
        renderer,
        container,
        scene,
        geometry,
        mesh,
        guiConfig,
      });

      guiEditorInit(guiConfig, setGuiConfig);
    });
  }

  // ----------------------------------------------------------------
  // handleGeometry
  // - geometry, material, mesh
  // ----------------------------------------------------------------

  function handleGeometry({
    geometry,
    guiConfig,
  }: {
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
    guiConfig: GuiConfig;
  }) {
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = new Float32BufferAttribute(
      positionAttribute.count * 3,
      3
    );

    geometry.setAttribute("normal", normalAttribute);
    geometry.computeVertexNormals();

    geometry.center();

    geometry.computeBoundingBox();

    geometry = BufferGeometryUtils.mergeVertices(geometry, guiConfig.tolerance);

    // 재질
    const material = new THREE.MeshPhysicalMaterial({
      color: guiConfig.color,
      metalness: guiConfig.metalness, // 금속성
      roughness: guiConfig.roughness, // 거칠기
      clearcoat: 1.0, // 클리어 코트
      clearcoatRoughness: 0.5, // 클리어 코트의 거칠기
      reflectivity: 0.6, // 반사도
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.rotation.set(-(Math.PI / 4) * 2, (Math.PI / 4) * 2, Math.PI / 16);
    // Rotate by 45 degrees = Math.PI / 4

    return { mesh };
  }

  function handleTriMesh({
    geometry,
    guiConfig,
  }: {
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
    guiConfig: GuiConfig;
  }) {
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = new Float32BufferAttribute(
      positionAttribute.count * 3,
      3
    );

    geometry.setAttribute("normal", normalAttribute);
    geometry.computeVertexNormals();

    geometry.center();

    geometry.computeBoundingBox();

    geometry = BufferGeometryUtils.mergeVertices(geometry, guiConfig.tolerance);

    const material = new THREE.MeshStandardMaterial({
      color: "#e8e2d3",
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.add(wireframe);

    mesh.rotation.set(-(Math.PI / 4) * 2, (Math.PI / 4) * 2, Math.PI / 16);
    // Rotate by 45 degrees = Math.PI / 4

    return { mesh };
  }

  // ----------------------------------------------------------------
  // handle render
  // - camera, light, control, render
  // ----------------------------------------------------------------

  function render({
    renderer,
    container,
    geometry,
    mesh,
    scene,
    guiConfig,
  }: {
    renderer: THREE.WebGLRenderer;
    container: any;
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
    mesh: THREE.Mesh<any>;
    scene: THREE.Scene;
    guiConfig: GuiConfig;
  }) {
    let x, y, z, cameraZ;

    // setting boundingBox size
    if (geometry.boundingBox) {
      x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
      z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

      cameraZ = Math.max(x * 3, y * 3, z * 3);
    } else {
      x = y = z = 0;
      cameraZ = 1000;
    }

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );

    camera.position.set(x, y, cameraZ);
    camera.lookAt(mesh as any);

    // setting light
    var lightHolder = new THREE.Group();

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 0).normalize();
    lightHolder.add(directionalLight);

    const light = new THREE.AmbientLight("#FFF", guiConfig.light);
    lightHolder.add(light);

    scene.add(lightHolder);
    scene.add(mesh);

    const controls = new OrbitControls(camera, container);
    controls.enableZoom = true;
    // controls.autoRotate = true; // 자동 회전
    controls.update();

    updateRender(renderer, scene, camera);
    return { renderer, scene, camera };
  }

  function updateRender(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    function animate() {
      renderer.clear();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  return {
    initialize,
    loadHandler,
    loadPLYModelByFile,
    loadPLYModelBySrc,
    guiEditorInit,
  };
}
