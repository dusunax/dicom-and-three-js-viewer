import { useEffect, useRef, useState } from "react";

import { RGBAColor, RGBColor } from "@kitware/vtk.js/types";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";

import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
//@ts-ignore
import vtkImageMarchingCubes from "@kitware/vtk.js/Filters/General/ImageMarchingCubes";

import { readImageDICOMFileSeries } from "itk-wasm";
import { convertItkToVtkImage } from "@kitware/vtk.js/Common/DataModel/ITKHelper";

export default function useVtkViewer() {
  const [progress, setProgress] = useState(0);
  const [loadingStateMsg, setIsLoadingStateMsg] = useState("");
  const dicomLength = 400;

  //
  interface Context {
    reader?: vtkHttpDataSetReader;
    fullScreenRenderer?: vtkFullScreenRenderWindow;
    renderWindow?: vtkRenderWindow;
    renderer?: vtkRenderer;
    actor?: vtkActor;
    mapper?: vtkMapper;
    marchingCube?: any;
    volumeActor?: vtkVolume;
    volumeMapper?: vtkVolumeMapper;
  }
  const vtkContainerRef = useRef<HTMLDivElement | null>(null);
  const context = useRef<Context>({});

  interface ViewerConfig {
    background: RGBColor | RGBAColor;
  }

  const viewerConfig: ViewerConfig = {
    background: [0, 0, 0, 0.2],
  };

  useEffect(() => {
    if (progress === dicomLength || vtkContainerRef.current === null) return;

    // A. 랜더러 & 뷰어 설정
    initailizeNew(viewerConfig);

    // B. 파일 로딩, 출력
    loadHandlerNew();
  }, [vtkContainerRef]);

  // 1
  function initailizeNew(viewerConfig: ViewerConfig) {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: viewerConfig.background,
      listenWindowResize: true,
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
  }

  // 2
  async function loadHandlerNew() {
    const fileList = [];

    try {
      for (let i = 0; i < dicomLength; i++) {
        setProgress(i + 1);

        const fileName = i.toString().padStart(4, "0");
        const response = await fetch(`/dicom/${fileName}.dcm`);
        const dicomData = await response.arrayBuffer();

        fileList.push(new File([dicomData], `${fileName}.dcm`));
      }
      setIsLoadingStateMsg("file reading...");
      const result = await readImageDICOMFileSeries(fileList);
      result.webWorkerPool.terminateWorkers();

      getVolumeDataNew({ itkImage: result.image });
    } catch (error) {
      console.error("Error processing DICOM file:", error);
    }
  }

  // 3
  function getVolumeDataNew({ itkImage }: { itkImage: any }) {
    setIsLoadingStateMsg("rendering...");
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
  }

  return {
    progress,
    loadingStateMsg,
    dicomLength,
    vtkContainerRef,
  };
}
