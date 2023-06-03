import { useState } from "react";

import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";
import { ExampleOption } from "../models/cornerstone";

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
  const LEFT_MOUSE_TOOLS = [
    {
      name: "Pan",
      func: cornerstoneTools.PanTool,
      subTools: [
        {
          name: "PanMultiTouch",
          func: cornerstoneTools.PanMultiTouchTool,
          config: {},
        },
      ],
      config: {},
    },
    {
      name: "Zoom",
      func: cornerstoneTools.ZoomTool,
      subTools: [
        {
          name: "ZoomTouchPinch",
          func: cornerstoneTools.ZoomTouchPinchTool,
          config: {},
        },
        {
          name: "ZoomMouseWheel",
          func: cornerstoneTools.ZoomMouseWheelTool,
          config: {},
        },
      ],
      config: {},
    },
    { name: "Wwwc", func: cornerstoneTools.WwwcTool, subTools: [], config: {} },
    {
      name: "Magnify",
      func: cornerstoneTools.MagnifyTool,
      subTools: [],
      config: {},
    },
    {
      name: "Angle",
      func: cornerstoneTools.AngleTool,
      subTools: [],
      config: {},
    },
    {
      name: "Eraser",
      func: cornerstoneTools.EraserTool,
      subTools: [],
      config: {},
    },
  ];

  // example 옵션 리스트
  const EXAMPLE_OPTION: ExampleOption[] = [
    {
      name: "Stack of Image",
      description: {
        en: "ImageStack: basic rendering",
        kor: "ImageStack: 기본 출력",
      },
    },
    {
      name: "Stack of Image and changing indexes",
      description: {
        en: "ImageStack: change image stack's indexes",
        kor: "ImageStack: 이미지 index 변경",
      },
    },
    {
      name: "Stack of Image with Pan & Rotate",
      description: {
        en: "CornerstoneTools: Pan to Drag and Scroll to wheel",
        kor: "CornerstoneTools: Pan(왼쪽), Rotate(휠)",
      },
    },
    {
      name: "Stack of Image with Tools box",
      description: {
        en: "CornerstoneTools: Tools box",
        kor: "CornerstoneTools: 툴박스",
      },
    },
  ];

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

    // constants
    ITEM_LENGTH,
    LEFT_MOUSE_TOOLS,
    EXAMPLE_OPTION,

    colorMapList,
    itemLayers,
  };
}
