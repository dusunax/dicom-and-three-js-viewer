import { useEffect, useState } from "react";

import { GuiConfig, RenderType } from "@/types/loader";

import Ply from "./format/Ply";

export default function ThreeViewer({
  renderType,
}: {
  renderType: RenderType;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [blob, saveBlob] = useState<{ blob: Blob; fileName: string }>();

  // state for UI
  const [isWireframe, setIsWirefame] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const defaultGuiConfig: GuiConfig = {
    tolerance: 0,
    wireframe: isWireframe,
    color: "#f1eae5",
    light: 0.6,
    metalness: 0.1,
    roughness: 0.8,
  };

  const [guiConfig, setGuiConfig] = useState(defaultGuiConfig);

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

  useEffect(() => {
    const currentModeText = document.querySelector(".currentModeText");
    if (!currentModeText) return;

    if (guiConfig.wireframe) {
      currentModeText.setAttribute("style", `background: #047ad7;`);
    } else {
      currentModeText.setAttribute("style", `background: ${guiConfig.color};`);
    }
    console.log(document.querySelector(".currentModeText"));
  }, [guiConfig]);

  //----------------------------------------------------------------

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
        {renderType === "model" && (
          <div
            className={`currentModeText w-20 h-8 rounded-sm flex justify-center items-center text-sm  ${
              isWireframe ? "bg-blue-500 text-cyan-50 " : `bg-gray-200`
            } `}
          >
            {isWireframe ? "tri mode" : "surface "}
          </div>
        )}

        {loading && "loading..."}
      </div>

      <input
        className="hidden"
        type="file"
        name="ply"
        id="plyUpload"
        onChange={handleFileChange}
      />

      {renderType === "model" && (
        <Ply
          file={file}
          isWireframe={isWireframe}
          setIsWirefame={setIsWirefame}
          defaultGuiConfig={guiConfig}
          setGuiConfig={setGuiConfig}
        />
      )}
    </div>
  );
}
