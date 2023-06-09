import React, { useEffect } from "react";
import vtkImageData, {
  IImageDataInitialValues,
} from "vtk.js/Sources/Common/DataModel/ImageData";
import dicomParser from "dicom-parser";

const ConvertDICOMToPLY = () => {
  useEffect(() => {
    const convertDICOMToPLY = async () => {
      const response = await fetch("/dicom/0030.dcm");
      const dicomData = await response.arrayBuffer();
      const byteArray = new Uint8Array(dicomData);

      // Parse DICOM file
      const dataSet = dicomParser.parseDicom(byteArray);

      // Extract DICOM pixel data
      const pixelDataElement = dataSet.elements.x7fe00010;
      const pixelDataOffset = pixelDataElement.dataOffset;
      const pixelDataLength = pixelDataElement.length;
      const pixelData = new Uint8Array(
        dicomData,
        pixelDataOffset,
        pixelDataLength
      );

      // Extract DICOM image dimensions
      const rows = dataSet.uint16("x00280010");
      const columns = dataSet.uint16("x00280011");
      const numberOfFrames = 1;
      const bitsAllocated = dataSet.uint16("x00280100");
      const spacingBetweenSlices = 1;

      console.log(
        pixelData,
        rows,
        columns,
        numberOfFrames,
        bitsAllocated,
        spacingBetweenSlices
      );

      if (columns === undefined || rows === undefined) return;

      // Create vtkImageData
      const imageData = vtkImageData.newInstance({
        spacing: [1, 1, spacingBetweenSlices],
        origin: [0, 0, 0],
        extent: [0, columns - 1, 0, rows - 1, 0, numberOfFrames - 1],
        dimensions: [columns, rows, numberOfFrames],
        pointData: {
          scalars: {
            name: "Pixels",
            numberOfComponents: 1,
            values: pixelData,
          },
        },
      } as IImageDataInitialValues);

      console.log(imageData);
      // Perform further processing or visualization with imageData
    };

    convertDICOMToPLY();
  }, []);

  return <div>Converting DICOM to PLY...</div>;
};

export default ConvertDICOMToPLY;
