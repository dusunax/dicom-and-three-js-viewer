import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Loading from "@/pages/common/Loading";
import MainPage from "@/pages/Main";
import Convertor from "@/pages/convertor/Convertor";

const ExamplePage = lazy(() => import("../pages/Example"));
const PLYPage = lazy(() => import("../pages/view/Three"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/view/dicom" element={<ExamplePage />} />
          <Route path="/view/3d" element={<PLYPage />} />

          <Route path="/convertor" element={<Convertor />} />
          <Route path="/convertor/:convert-type" element={<Convertor />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
