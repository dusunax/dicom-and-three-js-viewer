import { Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useCornerstone from "../hooks/useCornerstone";

export default function TabNavigation({
  setTabIndex,
}: {
  setTabIndex: Dispatch<SetStateAction<number>>;
}) {
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();

  // 커스텀훅
  const useCornerstoneProps = useCornerstone();
  const { EXAMPLE_OPTION } = useCornerstoneProps;

  // tab 핸들러

  /** li을 클릭했을 때, 해당 index로 query를 설정합니다. */
  const tabIndexClickHandler = (index: number) => {
    URLSearchParams.set("example", String(index));
    SetURLSearchParams(URLSearchParams.toString());
  };

  // tab change useEffect
  useEffect(() => {
    if (URLSearchParams.get("example") === null) return;

    const newIndex = Number(URLSearchParams.get("example"));
    setTabIndex(newIndex);
  }, [URLSearchParams.get("example")]);

  return (
    <ul className="w-3/4 mx-auto p-4 text-sm border-2">
      {EXAMPLE_OPTION.map((e, idx) => {
        return (
          <li
            key={e.name}
            className={`cursor-pointer ${
              URLSearchParams.get("example") &&
              Number(URLSearchParams.get("example")) === idx
                ? "font-bold underline"
                : ""
            }`}
            onClick={() => tabIndexClickHandler(idx)}
          >
            {idx}. {e.name}
          </li>
        );
      })}
    </ul>
  );
}
