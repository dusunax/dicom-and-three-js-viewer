import { useEffect, useState } from "react";
import useVtkViewer from "../hooks/useVtkViewer";

export default function Dcm() {
  const {
    progress,
    dicomLength,
    loadingStateMsg,
    vtkContainerRef,
    context,
    updateContourValue,
  } = useVtkViewer();

  const [inputValue, setInputValue] = useState(90);
  const [currentValue, setCurrentValue] = useState(90);

  return (
    <div className="relative h-[calc(100vh - 100px)]">
      <div ref={vtkContainerRef} />

      <div className="absolute right-2 top-2 z-10">
        <input
          type="number"
          className="inline-block h-10 w-20 py-2 px-4 bg-white outline-none"
          min={0}
          max={1000}
          defaultValue={90}
          step={10}
          onChange={(e) => setInputValue(+e.currentTarget.value)}
        />
        <button
          className="py-2 px-4 text-white bg-neutral-600"
          onClick={() => {
            setCurrentValue(inputValue);
            updateContourValue(inputValue);
          }}
        >
          Apply
        </button>
      </div>

      <div className="absolute left-2 top-2 text-lg">
        file load: {((progress / dicomLength) * 100).toFixed()} %
        <br />
        contour value: {currentValue}
        {loadingStateMsg !== "" && (
          <div className="fixed top-20 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white z-20">
            <span className="text-2xl animate-pulse">{loadingStateMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
