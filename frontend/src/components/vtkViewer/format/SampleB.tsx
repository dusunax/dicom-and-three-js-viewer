import { useEffect } from "react";
import useVtkSampleB from "../hooks/useVtkSampleB";

export default function SampleB() {
  const { vtkContainerRef, labelClickHandler } = useVtkSampleB();

  useEffect(() => {
    vtkContainerRef.current?.setAttribute(
      "style",
      "height: calc(100vh - 80px)"
    );
  }, []);

  return (
    <div className="relative h-[calc(100vh - 100px)]">
      <div ref={vtkContainerRef} />

      <div className="widget-container min-h-[100px] min-w-[100px] absolute top-8 left-2 bg-gray-500 " />

      <div
        className="label-container text-center select-none cursor-pointer w-full absolute top-2 left-2 text-white z-11"
        onClick={labelClickHandler}
      />
    </div>
  );
}
