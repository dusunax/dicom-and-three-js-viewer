import { ErrorBoundary } from "./pages/common/ErrorBoundary";
import { Router } from "./router/Router";

function App() {
  return (
    <div id="App">
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </div>
  );
}

export { App };
