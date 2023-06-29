import { useEffect, useRef, useState } from "react";

import { VtkContext } from "@/types/vtkContext";
import { ViewerConfig } from "@/types/loader";

// vtk.js
import "@kitware/vtk.js/Rendering/Profiles/Geometry";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
//@ts-ignore
import vtkImageMarchingCubes from "@kitware/vtk.js/Filters/General/ImageMarchingCubes";

// itk
import { readImageDICOMFileSeries } from "itk-wasm";
import { convertItkToVtkImage } from "@kitware/vtk.js/Common/DataModel/ITKHelper";

export default function useVtkViewer() {
  const [progress, setProgress] = useState(0);
  const [loadingStateMsg, setIsLoadingStateMsg] = useState("");
  const dicomLength = 400;

  const [isLoading, setIsLoading] = useState(false);

  const vtkContainerRef = useRef<HTMLDivElement | null>(null);
  const context = useRef<VtkContext>({});

  const viewerConfig: ViewerConfig = {
    background: [0, 0, 0, 0.2],
  };

  useEffect(() => {
    if (isLoading || progress === dicomLength || !vtkContainerRef.current)
      return;

    setIsLoading(true);

    if (
      context.current.fullScreenRenderer === undefined ||
      context.current.fullScreenRenderer?.isDeleted()
    ) {
      initialize(viewerConfig, vtkContainerRef.current);
    }
  }, []);

  // 1
  function initialize(viewerConfig: ViewerConfig, container: HTMLDivElement) {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: viewerConfig.background,
      listenWindowResize: true,
      container,
    });

    const renderWindow = fullScreenRenderer.getRenderWindow();
    const renderer = fullScreenRenderer.getRenderer();

    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    const marchingCube = vtkImageMarchingCubes.newInstance({
      computeNormals: true,
      mergePoints: true,
    });

    actor.getProperty().setDiffuseColor(1, 0.95, 0.9);
    actor.setMapper(mapper);

    const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

    context.current = {
      reader,
      actor,
      mapper,
      renderer,
      renderWindow,
      marchingCube,
      fullScreenRenderer,
    };

    loadHandler();
  }

  // 2
  async function loadHandler() {
    const fileList = [];

    try {
      for (let i = 0; i < dicomLength; i++) {
        setProgress(i + 1);

        const fileName = i.toString().padStart(4, "0");
        const response = await fetch(`/dicom/${fileName}.dcm`);
        const dicomData = await response.arrayBuffer();

        fileList.push(new File([dicomData], `${fileName}.dcm`));
      }
      setIsLoadingStateMsg("calculating...");
      const result = await readImageDICOMFileSeries(fileList);
      result.webWorkerPool.terminateWorkers();

      setIsLoadingStateMsg("rendering...");
      renderVolumeData({ itkImage: result.image });
    } catch (error) {
      console.error("Error processing DICOM file:", error);
    }
  }

  // 3
  function renderVolumeData({ itkImage }: { itkImage: any }) {
    const imageData = convertItkToVtkImage(itkImage);

    const { renderer, renderWindow, actor, marchingCube, reader, mapper } =
      context.current;
    if (!renderer || !renderWindow || !actor || !reader || !mapper)
      return console.log("render view failed: no renderer or actor or reader");

    mapper.setInputConnection(marchingCube.getOutputPort());
    marchingCube.setInputConnection(reader.getOutputPort());

    marchingCube.setInputData(imageData);
    marchingCube.setContourValue(90);

    renderer.getActiveCamera().set({
      viewUp: [0, 0, 1],
      position: [1, -1, 0],
    });
    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    setIsLoadingStateMsg("");
    setIsLoading(false);
  }

  function updateContourValue(value: number): void {
    setIsLoadingStateMsg("calculating...");

    const { marchingCube, renderWindow } = context.current;
    marchingCube.setContourValue(value);
    renderWindow?.render();

    setIsLoadingStateMsg("");
  }

  return {
    progress,
    loadingStateMsg,
    dicomLength,
    vtkContainerRef,
    context,
    updateContourValue,
  };
}
