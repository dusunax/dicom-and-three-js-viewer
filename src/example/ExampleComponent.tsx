import { useEffect, useState } from "react";
import addCornerstoneExternals from "./utils/addCornerstoneExternals";

import StackOfImage from "@/example/render/StackOfImage";
import StackOfImageWithTools from "./render/StackOfImageWithTools";
import StackOfImageWithPanAndScroll from "./render/StackOfImageWithPanAndScroll";
import useCornerstone from "./hooks/useCornerstone";

export default function ExampleComponent() {
  const useCornerstoneProps = useCornerstone();

  useEffect(() => {
    addCornerstoneExternals();
  }, []);

  return (
    <div className="text-center">
      <h1 className="mb-10">Cornerstone.js 라이브러리 사용 예시</h1>

      {/* ImageStack: 기본 출력 */}
      <StackOfImage useCornerstoneProps={useCornerstoneProps} />

      {/* CornerstoneTools: 기본 도구 */}
      <StackOfImageWithTools useCornerstoneProps={useCornerstoneProps} />

      {/* CornerstoneTools: Pan and Scroll */}
      {/* <StackOfImageWithPanAndScroll /> */}
    </div>
  );
}
