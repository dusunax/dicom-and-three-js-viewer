import { ReactNode } from "react";

import { Header } from "@components/layout/partial/Header";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
    </>
  );
};

export { DefaultLayout };
