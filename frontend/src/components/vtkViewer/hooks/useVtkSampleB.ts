import { useEffect, useRef, useState } from "react";

import { VtkContext } from "@/types/vtkContext";
import { ViewerConfig } from "@/types/loader";

import "@kitware/vtk.js/favicon";
// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import "@kitware/vtk.js/Rendering/Profiles/Volume";
// Force the loading of HttpDataAccessHelper to support gzip decompression
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkImageData from "@kitware/vtk.js/Common/DataModel/ImageData";
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";

import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkColorMaps, {
  IColorMapPreset,
} from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";

// @ts-ignore
import vtkPiecewiseGaussianWidget from "@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget";
import vtkCubeSource from "@kitware/vtk.js/Filters/Sources/CubeSource";
import vtkWidgetManager from "@kitware/vtk.js/Widgets/Core/WidgetManager";

export default function useVtkSampleB() {
  const urlToLoad = "https://kitware.github.io/vtk-js/data/volume/LIDC2.vti";

  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<IColorMapPreset | null>(
    null
  );

  const context = useRef<VtkContext>({});
  const widgetRef = useRef<any | null>();
  const vtkContainerRef = useRef<HTMLDivElement | null>(null);

  const viewerConfig: ViewerConfig = {
    background: [0, 0, 0, 0.2],
  };

  // ----------------------------------------------------------------
  // 위젯 widget default settings
  // ----------------------------------------------------------------
  const labelContainer = document.querySelector(".label-container");
  const widgetContainer = document.querySelector(".widget-container");

  const piecewiseFunction = vtkPiecewiseFunction.newInstance();

  let presetIndex = 1;
  let globalDataRange = [0, 255];
  const lookupTable = vtkColorTransferFunction.newInstance();

  //----------------------------------------------------------------
  // widget 시작
  //----------------------------------------------------------------
  function changePreset(delta = 1) {
    presetIndex =
      (presetIndex + delta + vtkColorMaps.rgbPresetNames.length) %
      vtkColorMaps.rgbPresetNames.length;

    lookupTable.applyColorMap(
      vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
    );

    lookupTable.setMappingRange(globalDataRange[0], globalDataRange[1]);
    lookupTable.updateRange();

    setCurrentTheme(
      vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
    );
  }

  const intervalID = useRef<NodeJS.Timeout | null>(null);

  function stopInterval() {
    if (intervalID.current !== null) {
      clearInterval(intervalID.current);
      intervalID.current = null;
    }
  }

  labelContainer &&
    labelContainer.addEventListener("click", (event: any) => {
      if (event.pageX < 200) {
        stopInterval();
        changePreset(-1);
      } else {
        stopInterval();
        changePreset(1);
      }
    });

  function changePresetByName(name: string) {
    // intervalID.current && clearInterval(intervalID.current);

    const newColorMap = vtkColorMaps.getPresetByName(name);
    console.log(newColorMap);

    lookupTable.applyColorMap(newColorMap);
    lookupTable.setMappingRange(globalDataRange[0], globalDataRange[1]);
    lookupTable.updateRange();

    setCurrentTheme(newColorMap);

    if (labelContainer)
      labelContainer.innerHTML = vtkColorMaps.rgbPresetNames[presetIndex];
  }

  const widget = vtkPiecewiseGaussianWidget.newInstance({
    numberOfBins: 256,
    size: [400, 150],
  });

  widget.updateStyle({
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    histogramColor: "rgba(100, 100, 100, 0.5)",
    strokeColor: "rgb(0, 0, 0)",
    activeColor: "rgb(255, 255, 255)",
    handleColor: "rgb(50, 150, 50)",
    buttonDisableFillColor: "rgba(255, 255, 255, 0.5)",
    buttonDisableStrokeColor: "rgba(0, 0, 0, 0.5)",
    buttonStrokeColor: "rgba(0, 0, 0, 1)",
    buttonFillColor: "rgba(255, 255, 255, 1)",
    strokeWidth: 2,
    activeStrokeWidth: 3,
    buttonStrokeWidth: 1.5,
    handleWidth: 3,
    iconSize: 20, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
    padding: 10,
  });

  widget.addGaussian(0.425, 0.5, 0.2, 0.3, 0.2);
  widget.addGaussian(0.75, 1, 0.3, 0, 0);

  widget.applyOpacity(piecewiseFunction);
  widget.bindMouseListeners();

  lookupTable.onModified(() => {
    widget.render();
  });

  // ----------------------------------------------------------------
  // useEffect 시작
  useEffect(() => {
    if (!vtkContainerRef.current) return;

    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: viewerConfig.background,
      containerStyle: viewerConfig.containerStyle,
      container: vtkContainerRef.current,
    });

    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    renderWindow.getInteractor().setDesiredUpdateRate(15.0);

    widget.onAnimation((start: boolean) => {
      if (start) {
        renderWindow.getInteractor().requestAnimation(widget);
      } else {
        renderWindow.getInteractor().cancelAnimation(widget);
      }
    });

    widget.onOpacityChange(() => {
      widget.applyOpacity(piecewiseFunction);
      if (!renderWindow.getInteractor().isAnimating()) {
        renderWindow.render();
      }
    });

    widgetRef.current = widget;

    (async function () {
      const volumeActor = vtkVolume.newInstance();
      const volumeMapper = vtkVolumeMapper.newInstance({ sampleDistance: 0.7 });
      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

      volumeActor.setMapper(volumeMapper);

      volumeMapper.setInputConnection(reader.getOutputPort());

      lookupTable.onModified(() => {
        renderWindow.render();

        if (widgetContainer && widgetContainer?.children.length !== 0) {
          widgetContainer.innerHTML = ""; // 자식 요소 제거
        }
        widget.setContainer(widgetContainer);
        widget.setColorTransferFunction(lookupTable);
      });

      try {
        await reader.setUrl(urlToLoad);
        await reader.loadData();
      } catch (err) {
        console.log(err);
      } finally {
        const imageData = reader.getOutputData();
        const dataArray = imageData.getPointData().getScalars();
        const dataRange = dataArray.getRange();

        renderer.addVolume(volumeActor);
        globalDataRange[0] = dataRange[0];
        globalDataRange[1] = dataRange[1];

        changePreset();
        if (intervalID.current === null)
          intervalID.current = setInterval(changePreset, 3000);

        widget.setDataArray(dataArray.getData());
        widget.applyOpacity(piecewiseFunction);

        widget.setColorTransferFunction(lookupTable);
        lookupTable.onModified(() => {
          widget.render();
          renderWindow.render();
        });

        renderer.addVolume(volumeActor);
        renderer.resetCamera();
        renderer.getActiveCamera().elevation(70);
        renderWindow.render();
      }

      volumeActor.setMapper(volumeMapper);
      volumeMapper.setInputConnection(reader.getOutputPort());

      volumeActor.getProperty().setRGBTransferFunction(0, lookupTable);
      volumeActor.getProperty().setScalarOpacity(0, piecewiseFunction);
      volumeActor.getProperty().setInterpolationTypeToFastLinear();
    })();
  }, []);

  return {
    vtkContainerRef,
    context,
    // labelClickHandler,
    widgetRef,
    currentTheme,
    intervalID,
    vtkColorMaps,
    changePresetByName,
  };
}
