import { useEffect, useState } from "react";

import addCornerstoneExternals from "./utils/addCornerstoneExternals";

import CurrentTabComponent from "./components/CurrentTabComponent";
import TabNavigation from "./components/TabNavigation";

export default function DicomComponent() {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    addCornerstoneExternals();
  }, []);

  return (
    <div className="text-center">
      <h1 className="py-2">with Cornerstone.js</h1>

      {/* 탭 리스트, tab list */}
      <TabNavigation setTabIndex={setTabIndex} />

      {/* 각 탭 컴포넌트 */}
      <CurrentTabComponent tabIndex={tabIndex} />
    </div>
  );
}
