import { useEffect, useState } from "react";
import useViewer from "./hooks/useViewer";

const Viewer = () => {
  const { renderer } = useViewer();
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (renderer && canvas) {
      canvas.appendChild(renderer.domElement);

      return () => {
        canvas.removeChild(renderer.domElement);
      };
    }
  }, [renderer, canvas]);

  return (
    <div className="wrapper flex justify-center">
      <div
        id="viewer"
        data-testid="viewer"
        className="w-full bg-black"
        ref={setCanvas}
      />
    </div>
  );
};

export { Viewer };
