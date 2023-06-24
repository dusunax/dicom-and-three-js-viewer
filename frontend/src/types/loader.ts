export type RenderMode = "standard" | "wireframe";

export interface OptionalConfig {
  renderMode?: RenderMode;
  mergeRange?: number;
}

export interface LoadHandlerProps extends OptionalConfig {
  container: HTMLDivElement;
  file: File | null;
  DEFAULT_PLY_FILE_PATH: string;
}

export interface LoadModelProps extends OptionalConfig {
  container: HTMLDivElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
}

export interface LoadModelByFile extends LoadModelProps {
  modelFile: File;
}

export interface LoadModelBySrc extends LoadModelProps {
  plyPath: string;
}

export interface LoadVolumeBySrc extends LoadModelProps {
  volumePath: string;
}
