import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { pathname: "/view/dicom", label: "DICOM" },
    { pathname: "/view/3d", label: "3D" },
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
                  <Link to={pathname}>{label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
