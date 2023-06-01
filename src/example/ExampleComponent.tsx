import { ReactNode, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import addCornerstoneExternals from "./utils/addCornerstoneExternals";
import useCornerstone from "./hooks/useCornerstone";

import StackOfImages from "@/example/render/StackOfImages";
import StackOfImagesWithChangeIndex from "./render/StackOfImagesWithChangeIndex";
import StackOfImagesWithPanAndRotate from "./render/StackOfImagesWithPanAndRotate";
import StackOfImagesWithToolsBox from "./render/StackOfImagesWithToolsBox";

export default function ExampleComponent() {
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);
  const componentRef = useRef<ReactNode>(null);

  const useCornerstoneProps = useCornerstone();

  useEffect(() => {
    addCornerstoneExternals();
  }, []);

  // example 옵션 리스트
  const exampleOption = [
    {
      name: "Stack of Image",
      description: {
        en: "ImageStack: basic rendering",
        kor: "ImageStack: 기본 출력",
      },
      component: <StackOfImages useCornerstoneProps={useCornerstoneProps} />,
    },
    {
      name: "Stack of Image and changing indexes",
      description: {
        en: "ImageStack: change image stack's indexes",
        kor: "ImageStack: 이미지 index 변경",
      },
      component: (
        <StackOfImagesWithChangeIndex
          useCornerstoneProps={useCornerstoneProps}
        />
      ),
    },
    {
      name: "Stack of Image with Pan & Rotate",
      description: {
        en: "CornerstoneTools: Pan to Drag and Scroll to wheel",
        kor: "CornerstoneTools: Pan(왼쪽), Rotate(휠)",
      },
      component: (
        <StackOfImagesWithPanAndRotate
          useCornerstoneProps={useCornerstoneProps}
        />
      ),
    },
    {
      name: "Stack of Image with Tools box",
      description: {
        en: "CornerstoneTools: Tools box",
        kor: "CornerstoneTools: 툴박스",
      },
      component: (
        <StackOfImagesWithToolsBox useCornerstoneProps={useCornerstoneProps} />
      ),
    },
  ];

  // tab index 설정
  const liClickHandler = (index: number) => {
    URLSearchParams.set("example", String(index));
    SetURLSearchParams(URLSearchParams.toString());
  };

  useEffect(() => {
    if (URLSearchParams.get("example") === undefined) return;

    const newIndex = Number(URLSearchParams.get("example"));

    setTabIndex(newIndex);
    componentRef.current = exampleOption[newIndex].component;
  }, [URLSearchParams.get("example")]);

  return (
    <div className="text-center">
      <h1 className="py-2">with Cornerstone.js</h1>

      {/* 탭 리스트, tab list */}
      <ul className="text-sm">
        {exampleOption.map((e, idx) => {
          return (
            <li
              key={e.name}
              className={`cursor-pointer ${
                tabIndex === idx ? "font-bold underline" : ""
              }`}
              onClick={() => liClickHandler(idx)}
            >
              {idx}. {e.name}
            </li>
          );
        })}
      </ul>

      {/* 각 탭 컴포넌트 */}
      {componentRef.current}
    </div>
  );
}
