import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("calls onInsightAdded after a successful submission", async () => {
    const onInsightAdded = vi.fn();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<Header onInsightAdded={onInsightAdded} />);
    fireEvent.click(screen.getByText("Add insight"));

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "A new insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await vi.waitFor(() => expect(onInsightAdded).toHaveBeenCalledOnce());
  });
});