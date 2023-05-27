import { render, screen } from "@testing-library/react";
import { Viewer } from "../Viewer";

describe("useViewer", () => {
  render(<Viewer />);

  it("renders a rotating box", () => {
    const rotatingBox = screen.getByTestId("viewer");
    expect(rotatingBox).toBeInTheDocument();
  });
});
