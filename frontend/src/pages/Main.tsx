import DefaultLayout from "@/components/layout/DefaultLayout";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <DefaultLayout>
      <section>
        <div className="max-w-[1080px] h-full px-10 mx-auto">
          <h1 className="text-2xl font-extrabold py-6">Index</h1>

          <ol className="flex flex-col gap-6">
            <li>
              <h2 className="text-lg font-bold">ReadMe</h2>
              <p>프로젝트 깃헙 문서: Github link</p>
              <a
                className="text-gray-500 underline underline-offset-4"
                href="https://github.com/dusunax/dicom-viewer/wiki"
                target="_blank"
              >
                https://github.com/dusunax/dicom-viewer/wiki
              </a>
            </li>
            <li>
              <h2 className="text-lg font-bold">DICOM</h2>
              <p>dcm 파일을 2D 화면에 출력합니다.</p>
              <Link
                to="/view/dicom"
                className="text-gray-500 underline underline-offset-4"
              >
                /view/dicom
              </Link>
            </li>
            <li>
              <h2 className="text-lg font-bold">3D</h2>
              <p>ply 파일을 3D 화면에 출력합니다.</p>
              <Link
                to="/view/3d"
                className="text-gray-500 underline underline-offset-4"
              >
                /view/dicom
              </Link>
            </li>
          </ol>
        </div>
      </section>
    </DefaultLayout>
  );
}
