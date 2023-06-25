import * as THREE from "three";

import {
  Cmtextures,
  LoadHandlerProps,
  LoadVolumeBySrc,
  VolumeConfig,
} from "@/types/loader";
import { Volume } from "three/examples/jsm/misc/Volume";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
import { VolumeRenderShader1 } from "three/examples/jsm/shaders/VolumeShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function useNrrdViewer() {
  // ----------------------------------------------------------------
  // load handler & initialize
  // initialize: scence, renderer
  // -----------------------------------------------------------------

  function initialize(container: HTMLDivElement) {
    const scW = window.innerWidth;
    const scH = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
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
    DEFAULT_FILE_PATH,
    isWireframe,
    guiConfig,
    setGuiConfig,
  }: LoadHandlerProps) {
    const { renderer, scene } = initialize(container);

    loadNrrdVolumeBySrc({
      renderer,
      container,
      scene,
      filePath: DEFAULT_FILE_PATH,
      isWireframe,
      guiConfig,
      setGuiConfig,
    });

    return { renderer };
  }

  // ----------------------------------------------------------------
  // file loader
  // ----------------------------------------------------------------

  /** filePath 경로의 nrrd volume을 load합니다. */
  function loadNrrdVolumeBySrc({
    renderer,
    container,
    scene,
    filePath,
  }: LoadVolumeBySrc) {
    console.log("경로 로더");

    let volconfig: VolumeConfig = {
      clim1: 0,
      clim2: 1,
      renderstyle: "iso",
      isothreshold: 0.15,
      colormap: "viridis",
    };

    const cmtextures: Cmtextures = {
      viridis: new THREE.TextureLoader().load(
        "textures/cm_viridis.png",
        (e) => {
          console.log("aa" + e);
        }
      ),
      gray: new THREE.TextureLoader().load("textures/cm_gray.png", (e) => {
        console.log("bb" + e);
      }),
    };

    const loader = new NRRDLoader();
    loader.load(filePath, async (volume) => {
      // geometry & material
      const { geometry } = getVolumeGeometry(volume);
      const { material } = getVolumeMaterial(volume, volconfig, cmtextures);

      const mesh = new THREE.Mesh(geometry, material);

      // camera & control
      render({ renderer, container, scene, geometry, mesh });
    });
  }

  // ----------------------------------------------------------------
  // handleGeometry
  // ----------------------------------------------------------------

  function getVolumeGeometry(volume: Volume) {
    return {
      geometry: new THREE.BoxGeometry(
        volume.dimensions[0],
        volume.dimensions[1],
        volume.dimensions[2]
      ),
    };
  }

  function getVolumeMaterial(
    volume: Volume,
    volconfig: VolumeConfig,
    cmtextures: Cmtextures
  ) {
    const texture = new THREE.Data3DTexture(
      volume.data,
      volume.xLength,
      volume.yLength,
      volume.zLength
    );

    texture.format = THREE.RedFormat;
    texture.type = THREE.FloatType;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    // Material
    const shader = VolumeRenderShader1;
    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["u_data"].value = texture;
    uniforms["u_size"].value.set(
      volume.xLength,
      volume.yLength,
      volume.zLength
    );
    uniforms["u_clim"].value.set(volconfig.clim1, volconfig.clim2);
    uniforms["u_renderstyle"].value = volconfig.renderstyle == "mip" ? 0 : 1; // 0: MIP, 1:
    uniforms["u_renderthreshold"].value = volconfig.isothreshold; // For ISO renderstyle
    uniforms["u_cmdata"].value =
      cmtextures[volconfig.colormap as keyof typeof cmtextures];

    console.log(uniforms);

    let material = new THREE.ShaderMaterial({
      uniforms: shader.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide,
      // transparent: true,
      // opacity: 0.2,
      // depthWrite: false,
    });

    // const material = new THREE.MeshStandardMaterial({
    //   color: "#e8e2d3",
    // });

    return { material };
  }

  // ----------------------------------------------------------------
  // handle render
  // - camera, light, control, render
  // ----------------------------------------------------------------

  // function renderUpdate({
  //   renderer,
  //   scene,
  //   camera,
  // }: {
  //   renderer: THREE.WebGLRenderer;
  //   scene: THREE.Scene;
  //   camera: THREE.OrthographicCamera;
  // }) {
  //   renderer.render(scene, camera);
  // }

  function render({
    renderer,
    container,
    geometry,
    mesh,
    scene,
  }: {
    renderer: THREE.WebGLRenderer;
    container: any;
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
    mesh: THREE.Mesh<any>;
    scene: THREE.Scene;
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

    const h = 512;
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.OrthographicCamera(
      (-h * aspect) / 2,
      (h * aspect) / 2,
      h / 2,
      -h / 2,
      1
    );

    camera.position.set(x, y, cameraZ);
    camera.up.set(0, 0, 1); // In our data, z is up

    scene.add(mesh);

    const controls = new OrbitControls(camera, container);
    controls.enableZoom = true;
    // controls.autoRotate = true; // 자동 회전

    function animate() {
      controls.update();

      renderer.clear();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  return {
    initialize,
    loadHandler,
    loadPLYModelBySrc: loadNrrdVolumeBySrc,
  };
}
