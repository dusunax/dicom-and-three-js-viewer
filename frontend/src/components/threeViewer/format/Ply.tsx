import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import usePlyViewer from "../hooks/usePlyViewer";
import { GuiConfig } from "@/types/loader";

export const DEFAULT_FILE_PATH = "/models/converted/mesh-step4.ply";

export default function Ply({
  file,
  isWireframe,
  setIsWirefame,
  defaultGuiConfig: guiConfig,
  setGuiConfig,
}: {
  file: File | null;
  isWireframe: boolean;
  setIsWirefame: Dispatch<SetStateAction<boolean>>;
  defaultGuiConfig: GuiConfig;
  setGuiConfig: Dispatch<SetStateAction<GuiConfig>>;
}) {
  const refContainer = useRef<HTMLDivElement | null>(null);

  const { loadHandler, guiEditorInit } = usePlyViewer();

  useEffect(() => {
    setIsWirefame(guiConfig.wireframe);
  }, [guiConfig]);

  useEffect(() => {
    // console.log("view changed\n", "file:", file);
    const { current: container } = refContainer;
    if (!container) return;

    const { renderer, scene } = loadHandler({
      container,
      file,
      DEFAULT_FILE_PATH,
      isWireframe,
      guiConfig,
      setGuiConfig,
    });

    return () => {
      renderer && renderer.dispose();
    };
  }, [
    file,
    isWireframe,
    guiConfig.color,
    guiConfig.tolerance,
    guiConfig.wireframe,
    guiConfig.light,
    guiConfig.metalness,
    guiConfig.roughness,
  ]);

  return (
    <>
      <div ref={refContainer} className="ply-viewer" data-testid="ply-viewer" />
    </>
  );
}
