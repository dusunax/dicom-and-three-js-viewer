import { ReactNode, useState } from "react";

import Error from "./Error";

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  const handleOnError = (error: any) => {
    setHasError(true);
    console.log(error.error);
  };

  if (hasError) {
    return <Error />;
  }

  return <div onError={handleOnError}>{children}</div>;
}
