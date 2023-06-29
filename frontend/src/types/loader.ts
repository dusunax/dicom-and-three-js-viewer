import { Dispatch, SetStateAction } from "react";

export type RenderMode = "standard" | "wireframe";
export type RenderType = "model" | "volume" | "sample";

export interface Cmtextures {
  viridis: THREE.Texture;
  gray: THREE.Texture;
}

export interface GuiConfig {
  tolerance: number;
  wireframe: boolean;
  color: string;
  light: number;
  metalness: number;
  roughness: number;
}
export interface OptionalConfig {
  isWireframe: boolean;
  guiConfig: GuiConfig;
  setGuiConfig: Dispatch<SetStateAction<GuiConfig>>;
}

export interface VolumeConfig {
  clim1: number;
  clim2: number;
  renderstyle: string;
  isothreshold: number;
  colormap: string;
}

// function props
export interface LoadHandlerProps extends OptionalConfig {
  container: HTMLDivElement;
  file: File | null;
  DEFAULT_FILE_PATH: string;
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
  filePath: string;
}

export interface LoadVolumeBySrc extends LoadModelProps {
  filePath: string;
}
