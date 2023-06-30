import { useCallback, startTransition } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (path: string) => {
      startTransition(() => {
        navigate(path);
      });
    },
    [navigate]
  );

  const navLinks = [
    { pathname: "/view/dicom", label: "DICOM" },
    { pathname: "/view/three/model", label: "3D" },
    { pathname: "/view/vtk/contour", label: "Contour" },
    { pathname: "/view/vtk/sample-a", label: "Volume A" },
    { pathname: "/view/vtk/sample-b", label: "Volume B" },
    // { pathname: "/convertor", label: "convertor" },
  ];

  return (
    <header className="w-full h-20 fixed bg-white z-10 top-0 shadow-md">
      <div className="max-w-[1080px] h-full px-10 mx-auto flex items-center justify-between ">
        <Link to="/">
          <h2 className="text-2xl font-extrabold text-blue-800">
            🌌 DICOM VIEWER 🌌
          </h2>
        </Link>

        <nav>
          <ul className="flex gap-6">
            {navLinks.map((link) => {
              const { pathname, label } = link;
              const isCurrent = location.pathname === pathname;

              return (
                <li
                  key={pathname}
                  className={`${isCurrent ? "font-bold" : ""}`}
                >
                  <a
                    onClick={() => handleClick(pathname)}
                    className="cursor-pointer hover:text-blue-500"
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
