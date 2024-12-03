import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Paint App title", () => {
  render(<App />);
  const titleElement = screen.getByText(/React Paint App/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders canvas", () => {
  render(<App />);
  const canvasElement = screen.getByRole("img", { hidden: true });
  expect(canvasElement).toBeInTheDocument();
});