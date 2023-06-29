import { useEffect, useState } from "react";
import useVtkSampleA from "../hooks/useVtkSampleA";

export default function SampleA() {
  const { vtkContainerRef, loaded, setConstarst, contrast } = useVtkSampleA();

  useEffect(() => {
    vtkContainerRef.current?.setAttribute(
      "style",
      "height: calc(100vh - 80px)"
    );
  }, [loaded]);

  return (
    <div className="h-full relative">
      <input
        className="input-value w-full h-4 absolute top-0 left-0 z-10"
        type="range"
        min={0}
        defaultValue={contrast}
        value={contrast}
        max={1}
        step={0.1}
      />
      <div ref={vtkContainerRef} className="relative overflow-hidden" />
    </div>
  );
}
