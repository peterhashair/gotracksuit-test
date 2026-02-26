import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header, HEADER_TEXT } from "./header.tsx";

describe("Header", () => {
  it("renders the header text", () => {
    render(<Header />);
    expect(screen.getByText(HEADER_TEXT)).toBeTruthy();
  });

  it("renders the Add insight button", () => {
    render(<Header />);
    expect(screen.getByText("Add insight")).toBeTruthy();
  });

  it("opens the add insight modal when the button is clicked", () => {
    render(<Header />);
    expect(screen.queryByText("Add a new insight")).toBeFalsy();

    fireEvent.click(screen.getByText("Add insight"));
    expect(screen.getByText("Add a new insight")).toBeTruthy();
  });
});