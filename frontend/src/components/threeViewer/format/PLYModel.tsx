import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import * as THREE from "three";

import { RenderMode } from "@/types/loader";

import usePlyViewer from "../hooks/usePlyViewer";

export default function PLYModel({
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

  const { initialize, loadHandler, loadPLYModelByFile, loadPLYModelBySrc } =
    usePlyViewer();

  useEffect(() => {
    console.log("view changed\n", "file:", file);
    const DEFAULT_PLY_FILE_PATH = "/models/converted/mesh-step2.ply";

    const { current: container } = refContainer;
    if (!container) return;

    const { renderer } = loadHandler({
      container,
      file,
      DEFAULT_PLY_FILE_PATH,
      renderMode,
      mergeRange,
    });

    return () => {
      renderer && renderer.dispose();
    };
  }, [file, renderMode, mergeRange, setLoading]);

  return <div ref={refContainer} />;
}
