import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header, HEADER_TEXT } from "./header.tsx";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Header", () => {
  it("renders the header text", () => {
    render(<Header />);
    expect(screen.getByText(HEADER_TEXT)).toBeTruthy();
  });

  it("renders the Add insight button", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: "Add insight" })).toBeTruthy();
  });

  it("opens the add insight modal when the button is clicked", () => {
    render(<Header />);
    expect(screen.queryByText("Add a new insight")).toBeFalsy();

    fireEvent.click(screen.getByRole("button", { name: "Add insight" }));
    expect(screen.getByText("Add a new insight")).toBeTruthy();
  });

  it("calls onInsightAdded after a successful submission", async () => {
    const onInsightAdded = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    render(<Header onInsightAdded={onInsightAdded} />);
    fireEvent.click(screen.getByRole("button", { name: "Add insight" }));

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "A new insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await vi.waitFor(() => expect(onInsightAdded).toHaveBeenCalledOnce());
  });

  it("closes the modal after a successful submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Add insight" }));

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "A new insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await vi.waitFor(() =>
      expect(screen.queryByText("Add a new insight")).toBeFalsy()
    );
  });

  it("shows an error when submission fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Add insight" }));

    fireEvent.change(screen.getByPlaceholderText("Something insightful..."), {
      target: { value: "A new insight" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    await screen.findByText("Failed to add insight");
  });

  it("shows a validation error when submitting without text", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Add insight" }));

    fireEvent.submit(screen.getByRole("form", { name: "Add insight" }));

    expect(screen.getByText("Insight text is required")).toBeTruthy();
  });
});
