import { useEffect, useRef } from "react";
import useViewer from "./hooks/useThreeViewer";

export default function ThreeViewer() {
  const { renderer, loading, loadModel, containerRef } = useViewer();

  return (
    <div className="wrapper flex justify-center">
      <button
        onClick={() => loadModel("/ply/goat-skull.ply")}
        className="w-16 h-16 rounded-full fixed left-6 top-[100px] bg-orange-400 "
      >
        💾
      </button>

      <div
        id="viewer"
        data-testid="viewer"
        className="w-full bg-black"
        ref={containerRef}
      />
    </div>
  );
}
