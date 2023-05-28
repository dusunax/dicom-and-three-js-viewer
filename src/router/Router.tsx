import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("../pages/MainPage"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export { Router };
