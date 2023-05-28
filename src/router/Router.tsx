import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Loading from "@/pages/common/Loading";

const MainPage = lazy(() => import("../pages/MainPage"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
