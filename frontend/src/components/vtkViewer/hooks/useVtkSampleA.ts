import { useEffect, useRef, useState } from "react";

import { VtkContext } from "@/types/vtkContext";
import { ViewerConfig } from "@/types/loader";

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import "@kitware/vtk.js/Rendering/Profiles/Volume";
// Force the loading of HttpDataAccessHelper to support gzip decompression
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";

import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";

import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkColorMaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";

// @ts-ignore
import vtkPiecewiseGaussianWidget from "@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget";

export default function useVtkSampleA() {
  const urlToLoad = "https://kitware.github.io/vtk-js/data/volume/LIDC2.vti";

  const context = useRef<VtkContext>({});
  const widgetRef = useRef<any | null>();
  const vtkContainerRef = useRef<HTMLDivElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [contrast, setConstarst] = useState(0.6);

  const viewerConfig: ViewerConfig = {
    background: [contrast, contrast, contrast],
    containerStyle: { height: "100%" },
  };

  // ----------------------------------------------------------------
  // useEffect 시작
  useEffect(() => {
    setConstarst(0.6);
    setLoaded(false);
    if (!vtkContainerRef.current) return;

    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: viewerConfig.background,
      containerStyle: viewerConfig.containerStyle,
      container: vtkContainerRef.current,
    });

    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    (async function () {
      const volumeActor = vtkVolume.newInstance({});

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
      volumeActor.getProperty().setAmbient(1 - contrast);
      volumeActor.getProperty().setDiffuse(0.6);
      volumeActor.getProperty().setSpecular(0.3);
      volumeActor.getProperty().setSpecularPower(8.0);

      volumeMapper.setInputConnection(reader.getOutputPort());

      function updateValue(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        setConstarst(value);

        volumeActor.getProperty().setAmbient(1 - value);

        renderer.resetCamera();
        renderer.setBackground([value, value, value]);
        renderWindow.render();
      }

      try {
        await reader.setUrl(urlToLoad);
        await reader.loadData();
      } catch (err) {
        console.log(err);
      } finally {
        renderer.addVolume(volumeActor);

        const interactor = renderWindow.getInteractor();
        interactor.setDesiredUpdateRate(15.0);

        renderer.resetCamera();

        const camera = renderer.getActiveCamera();

        camera.elevation(70);
        renderWindow.render();
        setLoaded(true);
      }

      document
        .querySelector(".input-value")
        ?.addEventListener("input", (e: any) => updateValue(e));

      function handleKeyDown(e: KeyboardEvent) {
        e.preventDefault();

        if (e.key === "ArrowUp") {
          setConstarst((prev) => {
            if (prev >= 1) return 1;
            let newValue = +prev + 0.05;
            console.log(prev, newValue);

            volumeActor.getProperty().setAmbient(1 - newValue);

            // renderer.resetCamera();
            renderer.setBackground([newValue, newValue, newValue]);
            renderWindow.render();

            return newValue;
          });
        } else if (e.key === "ArrowDown") {
          setConstarst((prev) => {
            if (prev <= 0) return 0;
            let newValue = +prev - 0.05;

            volumeActor.getProperty().setAmbient(1 - newValue);

            // renderer.resetCamera();
            renderer.setBackground([newValue, newValue, newValue]);
            renderWindow.render();

            return newValue;
          });
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document?.removeEventListener("keydown", handleKeyDown);
      };
    })();
  }, []);

  return { vtkContainerRef, context, loaded, setConstarst, contrast };
}
