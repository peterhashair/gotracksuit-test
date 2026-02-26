import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Header, HEADER_TEXT } from "./header.tsx";

const getHeaderButton = () =>
  within(screen.getByRole("banner")).getByRole("button", {
    name: "Add insight",
  });

describe("Header", () => {
  it("renders the header text", () => {
    render(<Header />);
    expect(screen.getByText(HEADER_TEXT)).toBeTruthy();
  });

  it("renders the Add insight button", () => {
    render(<Header />);
    expect(getHeaderButton()).toBeTruthy();
  });

  it("opens the add insight modal when the button is clicked", () => {
    render(<Header />);
    expect(screen.queryByText("Add a new insight")).toBeFalsy();

    fireEvent.click(getHeaderButton());
    expect(screen.getByText("Add a new insight")).toBeTruthy();
  });

  it("calls onInsightAdded after a successful submission", async () => {
    const onInsightAdded = vi.fn();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<Header onInsightAdded={onInsightAdded} />);
    fireEvent.click(getHeaderButton());

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "A new insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await vi.waitFor(() => expect(onInsightAdded).toHaveBeenCalledOnce());
  });
});
