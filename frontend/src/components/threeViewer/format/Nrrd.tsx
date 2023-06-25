import { useEffect, useRef, Dispatch, SetStateAction } from "react";

import { RenderMode } from "@/types/loader";

import useNrrdViewer from "../hooks/useNrrdViewer";

export default function Nrrd({
  file,
  renderMode = "standard",
  mergeRange,
  setLoading,
}: {
  file: File | null;
  renderMode: RenderMode;
  mergeRange: number | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const refContainer = useRef<HTMLDivElement | null>(null);

  const { loadHandler } = useNrrdViewer();

  useEffect(() => {
    console.log("view changed\n", "file:", file);
    const DEFAULT_FILE_PATH = "/models/sample/stent.nrrd";

    const { current: container } = refContainer;
    if (!container) return;

    const { renderer } = loadHandler({
      container,
      file,
      DEFAULT_FILE_PATH,
      renderMode,
      mergeRange,
    });

    return () => {
      renderer && renderer.dispose();
    };
  }, [file, renderMode, mergeRange, setLoading]);

  return (
    <div ref={refContainer} className="nrrd-viewer" data-testid="nrrd-viewer" />
  );
}
