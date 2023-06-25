import { useParams } from "react-router-dom";

import { RenderType } from "@/types/loader";

import DefaultLayout from "@/components/layout/DefaultLayout";

import ThreeViewer from "@/components/threeViewer/Viewer";

export default function ThreePage() {
  const { type } = useParams();

  return (
    <DefaultLayout>
      <ThreeViewer renderType={type as RenderType} />
    </DefaultLayout>
  );
}
