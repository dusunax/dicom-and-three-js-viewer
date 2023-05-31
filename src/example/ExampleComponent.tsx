import { useEffect, useState } from "react";
import addCornerstoneExternals from "./utils/addCornerstoneExternals";

import StackOfImage from "@/example/render/StackOfImage";
import StackOfImageWithChangeIndex from "./render/StackOfImageWithChangeIndex";
import useCornerstone from "./hooks/useCornerstone";
import StackOfImageWithTools from "./render/StackOfImageWithToolsBox";

export default function ExampleComponent() {
  const useCornerstoneProps = useCornerstone();

  useEffect(() => {
    addCornerstoneExternals();
  }, []);

  return (
    <div className="text-center">
      <h1 className="mb-10 py-2">with Cornerstone.js</h1>

      {/* ImageStack: 기본 출력 */}
      {/* <StackOfImage useCornerstoneProps={useCornerstoneProps} /> */}

      {/* ImageStack: 이미지 index 변경 */}
      <StackOfImageWithChangeIndex useCornerstoneProps={useCornerstoneProps} />

      {/* CornerstoneTools: Pan and Scroll */}
      <StackOfImageWithTools useCornerstoneProps={useCornerstoneProps} />
    </div>
  );
}
