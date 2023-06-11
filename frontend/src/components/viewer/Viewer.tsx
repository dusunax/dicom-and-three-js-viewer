import { useEffect, useState } from "react";

import { RenderMode } from "@/models/loader";

import PLYModel from "./format/PLYModel";

export default function ThreeViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [blob, saveBlob] = useState<{ blob: Blob; fileName: string }>();
  const [renderMode, setRenderMode] = useState<RenderMode>("standard");

  useEffect(() => {
    console.log(blob);
  }, [blob]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFile = event.target.files[0];
    setFile(newFile);
  };

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

  return (
    <div className="wrapper flex justify-center">
      <label
        htmlFor="plyUpload"
        className="w-16 h-16 rounded-full flex justify-center items-center fixed left-6 top-[100px] bg-orange-400 "
      >
        📂
      </label>

      {/* <label
        htmlFor="pngSave"
        className="w-16 h-16 rounded-full flex justify-center items-center fixed left-24 top-[100px] bg-green-500 "
        onClick={handleSaveImage}
      >
        💾
      </label> */}

      <button
        className={`triModeToggle w-16 h-16 rounded-full flex justify-center items-center fixed right-6 top-[100px] ${
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

      <input
        className="hidden"
        type="file"
        name="ply"
        id="plyUpload"
        onChange={handleFileChange}
      />

      <PLYModel file={file} renderMode={renderMode} />
    </div>
  );
}
