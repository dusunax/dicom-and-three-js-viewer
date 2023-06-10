import { useEffect, useRef, useState } from "react";
import PLYModel from "./format/PLYModel";

export default function ThreeViewer() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFile = event.target.files[0];
    setFile(newFile);
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
      >
        💾
      </label> */}

      <input
        className="hidden"
        type="file"
        name="ply"
        id="plyUpload"
        onChange={handleFileChange}
      />

      <PLYModel file={file} />
    </div>
  );
}
