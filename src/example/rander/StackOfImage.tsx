import { useEffect, useRef, useState } from "react";

import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneMath from "cornerstone-math";
//@ts-ignore
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";

// Cornerstone Externals
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

export default function StackOfImage() {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const itemLength = 10;
  const array = new Array(itemLength).fill("");

  useEffect(() => {
    // init
    const element = elementRef.current;
    if (!element) throw new Error("ref가 존재하지 않습니다.");

    cornerstone.enable(element, {
      renderer: "webgl",
    });

    const synchronizer = new cornerstoneTools.Synchronizer(
      "cornerstonenewimage",
      cornerstoneTools.updateImageSynchronizer
    );

    const imageStack = {
      currentImageIdIndex: imageIndex,
      imageIds: [
        `wadouri:/dicom/0000.dcm`,
        `wadouri:/dicom/0001.dcm`,
        `wadouri:/dicom/0002.dcm`,
        `wadouri:/dicom/0003.dcm`,
        `wadouri:/dicom/0004.dcm`,
        `wadouri:/dicom/0005.dcm`,
        `wadouri:/dicom/0006.dcm`,
        `wadouri:/dicom/0007.dcm`,
        `wadouri:/dicom/0008.dcm`,
        `wadouri:/dicom/0009.dcm`,
      ],
    };

    // load
    const loadImage = async (index: number) => {
      try {
        cornerstone.loadImage(imageStack.imageIds[imageIndex]).then((image) => {
          cornerstone.displayImage(element, image);

          synchronizer.add(element);
          cornerstoneTools.addStackStateManager(element, [
            "stack",
            "crosshairs",
          ]);
          cornerstoneTools.addToolState(element, "stack", imageStack);
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
    <>
      <div className="button-box flex gap-4 justify-center mb-4">
        {array.map((e, i) => (
          <button
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
    </>
  );
}
