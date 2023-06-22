import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
//@ts-ignore
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
//@ts-ignore
import * as cornerstoneTools from "cornerstone-tools";
//@ts-ignore
import * as cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

// Cornerstone Externals
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

export default function addCornerstoneExternals() {
  cornerstoneTools.external.cornerstone = cornerstone;

  return cornerstoneTools;
}
