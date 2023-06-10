import GLTFModel from "./GLTFModel";
import PLYModel from "./PLYModel";

export default function ThreeExample() {
  return (
    <>
      <h1 className="px-4 py-4 text-xl">📌 GLTF</h1>
      <GLTFModel />

      <h1 className="px-4 py-4 text-xl">📌 PLY</h1>
      <PLYModel />
    </>
  );
}
