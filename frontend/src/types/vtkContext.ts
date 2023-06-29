import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";

import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";

export interface VtkContext {
  reader?: vtkHttpDataSetReader;
  fullScreenRenderer?: vtkFullScreenRenderWindow;
  renderWindow?: vtkRenderWindow;
  renderer?: vtkRenderer;
  actor?: vtkActor;
  mapper?: vtkMapper;
  marchingCube?: any;
  volumeActor?: vtkVolume;
  volumeMapper?: vtkVolumeMapper;
  piecewiseFunction?: vtkPiecewiseFunction;
}
