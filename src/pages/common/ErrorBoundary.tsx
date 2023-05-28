import { ReactNode, useState } from "react";

import { Error } from "./Error";

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  const handleOnError = (error: any) => {
    setHasError(true);
    console.error(error);
  };

  if (hasError) {
    return <Error />;
  }

  return <div onError={handleOnError}>{children}</div>;
};

export { ErrorBoundary };
