import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hello", () => {
  render(<App />);
  const HelloElement = screen.getByText(/hello/i);
  expect(HelloElement).toBeInTheDocument();
});
