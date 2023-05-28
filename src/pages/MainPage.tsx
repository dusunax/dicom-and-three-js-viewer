import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { Header } from "@/components/layout/partial/Header";
import { Viewer } from "@/components/viewer/Viewer";

export default function MainPage() {
  return (
    <DefaultLayout>
      <Header />
      <Viewer />
    </DefaultLayout>
  );
}
