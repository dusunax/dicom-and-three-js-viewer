import { useSearchParams } from "react-router-dom";

import useCornerstone from "../hooks/useCornerstone";

import StackOfImages from "../render/StackOfImages";
import StackOfImagesWithChangeIndex from "../render/StackOfImagesWithChangeIndex";
import StackOfImagesWithPanAndRotate from "../render/StackOfImagesWithPanAndRotate";
import StackOfImagesWithToolsBox from "../render/StackOfImagesWithToolsBox";

export default function CurrentTabComponent({
  tabIndex,
}: {
  tabIndex: number;
}) {
  const useCornerstoneProps = useCornerstone();

  const exampleOption = [
    {
      component: <StackOfImages useCornerstoneProps={useCornerstoneProps} />,
    },
    {
      component: (
        <StackOfImagesWithChangeIndex
          useCornerstoneProps={useCornerstoneProps}
        />
      ),
    },
    {
      component: (
        <StackOfImagesWithPanAndRotate
          useCornerstoneProps={useCornerstoneProps}
        />
      ),
    },
    {
      component: (
        <StackOfImagesWithToolsBox useCornerstoneProps={useCornerstoneProps} />
      ),
    },
  ];

  return <>{exampleOption[tabIndex].component}</>;
}
