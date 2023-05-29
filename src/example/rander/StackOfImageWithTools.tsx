import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneMath from "cornerstone-math";
//@ts-ignore
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import SectionWrap from "./common/SectionWrap";

// Cornerstone Externals
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

export default function StackOfImageWithTools() {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const itemLength = 100;
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

    cornerstoneTools.init({
      globalToolSyncEnabled: true,
    });

    // Grab Tool Classes
    const WwwcTool = cornerstoneTools.WwwcTool;
    const PanTool = cornerstoneTools.PanTool;
    const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
    const ZoomTool = cornerstoneTools.ZoomTool;
    const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

    // Add them
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(ZoomTool);
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(PanMultiTouchTool);
    cornerstoneTools.addTool(ZoomTouchPinchTool);
    cornerstoneTools.addTool(ZoomMouseWheelTool);

    // Set tool modes
    cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 4 }); // Middle
    cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 }); // Right
    cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 }); // Left & Touch
    cornerstoneTools.setToolActive("PanMultiTouch", {});
    cornerstoneTools.setToolActive("ZoomMouseWheel", {});
    cornerstoneTools.setToolActive("ZoomTouchPinch", {});

    const synchronizer = new cornerstoneTools.Synchronizer(
      "cornerstonenewimage",
      cornerstoneTools.updateImageSynchronizer
    );

    const imageStack = {
      currentImageIdIndex: imageIndex,
      imageIds: itemSrcArray,
    };

    // load
    const loadImage = async () => {
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

    loadImage();

    return () => {
      cornerstone.disable(element);
    };
  }, []);

  useEffect(() => {
    cornerstone.loadImage(itemSrcArray[imageIndex]).then((image) => {
      const element = elementRef.current;
      if (!element) throw new Error("ref가 존재하지 않습니다.");

      debounce(() => {
        cornerstone.displayImage(element, image);
      }, 100)();
    });
  }, [imageIndex]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numIndex = Number(e.target.value);
    if (numIndex >= 0 && numIndex < itemLength) {
      setImageIndex(numIndex);
      cornerstone.loadImage(itemSrcArray[imageIndex]);
    }
  };

  return (
    <SectionWrap title="Image Stack With Tools">
      <div className="button-box flex gap-4 justify-center mb-4">
        <input
          type="range"
          name="progress"
          id="progress"
          className="w-[500px]"
          value={imageIndex}
          onChange={(e) => inputChangeHandler(e)}
          min={0}
          max={100}
        />

        <input
          type="number"
          value={imageIndex}
          onChange={inputChangeHandler}
          className={`w-16 h-10 pl-4 shadow-lg border-2 border-gray-600 rounded-lg outline-none`}
        />
      </div>

      <div
        id="content"
        ref={elementRef}
        className="w-[600px] h-[300px] mx-auto border-cyan-400 border-spacing-2 bg-black"
      ></div>
    </SectionWrap>
  );
}
