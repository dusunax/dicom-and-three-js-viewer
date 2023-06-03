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
      component: <StackOfImages />,
    },
    {
      component: <StackOfImagesWithChangeIndex />,
    },
    {
      component: <StackOfImagesWithPanAndRotate />,
    },
    {
      component: <StackOfImagesWithToolsBox />,
    },
  ];

  return <>{exampleOption[tabIndex].component}</>;
}
