import { useEffect, useRef, useState } from "react";
import { useAsyncFn } from "react-use";

import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";

import { Layer, Tool } from "../types/cornerstone";

import useCornerstone from "../hooks/useCornerstone";

import SectionWrap from "../components/common/SectionWrap";
import Spinner from "@/components/element/ui/Spinner";

// ToolBox
export default function StackOfImagesWithToolsBox() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { LEFT_MOUSE_TOOLS, itemLayers, RIGHT_MOUSE_TOOLS } = useCornerstone();
  const [loaded, setLoaded] = useState(false);

  // 툴박스 컴포넌트 UI에 사용할 state
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  /** set tools: 도구를 설정합니다.
   * @method setToolsByIndex
   *
   * @param  {number} index  target index of the tools list.
   * @param  {Tool} tools  tools list. ex) LEFT_MOUSE_TOOLS, RIGHT_MOUSE_TOOLS...
   * @param  {number} mouseButtonMask 1: left mouse button, 2: right mouse button
   */
  const setToolsByIndex = (
    index: number,
    tools: Tool[],
    mouseButtonMask: number
  ) => {
    const element = elementRef.current;
    if (!element) return;

    const toolStateManager =
      cornerstoneTools.getElementToolStateManager(element);
    toolStateManager.clear(element);

    cornerstoneTools.addTool(tools[index].func, {
      configuration: tools[index].config,
    });
    cornerstoneTools.setToolActive(tools[index].name, {
      mouseButtonMask: mouseButtonMask,
    });
  };

  /** initialize 초기화 */
  async function initElement(element: HTMLDivElement) {
    // cornerstone.disable(element);
    cornerstone.enable(element, {
      renderer: "webgl",
    });

    // initialize tools
    cornerstoneTools.init({
      showSVGCursors: true,
    });
    cornerstoneTools.getElementToolStateManager(element).clear(element);

    setToolsByIndex(0, RIGHT_MOUSE_TOOLS, 2);
    setToolsByIndex(0, LEFT_MOUSE_TOOLS, 1);

    // initialize images
    const image = await loadImageOption(itemLayers[0]);
    image?.forEach((img, index) => {
      if (elementRef.current === null) return;
      const layer = itemLayers[index];

      if (layer && layer.options) {
        const layerId = cornerstone.addLayer(
          elementRef.current,
          img,
          layer.options
        );
        itemLayers[index].layerId = layerId;

        cornerstone.updateImage(elementRef.current);
      }
    });
  }

  /** 사용할 이미지 레이어를 load & cache합니다. */
  const [loadImageOptionState, loadImageOption] = useAsyncFn(
    async (layer: Layer) => {
      const promises: Promise<cornerstone.Image>[] = [];

      try {
        if (layer.options.visible && layer.images) {
          // layer.images.forEach((image) => {
          //   promises.push(cornerstone.loadAndCacheImage(image));
          // });

          // 이미지 1장만 사용
          promises.push(cornerstone.loadAndCacheImage(layer.images[0]));
        }
        return await Promise.all(promises);
      } catch (e) {
        console.error("Error loading images:", e);
        throw e;
      }
    },
    []
  );

  // mount시, rerender를 enable합니다.
  useEffect(() => {
    const currentEl = elementRef.current;
    if (!currentEl) return;

    if (!loaded) {
      initElement(currentEl);
    } else {
      setToolsByIndex(leftIndex, LEFT_MOUSE_TOOLS, 1);
      setToolsByIndex(rightIndex, RIGHT_MOUSE_TOOLS, 2);

      // 이벤트 리스너 등록
      currentEl.addEventListener(
        "wheel",
        (event: globalThis.WheelEvent) =>
          currentEl && handleMouseWheel(event, currentEl)
      );
    }

    return () => {
      // 컴포넌트 unmount시, 이벤트 리스너 제거
      currentEl.removeEventListener(
        "wheel",
        (event) => currentEl && handleMouseWheel(event, currentEl)
      );
    };
  }, [leftIndex, rightIndex]);

  // 마우스 휠 이벤트 핸들러 함수
  const handleMouseWheel = (
    event: globalThis.WheelEvent,
    element: HTMLDivElement
  ) => {
    event.preventDefault();

    const delta = Math.max(-1, Math.min(1, event.deltaY)); // 휠 움직임 방향 결정

    const viewport = cornerstone.getViewport(element);
    if (!viewport) {
      return;
    }

    viewport.rotation += delta * 1; // 회전 각도 변경
    cornerstone.setViewport(element, viewport);
  };

  return (
    <div onContextMenu={(event) => event.preventDefault()}>
      <SectionWrap title="CornerstoneTools: Tools box">
        <ul className="my-2 flex gap-2 justify-center items-center">
          left [왼쪽 클릭]:
          {LEFT_MOUSE_TOOLS.map((tool, idx) => {
            const isActive =
              leftIndex === idx ? "bg-slate-400 text-slate-50" : "";

            return (
              <li
                className={`p-2 border-2 cursor-pointer hover:bg-slate-400 hover:text-slate-50 ${isActive}`}
                key={tool.name}
                onClick={() => setLeftIndex(idx)}
              >
                {tool.name}
              </li>
            );
          })}
        </ul>

        <ul className="my-2 flex gap-2 justify-center items-center">
          Right [오른쪽 클릭]:
          {RIGHT_MOUSE_TOOLS.map((tool, idx) => {
            const isActive =
              rightIndex === idx ? "bg-slate-400 text-slate-50" : "";

            return (
              <li
                className={`p-2 border-2 cursor-pointer hover:bg-slate-400 hover:text-slate-50 ${isActive}`}
                key={tool.name}
                onClick={() => setRightIndex(idx)}
              >
                {tool.name}
              </li>
            );
          })}
        </ul>

        <div
          id="contentOne"
          ref={elementRef}
          className="w-[700px] h-[400px] mx-auto relative overflow-hidden border-cyan-400 border-spacing-2 bg-black"
        ></div>

        {loadImageOptionState.loading && (
          <div className="my-4 flex items-center justify-center">
            loading...
            <Spinner />
          </div>
        )}
      </SectionWrap>
    </div>
  );
}
