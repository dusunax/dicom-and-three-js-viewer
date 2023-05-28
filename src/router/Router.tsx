import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Loading } from "@/pages/common/Loading";
import { Error } from "@/pages/common/Error";

const MainPage = lazy(() => import("../pages/MainPage"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export { Router };
