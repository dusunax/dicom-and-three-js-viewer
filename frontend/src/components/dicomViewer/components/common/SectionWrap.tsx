import { ReactNode } from "react";

export default function SectionWrap({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="py-10">
      <h2 className="text-2xl">{title}</h2>
      {children}
    </section>
  );
}
