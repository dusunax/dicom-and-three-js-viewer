import { useState } from "react";

//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";

export interface UseCornerstone {
  imageIndex: number;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  itemSrcArray: string[];
  ITEM_LENGTH: number;
  leftMouseToolChain: {
    name: string;
    func: any;
    config: {};
  }[];
}

export default function useCornerstone() {
  const [imageIndex, setImageIndex] = useState(0);
  const ITEM_LENGTH = 100;

  const itemSrcArray = new Array(ITEM_LENGTH).fill(0).map((_, index) => {
    const fileName = String(index).padStart(4, "0");
    return `wadouri:/dicom/${fileName}.dcm`;
  });

  const leftMouseToolChain = [
    { name: "Pan", func: cornerstoneTools.PanTool, config: {} },
    { name: "Magnify", func: cornerstoneTools.MagnifyTool, config: {} },
    { name: "Angle", func: cornerstoneTools.AngleTool, config: {} },
    { name: "Wwwc", func: cornerstoneTools.WwwcTool, config: {} },
    { name: "Eraser", func: cornerstoneTools.EraserTool, config: {} },
  ];

  return {
    imageIndex,
    setImageIndex,
    itemSrcArray,
    ITEM_LENGTH,
    leftMouseToolChain,
  };
}
