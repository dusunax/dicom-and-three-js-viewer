import { Viewer } from "@/components/viewer/Viewer";

export default function MainPage() {
  return (
    <>
      <h2 className="flex items-center justify-center text-center text-5xl font-extrabold text-blue-800 h-[200px]">
        🌌 hello world 🌌
      </h2>

      <Viewer />
    </>
  );
}
