import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@components/layout/partial/Header";

import DicomComponent from "@/components/dicomViewer/DicomComponent";

export default function DicomPage() {
  return (
    <DefaultLayout>
      <Header />
      <DicomComponent />
    </DefaultLayout>
  );
}
