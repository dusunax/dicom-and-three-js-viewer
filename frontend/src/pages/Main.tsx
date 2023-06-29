import { startTransition, useCallback } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (path: string) => {
      startTransition(() => {
        navigate(path);
      });
    },
    [navigate]
  );

  return (
    <DefaultLayout>
      <section>
        <div className="max-w-[1080px] h-full px-10 mx-auto">
          <h1 className="text-2xl font-extrabold py-6">Index</h1>

          <ol className="flex flex-col gap-6">
            <li>
              <h2 className="text-lg font-bold">ReadMe</h2>
              <p>프로젝트 깃허브: Github link</p>
              <a
                className="text-gray-500 underline underline-offset-4"
                href="https://github.com/dusunax/dicom-and-three-js-viewer"
                target="_blank"
              >
                https://github.com/dusunax/dicom-and-three-js-viewer
              </a>
            </li>
            <li>
              <h2 className="text-lg font-bold">DICOM</h2>
              <p>dcm 파일을 2D 화면에 출력합니다.</p>
              <a
                onClick={() => handleClick("/view/dicom")}
                className="text-gray-500 underline underline-offset-4 cursor-pointer hover:text-blue-500"
              >
                /view/dicom
              </a>
            </li>
            <li>
              <h2 className="text-lg font-bold">3D 모델</h2>
              <p>ply 파일을 3D 모델로 화면에 출력합니다.</p>
              <a
                onClick={() => handleClick("/view/3d/model")}
                className="text-gray-500 underline underline-offset-4 cursor-pointer hover:text-blue-500"
              >
                /view/3d/model
              </a>
            </li>
            <li>
              <h2 className="text-lg font-bold">3D 볼륨</h2>
              <p>dcm 파일 시리즈를 3D 볼륨으로 화면에 출력합니다.</p>
              <a
                onClick={() => handleClick("/view/vtk")}
                className="text-gray-500 underline underline-offset-4 cursor-pointer hover:text-blue-500"
              >
                /view/vtk
              </a>
            </li>
          </ol>
        </div>
      </section>
    </DefaultLayout>
  );
}
