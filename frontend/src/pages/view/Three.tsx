import DefaultLayout from "@/components/layout/DefaultLayout";

import ThreeViewer from "@/components/viewer/Viewer";
import ThreeExample from "@/example/example-three/ThreeExample";

export default function ThreePage() {
  return (
    <DefaultLayout>
      {/* <ThreeViewer /> */}
      <ThreeExample />
    </DefaultLayout>
  );
}
