import { useEffect, useRef } from "react";
import useViewer from "./hooks/useThreeViewer";

export default function ThreeViewer() {
  const { renderer, loading } = useViewer();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!renderer || !containerRef.current) return;

    containerRef.current.appendChild(renderer.domElement);
  }, [loading]);

  return (
    <div className="wrapper flex justify-center">
      <div
        id="viewer"
        data-testid="viewer"
        className="w-full bg-black"
        ref={containerRef}
      />
    </div>
  );
}
