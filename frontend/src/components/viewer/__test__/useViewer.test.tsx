import { render, screen } from "@testing-library/react";
import ThreeViewer from "../Viewer";

describe("useViewer", () => {
  render(<ThreeViewer />);

  it("renders a viewer", () => {
    const viewerWrapper = screen.getByTestId("viewer");
    expect(viewerWrapper).toBeInTheDocument();
  });
});
