import { useState } from "react";

export interface UseCornerstone {
  imageIndex: number;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  itemSrcArray: string[];
  itemLength: number;
}

export default function useCornerstone() {
  const [imageIndex, setImageIndex] = useState(0);
  const itemLength = 100;
  const itemSrcArray = new Array(itemLength).fill(0).map((_, index) => {
    const fileName = String(index).padStart(4, "0");
    return `wadouri:/dicom/${fileName}.dcm`;
  });

  return { imageIndex, setImageIndex, itemSrcArray, itemLength };
}
