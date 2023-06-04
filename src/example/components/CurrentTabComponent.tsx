import StackOfImages from "../render/StackOfImages";
import StackOfImagesWithChangeIndex from "../render/StackOfImagesWithChangeIndex";
import StackOfImagesWithPanAndRotate from "../render/StackOfImagesWithPanAndRotate";
import StackOfImagesWithToolsBox from "../render/StackOfImagesWithToolsBox";

export default function CurrentTabComponent({
  tabIndex,
}: {
  tabIndex: number;
}) {
  const exampleComponents = [
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

  return <>{exampleComponents[tabIndex].component}</>;
}
