import { useEffect, useRef, useState } from "react";

import cornerstone from "cornerstone-core";
import dicomParser from "dicom-parser";
//@ts-ignore
import { DicomViewer as reactDicomViewer } from "react-dicom-viewer";
//@ts-ignore
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

export default function DicomViewer() {
  const [dicomFile, setDicomFile] = useState("0000.dcm");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState();

  const el = reactDicomViewer({
    requestType: "dicomfile",
    url: `/dicom/${dicomFile}`,
    windowCenter: 1,
    color: true,
    onSuccess: () => {
      // Handle success event
    },
    onFail: () => {
      // Handle failure event
    },
  });

  useEffect(() => {
    // Clean up the viewer when the component unmounts
    return () => {
      // el && el?.cleanup();
    };
  }, [dicomFile]);

  useEffect(() => {
    if (!dicomFile) return;

    // requestType: "wadouri" | "wadors" | "dicomweb" | "dicomfile";
    // url: string;
    // slope?: number;
    // intercept?: number;
    // rows?: number;
    // columns?: number;
    const loadDicomImage = async (dicomFile: string) => {
      const response = await fetch(`/dicom/${dicomFile}`);
      const dicomArrayBuffer = await response.arrayBuffer();

      const dataSet = dicomParser.parseDicom(new Uint8Array(dicomArrayBuffer));
      const pixelDataElement = dataSet.elements.x7fe00010;
      const pixelData = new Uint8Array(
        dicomArrayBuffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length
      );

      if (canvasRef?.current === null) return;

      const imageId = `dicom:${dicomFile}`;
      cornerstone.enable(canvasRef.current);

      // Initialize cornerstoneWADOImageLoader
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
      cornerstoneWADOImageLoader.webWorkerManager.initialize();

      // try {
      //   const imagePromise = await cornerstoneWADOImageLoader.wadouri.loadImage(
      //     imageId
      //   );
      //   if (imagePromise.promise.PromiseState === "rejected")
      //     return console.log("실패");

      //   setImage(imagePromise.promise);
      //   cornerstone.displayImage(canvasRef?.current, image);
      //   // imagePromise
      //   //   .then((image: any) => {
      //   //     if (canvasRef?.current === null) return;

      //   //     cornerstone.displayImage(canvasRef?.current, image);
      //   //   })
      //   //   .catch((error: any) => {
      //   //     console.error("Error loading DICOM image:", error);
      //   //   });
      // } catch (err) {
      //   console.log(err);
      // } finally {
      //   console.log(image);
      // }
    };

    loadDicomImage(dicomFile);

    return () => {
      canvasRef.current && cornerstone.disable(canvasRef.current);
    };
  }, [dicomFile]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export { DicomViewer };
