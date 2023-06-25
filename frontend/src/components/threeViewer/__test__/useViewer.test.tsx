import { render, screen } from "@testing-library/react";
import ThreeViewer from "../Viewer";

describe("model viewer", () => {
  render(<ThreeViewer renderType="model" />);

  it("renders a viewer", () => {
    const viewerWrapper = screen.getByTestId("ply-viewer");
    expect(viewerWrapper).toBeInTheDocument();
  });
});

describe("volume viewer", () => {
  render(<ThreeViewer renderType="volume" />);

  it("renders a viewer", () => {
    const viewerWrapper = screen.getByTestId("nrrd-viewer");
    expect(viewerWrapper).toBeInTheDocument();
  });
});
