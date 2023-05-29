import { useRef } from "react";

import SectionWrap from "../components/common/SectionWrap";

export default function StackOfImageWithPanAndScroll() {
  async function init() {
    const images = await loadImages();
    images.forEach((image, index) => {
      const layer = layers[index];
      const layerId = cornerstone.addLayer(
        viewerRef.current,
        image,
        layer.options
      );
      layers[index].layerId = layerId;

      // segmantaion 이미지를 액티브 레이어로 설정한다.
      if (index === 1) {
        cornerstone.setActiveLayer(viewerRef.current, layerId);
      }

      // Display the first image
      cornerstone.updateImage(viewerRef.current);
    });
  }

  return (
    <>
      <SectionWrap title="Image Stack With Tools: Pan & Scroll">
        <div
          id="contentOne"
          ref={elementRef}
          className="w-[600px] h-[300px] mx-auto border-cyan-400 border-spacing-2 bg-black"
        ></div>
      </SectionWrap>
    </>
  );
}
