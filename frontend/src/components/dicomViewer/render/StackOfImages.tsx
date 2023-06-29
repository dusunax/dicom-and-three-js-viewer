import { Fragment, useEffect, useRef, useState } from "react";

import * as cornerstone from "cornerstone-core";

import useCornerstone from "../hooks/useCornerstone";

import SectionWrap from "../components/common/SectionWrap";

export default function StackOfImages() {
  const { itemSrcArray } = useCornerstone();
  const elementRef = useRef<HTMLDivElement | null>(null);

  // 컴포넌트 UI에 사용할 state
  const [imageIndex, setImageIndex] = useState(0);
  const rowLimit = 10;

  useEffect(() => {
    // init
    const element = elementRef.current;
    if (!element) throw new Error("ref가 존재하지 않습니다.");

    cornerstone.disable(element);
    cornerstone.enable(element, {
      renderer: "webgl",
    });

    const imageStack = {
      currentImageIdIndex: imageIndex,
      imageIds: itemSrcArray,
    };

    // load
    const loadImage = async (index: number) => {
      try {
        cornerstone.loadImage(imageStack.imageIds[index]).then((image) => {
          cornerstone.displayImage(element, image);
        });
      } catch (error) {
        console.error("Error loading DICOM image:", error);
      }
    };

    loadImage(imageIndex);

    return () => {
      cornerstone.disable(element);
    };
  }, [imageIndex]);

  useEffect(() => {
    // 키 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown);

    // 컴포넌트 언마운트 시, 키 이벤트 리스너 제거
    return () => {
      document?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 핸들러

  // 버튼 이벤트
  const buttonClickHandler = (index: number) => {
    setImageIndex(index);
  };

  // 키 이벤트
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      // 좌측 키를 눌렀을 때
      setImageIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
        return newIndex;
      });
    } else if (event.key === "ArrowRight") {
      // 우측 키를 눌렀을 때
      setImageIndex((prevIndex) => {
        const newIndex =
          prevIndex + 1 < itemSrcArray.length ? prevIndex + 1 : prevIndex;
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      setImageIndex((prevIndex) => {
        const newIndex =
          prevIndex - rowLimit + 1 > 0 ? prevIndex - rowLimit : prevIndex;
        return newIndex;
      });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      setImageIndex((prevIndex) => {
        const newIndex =
          prevIndex + rowLimit < itemSrcArray.length
            ? prevIndex + rowLimit
            : prevIndex;
        return newIndex;
      });
    }
  };

  return (
    <SectionWrap title="Image Stack">
      <div className="relative w-[700px] mx-auto my-2">
        <div
          id="content"
          ref={elementRef}
          className="w-[700px] h-[400px] mx-auto border-cyan-400 border-spacing-2 bg-black"
        ></div>

        <div
          className={`px-4 pb-4 border-2 rounded-md shadow-lg button-box absolute -top-24 ${
            (imageIndex / itemSrcArray.length) * 100 > 50
              ? "-translate-y-[30%]"
              : ""
          } -right-4 translate-x-full transition-all bg-white`}
        >
          <h3 className="h-2 font-semibold">image index</h3>
          {itemSrcArray.map((e, i) => {
            return (
              <Fragment key={e}>
                {i % rowLimit === 0 ? <br /> : ""}
                <button
                  className={`w-4 h-4 mx-1 rounded-full text-xs ${
                    i === imageIndex ? "bg-cyan-300" : ""
                  }`}
                  onClick={() => buttonClickHandler(i)}
                >
                  {i + 1}
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>
    </SectionWrap>
  );
}
