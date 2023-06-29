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
import vtkColorMaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";

// @ts-ignore
import vtkPiecewiseGaussianWidget from "@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget";
import vtkCubeSource from "@kitware/vtk.js/Filters/Sources/CubeSource";
import vtkWidgetManager from "@kitware/vtk.js/Widgets/Core/WidgetManager";

export default function useVtkSampleB() {
  // const urlToLoad = "models/sample/LIDC2.vti";
  const urlToLoad = "https://kitware.github.io/vtk-js/data/volume/LIDC2.vti";

  const [isLoading, setIsLoading] = useState(false);

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

  const widget = vtkPiecewiseGaussianWidget.newInstance({
    numberOfBins: 256,
    size: [200, 150],
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

    const piecewiseFunction = vtkPiecewiseFunction.newInstance();

    // 위젯
    fullScreenRenderer.setResizeCallback(
      ({ width, height }: { width: number; height: number }) => {
        widget.setSize(450, 150);
      }
    );
    widget.applyOpacity(piecewiseFunction);

    widget.setColorTransferFunction(lookupTable);
    lookupTable.onModified(() => {
      widget.render();
      renderWindow.render();
    });

    widget.addGaussian(0.425, 0.5, 0.2, 0.3, 0.2);
    widget.addGaussian(0.75, 1, 0.3, 0, 0);

    widget.bindMouseListeners();
    widget.setContainer(widgetContainer);

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

      // create color and opacity transfer functions
      const ctfun = vtkColorTransferFunction.newInstance();
      ctfun.addRGBPoint(0, 85 / 255.0, 0, 0);
      ctfun.addRGBPoint(95, 1.0, 1.0, 1.0);
      ctfun.addRGBPoint(225, 0.66, 0.66, 0.5);
      ctfun.addRGBPoint(255, 0.3, 1.0, 0.5);

      const ofun = vtkPiecewiseFunction.newInstance();
      ofun.addPoint(0.0, 0.0);
      ofun.addPoint(255.0, 1.0);
      volumeActor.getProperty().setRGBTransferFunction(0, ctfun);
      volumeActor.getProperty().setScalarOpacity(0, ofun);
      volumeActor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
      volumeActor.getProperty().setInterpolationTypeToLinear();
      volumeActor.getProperty().setUseGradientOpacity(0, true);
      volumeActor.getProperty().setGradientOpacityMinimumValue(0, 2);
      volumeActor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
      volumeActor.getProperty().setGradientOpacityMaximumValue(0, 20);
      volumeActor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
      volumeActor.getProperty().setShade(true);
      volumeActor.getProperty().setAmbient(0.2);
      volumeActor.getProperty().setDiffuse(0.7);
      volumeActor.getProperty().setSpecular(0.3);
      volumeActor.getProperty().setSpecularPower(8.0);

      volumeMapper.setInputConnection(reader.getOutputPort());

      try {
        await reader.setUrl(urlToLoad);
        await reader.loadData();
      } catch (err) {
        console.log(err);
      } finally {
        // renderer.delete();
        renderer.addVolume(volumeActor);

        const interactor = renderWindow.getInteractor();
        interactor.setDesiredUpdateRate(15.0);

        renderer.resetCamera();
        renderer.getActiveCamera().elevation(70);
        renderWindow.render();
      }
    })();
  }, []);

  //----------------------------------------------------------------
  // widget 기능
  //----------------------------------------------------------------
  let presetIndex = 1;
  let globalDataRange = [0, 255];
  const lookupTable = vtkColorTransferFunction.newInstance();

  function changePreset(delta = 1) {
    presetIndex =
      (presetIndex + delta + vtkColorMaps.rgbPresetNames.length) %
      vtkColorMaps.rgbPresetNames.length;
    lookupTable.applyColorMap(
      vtkColorMaps.getPresetByName(vtkColorMaps.rgbPresetNames[presetIndex])
    );
    lookupTable.setMappingRange(globalDataRange[0], globalDataRange[1]);
    lookupTable.updateRange();
    if (labelContainer)
      labelContainer.innerHTML = vtkColorMaps.rgbPresetNames[presetIndex];
  }

  let intervalID: NodeJS.Timeout | null = null;
  function stopInterval() {
    if (intervalID !== null) {
      clearInterval(intervalID);
      intervalID = null;
    }
  }

  function labelClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.pageX < 200) {
      stopInterval();
      changePreset(-1);
    } else {
      stopInterval();
      changePreset(1);
    }
  }

  return { vtkContainerRef, context, labelClickHandler };
}
