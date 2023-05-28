import React, { useEffect, useRef } from "react";
import cornerstone from "cornerstone-core";
import * as dicomParser from "dicom-parser";

// const DicomViewer = ({ dicomFile }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadDicomImage = async () => {
//       const response = await fetch(dicomFile);
//       const dicomArrayBuffer = await response.arrayBuffer();
//       const dataSet = dicomParser.parseDicom(dicomArrayBuffer);
//       const pixelDataElement = dataSet.elements.x7fe00010;
//       const pixelData = new Uint8Array(
//         dicomArrayBuffer,
//         pixelDataElement.dataOffset,
//         pixelDataElement.length
//       );

//       const imageId = `dicom:${dicomFile}`;
//       cornerstone.enable(canvasRef.current);
//       cornerstone.loadImage(imageId, pixelData);

//       // Optional: Perform additional configuration or image processing

//       cornerstone.displayImage(canvasRef.current, imageId);
//     };

//     loadDicomImage();

//     return () => {
//       // Clean up when component unmounts
//       cornerstone.disable(canvasRef.current);
//     };
//   }, [dicomFile]);

//   return <canvas ref={canvasRef} />;
// };

// export { DicomViewer };

export default function DicomViewer() {
  return <>DicomViewer</>;
}
