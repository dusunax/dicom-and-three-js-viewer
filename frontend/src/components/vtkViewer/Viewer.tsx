import { RenderType } from "@/types/loader";

import Dcm from "./format/Dcm";
import SampleA from "./format/SampleA";
import SampleB from "./format/SampleB";

export default function VtkViewer({ renderType }: { renderType: RenderType }) {
  return (
    <>
      {renderType === "contour" && <Dcm />}
      {renderType === "sample-a" && <SampleA />}
      {renderType === "sample-b" && <SampleB />}
    </>
  );
}
