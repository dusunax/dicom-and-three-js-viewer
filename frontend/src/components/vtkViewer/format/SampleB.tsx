import { useEffect } from "react";
import useVtkSampleB from "../hooks/useVtkSampleB";

export default function SampleB() {
  const {
    vtkContainerRef,
    // labelClickHandler,
    widgetRef,
    currentTheme,
    intervalID,
    changePresetByName,
    vtkColorMaps,
  } = useVtkSampleB();

  useEffect(() => {
    vtkContainerRef.current?.setAttribute(
      "style",
      "height: calc(100vh - 80px)"
    );
  }, []);

  return (
    <div className="relative h-[calc(100vh - 100px)] overflow-hidden">
      <div className="label-container color-tag min-w-[160px] py-2 px-4 absolute top-2 left-1/2 -translate-x-1/2 text-lg text-center text-white bg-gray-400">
        {currentTheme?.Name}
      </div>

      {/* <div className="flex flex-wrap gap-2 w-40 absolute top-16">
        {vtkColorMaps.rgbPresetNames.map((e, idx) => {
          if (idx % 30) {
            return (
              <span
                onClick={() => {
                  changePresetByName(e);
                }}
                className={`bg-white-400 break-keep whitespace-nowrap rounded-lg text-xs p-1 px-2 border-2 ${
                  currentTheme?.Name === e ? " bg-black text-white" : ""
                }`}
              >
                {e}
              </span>
            );
          }
        })}
      </div> */}

      <div ref={vtkContainerRef} />

      <div className="widget-container absolute top-8 right-2 bg-gray-500 " />
    </div>
  );
}
