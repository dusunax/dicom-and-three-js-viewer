export type RenderMode = "standard" | "wireframe";

export interface loadModelProps {
  renderer: THREE.WebGLRenderer;
  container: any;
  scene: THREE.Scene;
  renderType: RenderMode;
}

export interface loadModelByFile extends loadModelProps {
  plyFile: File;
}

export interface loadModelBySrc extends loadModelProps {
  plyPath: string;
}
