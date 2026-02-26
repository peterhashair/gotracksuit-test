import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AddInsight } from "./add-insight.tsx";

const defaultProps = {
  open: true,
  onClose: vi.fn(),
};

describe("AddInsight", () => {
  it("renders the form when open", () => {
    render(<AddInsight {...defaultProps} />);
    expect(screen.getByText("Add a new insight")).toBeTruthy();
    expect(screen.getByPlaceholderText("Something insightful...")).toBeTruthy();
  });

  it("shows a validation error when text is empty", () => {
    render(<AddInsight {...defaultProps} />);
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));
    expect(screen.getByText("Insight text is required")).toBeTruthy();
  });

  it("calls onSuccess after a successful submission", async () => {
    const onSuccess = vi.fn();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<AddInsight {...defaultProps} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "My insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it("shows an error message when submission fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<AddInsight {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "My insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await screen.findByText("Failed to add insight");
  });
});
