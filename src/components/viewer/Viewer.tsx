import { useEffect, useState } from "react";

import useViewer from "./hooks/useViewer";
import useDICOM from "./hooks/useDicom";

export default function Viewer() {
  const { renderer } = useViewer();
  const {} = useDICOM();

  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (renderer && canvas) {
      canvas.className = "dicom-canvas";
      canvas.appendChild(renderer.domElement);

      return () => {
        canvas.removeChild(renderer.domElement);
      };
    }
  }, [renderer, canvas]);

  return (
    <div className="wrapper flex justify-center">
      <canvas />
      <div
        id="viewer"
        data-testid="viewer"
        className="w-full bg-black"
        ref={setCanvas}
      />
    </div>
  );
}
