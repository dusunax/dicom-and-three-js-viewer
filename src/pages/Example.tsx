import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@components/layout/partial/Header";

import ExampleComponent from "@/example/ExampleComponent";

export default function ExamplePage() {
  return (
    <DefaultLayout>
      <Header />
      <ExampleComponent />
    </DefaultLayout>
  );
}