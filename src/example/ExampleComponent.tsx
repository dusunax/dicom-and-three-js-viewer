import StackOfImage from "@/example/rander/StackOfImage";
import StackOfImageWithTools from "./rander/StackOfImageWithTools";

export default function ExampleComponent() {
  return (
    <div className="text-center">
      <h1 className="mb-10">Cornerstone.js 라이브러리 사용 예시</h1>

      {/* ImageStack: 기본 출력 */}
      <StackOfImage />

      {/* CornerstoneTools: 기본 도구 */}
      <StackOfImageWithTools />
    </div>
  );
}
