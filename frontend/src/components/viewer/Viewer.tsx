import { useEffect, useState } from "react";

export default function Viewer() {
  let renderer = {};
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);

  return (
    <div className="wrapper flex justify-center">
      <canvas />
      <div
        id="viewer"
        data-testid="viewer"
        className="w-full bg-black"
        ref={setCanvas}
      />
    </div>
  );
}
