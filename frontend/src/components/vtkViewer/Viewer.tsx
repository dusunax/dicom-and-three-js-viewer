import { RenderType } from "@/types/loader";

import Dcm from "./format/Dcm";
import Sample from "./format/Sample";

export default function VtkViewer({ renderType }: { renderType: RenderType }) {
  return (
    <>
      {renderType === "volume" && <Dcm />}
      {renderType === "sample" && <Sample />}
    </>
  );
}
