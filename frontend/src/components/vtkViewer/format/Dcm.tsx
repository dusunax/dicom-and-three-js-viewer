import { useEffect } from "react";
import useVtkViewer from "../hooks/useVtkViewer";

export default function Dcm() {
  const { progress, dicomLength, loadingStateMsg, vtkContainerRef, context } =
    useVtkViewer();

  useEffect(() => {
    return () => {
      console.log("cleanning");
      context.current.renderWindow?.delete();
      context.current.renderer?.delete();
      context.current.fullScreenRenderer?.delete();

      if (vtkContainerRef.current) document.querySelector("canvas")?.remove();
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh - 100px)]">
      <div ref={vtkContainerRef} />

      <div className="absolute left-2 top-2">
        file load: {((progress / dicomLength) * 100).toFixed()} %
        <br />
        {loadingStateMsg !== "" && (
          <div className="fixed top-20 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white z-10">
            <span className="text-2xl animate-pulse">{loadingStateMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
