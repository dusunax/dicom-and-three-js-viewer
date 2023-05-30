import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";

import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";

import { UseCornerstone } from "../models/cornerstone";

import SectionWrap from "../components/common/SectionWrap";

export default function StackOfImageWithTools({
  useCornerstoneProps,
}: {
  useCornerstoneProps: UseCornerstone;
}) {
  const {
    imageIndex,
    itemSrcArray,
    setImageIndex,
    ITEM_LENGTH: itemLength,
  } = useCornerstoneProps;
  const elementRef = useRef<HTMLDivElement | null>(null);

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
      "stackOfImageWithTools",
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

  // imageIndex 값이 바뀔 때, display 이미지를 load합니다.
  useEffect(() => {
    cornerstone.loadImage(itemSrcArray[imageIndex]).then((image) => {
      const element = elementRef.current;
      if (!element) throw new Error("ref가 존재하지 않습니다.");

      debounce(() => {
        cornerstone.displayImage(element, image);
      }, 100)();
    });
  }, [imageIndex]);

  /** input의 값이 변할 때, 0 ~ itemLength 인덱스의 이미지를 출력합니다. */
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numIndex = Number(e.target.value);
    if (numIndex >= 0 && numIndex < itemLength) {
      setImageIndex(numIndex);
      cornerstone.loadImage(itemSrcArray[imageIndex]);
    }
  };

  return (
    <SectionWrap title="Image Stack With Tools: Zoom & WWWC">
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
        id="contentOne"
        ref={elementRef}
        className="w-[600px] h-[300px] mx-auto border-cyan-400 border-spacing-2 bg-black"
      ></div>
    </SectionWrap>
  );
}
