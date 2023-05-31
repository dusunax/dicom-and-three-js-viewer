import { useState } from "react";

import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";

export default function useCornerstone() {
  const [imageIndex, setImageIndex] = useState(0);
  const ITEM_LENGTH = 400;

  /** ImageIds 리스트 */
  const itemSrcArray = new Array(ITEM_LENGTH).fill(0).map((_, index) => {
    const fileName = String(index).padStart(4, "0");
    return `wadouri:/dicom/${fileName}.dcm`;
  });

  /** 컬러맵 배열 */
  const [colorMapList, setColorMapList] = useState(
    cornerstone.colors.getColormapsList()
  );

  /** [0: Pan, 1: Magnify, 2: Angle, 3: Wwwc, 4: Eraser] */
  const leftMouseToolChain = [
    { name: "Pan", func: cornerstoneTools.PanTool, config: {} },
    { name: "Zoom", func: cornerstoneTools.ZoomTool, config: {} },
    { name: "Wwwc", func: cornerstoneTools.WwwcTool, config: {} },
    { name: "Magnify", func: cornerstoneTools.MagnifyTool, config: {} },
    { name: "Angle", func: cornerstoneTools.AngleTool, config: {} },
    { name: "Eraser", func: cornerstoneTools.EraserTool, config: {} },
  ];

  // Grab Tool Classes
  const WwwcTool = cornerstoneTools.WwwcTool;
  const PanTool = cornerstoneTools.PanTool;
  const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
  const ZoomTool = cornerstoneTools.ZoomTool;
  const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
  const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

  // 이미지 레이어 (프리뷰) 정보
  const itemLayers = [
    {
      images: itemSrcArray,
      layerId: "",
      options: {
        visible: true,
        opacity: 1,
        name: "Layer01",
        viewport: {
          colormap: "",
        },
      },
    },
  ];

  return {
    imageIndex,
    setImageIndex,
    itemSrcArray,
    ITEM_LENGTH,
    leftMouseToolChain,
    colorMapList,
    itemLayers,
  };
}
