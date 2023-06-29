import { useParams } from "react-router-dom";

import { RenderType } from "@/types/loader";

import DefaultLayout from "@/components/layout/DefaultLayout";

import VtkViewer from "@/components/vtkViewer/Viewer";

export default function VTKPage() {
  const { type } = useParams();

  return (
    <DefaultLayout>
      <VtkViewer renderType={type as RenderType} />
    </DefaultLayout>
  );
}
