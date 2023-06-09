import DefaultLayout from "@/components/layout/DefaultLayout";
import DicomToPlyConverter from "@/components/converter/DicomToPly";

export default function Convertor() {
  return (
    <DefaultLayout>
      <DicomToPlyConverter />
    </DefaultLayout>
  );
}
