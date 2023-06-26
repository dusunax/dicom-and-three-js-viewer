import { useEffect, useRef, Dispatch, SetStateAction } from "react";

import useNrrdViewer from "../hooks/useNrrdViewer";
import { GuiConfig } from "@/types/loader";

export default function Nrrd({
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

  const { loadHandler } = useNrrdViewer();

  useEffect(() => {
    setIsWirefame(guiConfig.wireframe);
  }, [guiConfig]);

  useEffect(() => {
    // console.log("view changed\n", "file:", file);
    const DEFAULT_FILE_PATH = "/models/sample/stent.nrrd";

    const { current: container } = refContainer;
    if (!container) return;

    const { renderer } = loadHandler({
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
  }, [file, isWireframe]);

  return (
    <div ref={refContainer} className="nrrd-viewer" data-testid="nrrd-viewer" />
  );
}
