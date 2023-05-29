import { useEffect, useRef, useState } from "react";

import * as cornerstone from "cornerstone-core";

import SectionWrap from "../components/common/SectionWrap";

export default function StackOfImage() {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const itemLength = 10;
  const itemSrcArray = new Array(itemLength).fill(0).map((_, index) => {
    const fileName = String(index).padStart(4, "0");
    return `wadouri:/dicom/${fileName}.dcm`;
  });

  useEffect(() => {
    // init
    const element = elementRef.current;
    if (!element) throw new Error("ref가 존재하지 않습니다.");

    cornerstone.enable(element, {
      renderer: "webgl",
    });

    const imageStack = {
      currentImageIdIndex: imageIndex,
      imageIds: itemSrcArray,
    };

    // load
    const loadImage = async (index: number) => {
      try {
        cornerstone.loadImage(imageStack.imageIds[imageIndex]).then((image) => {
          cornerstone.displayImage(element, image);
        });
      } catch (error) {
        console.error("Error loading DICOM image:", error);
      }
    };

    loadImage(0);

    return () => {
      cornerstone.disable(element);
    };
  }, [imageIndex]);

  const buttonClickHandler = (index: number) => {
    setImageIndex(index);
  };

  return (
    <SectionWrap title="Image Stack">
      <div className="button-box flex gap-4 justify-center mb-4">
        {itemSrcArray.map((e, i) => (
          <button
            key={e}
            className={`w-8 h-8 rounded-full ${
              i === imageIndex ? "bg-cyan-300" : ""
            }`}
            onClick={() => buttonClickHandler(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div
        id="content"
        ref={elementRef}
        className="w-[600px] h-[300px] mx-auto border-cyan-400 border-spacing-2 bg-black"
      ></div>
    </SectionWrap>
  );
}
