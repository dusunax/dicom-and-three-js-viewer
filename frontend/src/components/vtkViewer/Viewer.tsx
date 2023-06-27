import useVtkViewer from "./hooks/useVtkViewer";

export default function VtkViewer() {
  const { progress, dicomLength, vtkContainerRef, loadingStateMsg } =
    useVtkViewer();

  return (
    <div className="relative">
      <div className="absolute left-2 top-2">
        file load: {((progress / dicomLength) * 100).toFixed()} %
        <br />
        <span className="animate-pulse">{loadingStateMsg}</span>
      </div>

      <div ref={vtkContainerRef} />
    </div>
  );
}
