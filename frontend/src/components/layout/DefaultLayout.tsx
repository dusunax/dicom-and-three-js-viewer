import { ReactNode } from "react";

import Header from "@components/layout/partial/Header";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="mt-20">{children}</main>
    </div>
  );
}
