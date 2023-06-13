import { useEffect, useState } from "react";

import { RenderMode } from "@/models/loader";

import PLYModel from "./format/PLYModel";

export default function ThreeViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [blob, saveBlob] = useState<{ blob: Blob; fileName: string }>();

  // state for UI
  const [renderMode, setRenderMode] = useState<RenderMode>("standard");
  const [mergeRange, setMergeRange] = useState(0.3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(blob);
  }, [blob]);

  //----------------------------------------------------------------
  // Buttons (not implemented yet)
  //----------------------------------------------------------------
  /** [파일 변경] on file change, change the object on view  */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFile = event.target.files[0];
    setFile(newFile);
  };

  /** [이미지 저장] save the current view on canvas */
  const handleSaveImage = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return console.log("blob not found");
      console.log(blob);

      saveBlob({
        blob,
        fileName: `screencapture-${canvas.width}x${canvas.height}.png`,
      });
    });
  };
  //----------------------------------------------------------------

  const handleRangeMouseUp = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    !loading && setMergeRange(+e.currentTarget.value);
  };

  return (
    <div className="wrapper flex justify-center">
      {/* <label
        htmlFor="plyUpload"
        className="w-16 h-16 rounded-full flex justify-center items-center fixed left-6 top-[100px] bg-orange-400 "
      >
        📂
      </label>

      <label
        htmlFor="pngSave"
        className="w-16 h-16 rounded-full flex justify-center items-center fixed left-24 top-[100px] bg-green-500 "
        onClick={handleSaveImage}
      >
        💾
      </label> */}
      <div className="right-button-box flex flex-col items-end fixed right-6 top-[100px]">
        <button
          className={`triModeToggle w-16 h-16 mb-4 rounded-full flex justify-center items-center  ${
            renderMode === "wireframe" ? "bg-blue-500" : "bg-gray-400"
          } `}
          onClick={() =>
            renderMode === "wireframe"
              ? setRenderMode("standard")
              : setRenderMode("wireframe")
          }
        >
          Tri
        </button>

        {loading && "loading..."}

        {renderMode === "wireframe" && (
          <div>
            <p>Mesh merge: {mergeRange.toFixed(1)}</p>
            <input
              type="range"
              name="tolerance"
              id="tolerance"
              min={0}
              max={1}
              step={0.1}
              defaultValue={mergeRange}
              onMouseUp={handleRangeMouseUp}
            />
          </div>
        )}
      </div>

      <input
        className="hidden"
        type="file"
        name="ply"
        id="plyUpload"
        onChange={handleFileChange}
      />
      <PLYModel
        file={file}
        renderMode={renderMode}
        mergeRange={mergeRange}
        setLoading={setLoading} // 로딩 처리 필요
      />
    </div>
  );
}
