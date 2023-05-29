import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Loading from "@/pages/common/Loading";

const ExamplePage = lazy(() => import("../pages/Example"));
const MainPage = lazy(() => import("../pages/Main"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<ExamplePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
