import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as dicomParser from "dicom-parser";

import useViewer from "./useViewer";

export default function useDICOM() {
  const { loading } = useViewer();
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();

  //-------------------------------------------------------------
  // Load DICOM
  //-------------------------------------------------------------

  /** filePath의 ArrayBuffer를 반환합니다. */
  const fetchDICOMArrayBufferFromFile = async (
    filePath: string
  ): Promise<ArrayBuffer> => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  };

  /** DICOM pixelData 데이터를 반환합니다. */
  const getDICOMData = async (filePath: string) => {
    try {
      console.log(filePath);
      const byteArray = new Uint8Array(
        await fetchDICOMArrayBufferFromFile(filePath)
      );

      const options = { TransferSyntaxUID: "1.2.840.10008.1.2" };
      const dataSet = dicomParser.parseDicom(byteArray, options);

      const studyInstanceUid = dataSet.string("x0020000d");
      const pixelDataElement = dataSet.elements.x7fe00010;

      const pixelData = new Uint16Array(
        dataSet.byteArray.buffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length / 2
      );

      return pixelData;
    } catch (ex) {
      console.log("Error parsing byte stream", ex);
    }
  };

  /** DICOM Image 랜더 */
  const renderDICOMImage = (
    canvas: HTMLCanvasElement,
    pixelData: Uint16Array,
    width: number,
    height: number
  ) => {
    const context = canvas.getContext("2d");
    if (!context) return console.log("canvas context가 없습니다.");

    const imageData = context.createImageData(width, height);
    const data = imageData.data;

    // Convert the pixel data to RGBA format and populate the ImageData
    for (let i = 0; i < pixelData.length; i++) {
      const value = pixelData[i];
      const offset = i * 4;

      const grayscaleValue = value >> 8;

      data[offset] = grayscaleValue; // Red component
      data[offset + 1] = grayscaleValue; // Green component
      data[offset + 2] = grayscaleValue; // Blue component
      data[offset + 3] = 255; // Alpha component (fully opaque)
    }

    console.log(data);
    // Draw the ImageData on the canvas
    context.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    // const dicomId = URLSearchParams.get("id");
    const dicomId = "0000";
    const filePath = `/dicom/${dicomId}.dcm`;

    getDICOMData(filePath).then(async (pixelData) => {
      console.log(pixelData);
      if (!pixelData) return;

      const container = document.getElementById("viewer");
      const canvas = document.querySelector("canvas");
      if (!container || !canvas)
        return console.log("canvas 또는 viewer가 존재하지 않음");

      container && canvas && container.appendChild(canvas);
      renderDICOMImage(canvas, pixelData, 2000, 800);
    });
  }, [loading, URLSearchParams.get("dicom-id")]);

  return {};
}
