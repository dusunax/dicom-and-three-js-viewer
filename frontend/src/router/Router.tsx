import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainPage from "@/pages/Main";

const DicomPage = lazy(() => import("@/pages/view/Dicom"));
const ThreePage = lazy(() => import("@/pages/view/Three"));
const VTKPage = lazy(() => import("@/pages/view/VTK"));
const Convertor = lazy(() => import("@/pages/convertor/Convertor"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/view/dicom" element={<DicomPage />} />
        <Route path="/view/three/:type" element={<ThreePage />} />
        <Route path="/view/vtk/:type" element={<VTKPage />} />

        <Route path="/convertor" element={<Convertor />} />
        <Route path="/convertor/:convert-type" element={<Convertor />} />
      </Routes>
    </BrowserRouter>
  );
}
