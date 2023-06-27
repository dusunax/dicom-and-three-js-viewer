import DefaultLayout from "@/components/layout/DefaultLayout";

import VtkViewer from "@/components/vtkViewer/Viewer";

export default function VTKPage() {
  return (
    <DefaultLayout>
      <VtkViewer />
    </DefaultLayout>
  );
}
