export {};
// import React, { useEffect, useRef } from "react";
// import * as cornerstone from "cornerstone-core";
// import * as cornerstoneMath from "cornerstone-math";
// import * as cornerstoneTools from "cornerstone-tools";
// import Hammer from "hammerjs";
// import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

// cornerstoneTools.external.cornerstone = cornerstone;
// cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
// cornerstoneWebImageLoader.external.cornerstone = cornerstone;
// cornerstoneTools.external.Hammer = Hammer;

// const imageId =
//   "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";

// const divStyle = {
//   width: "512px",
//   height: "512px",
//   position: "relative",
//   color: "white",
// };

// const bottomLeftStyle = {
//   bottom: "5px",
//   left: "5px",
//   position: "absolute",
//   color: "white",
// };

// const bottomRightStyle = {
//   bottom: "5px",
//   right: "5px",
//   position: "absolute",
//   color: "white",
// };

// const CornerstoneElement = () => {
//   const elementRef = useRef(null);

//   useEffect(() => {
//     const element = elementRef.current;

//     cornerstone.enable(element);

//     cornerstone.loadImage(imageId).then((image) => {
//       cornerstone.displayImage(element, image);

//       const stack = {
//         imageIds: [imageId],
//         currentImageIdIndex: 0,
//       };

//       cornerstoneTools.addStackStateManager(element, ["stack"]);
//       cornerstoneTools.addToolState(element, "stack", stack);

//       cornerstoneTools.mouseInput.enable(element);
//       cornerstoneTools.mouseWheelInput.enable(element);
//       cornerstoneTools.wwwc.activate(element, 1);
//       cornerstoneTools.pan.activate(element, 2);
//       cornerstoneTools.zoom.activate(element, 4);
//       cornerstoneTools.zoomWheel.activate(element);

//       cornerstoneTools.touchInput.enable(element);
//       cornerstoneTools.panTouchDrag.activate(element);
//       cornerstoneTools.zoomTouchPinch.activate(element);

//       const onImageRendered = () => {
//         const viewport = cornerstone.getViewport(element);
//         console.log(viewport);
//       };

//       const onNewImage = () => {
//         const enabledElement = cornerstone.getEnabledElement(element);
//         const imageId = enabledElement.image.imageId;
//         console.log(imageId);
//       };

//       element.addEventListener("cornerstoneimagerendered", onImageRendered);
//       element.addEventListener("cornerstonenewimage", onNewImage);

//       return () => {
//         element.removeEventListener(
//           "cornerstoneimagerendered",
//           onImageRendered
//         );
//         element.removeEventListener("cornerstonenewimage", onNewImage);

//         cornerstone.disable(element);
//       };
//     });
//   }, []);

//   return (
//     <div>
//       <div className="viewportElement" style={divStyle} ref={elementRef}>
//         <canvas className="cornerstone-canvas" />
//         <div style={bottomLeftStyle}>Zoom: N/A</div>
//         <div style={bottomRightStyle}>WW/WC: N/A / N/A</div>
//       </div>
//     </div>
//   );
// };

// const App = () => (
//   <div>
//     <h2>Cornerstone React Component Example</h2>
//     <CornerstoneElement />
//   </div>
// );
// export default App;
