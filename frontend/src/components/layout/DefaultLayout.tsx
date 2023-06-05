import { ReactNode } from "react";

import Header from "@components/layout/partial/Header";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
    </>
  );
}
