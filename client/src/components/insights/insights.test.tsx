import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Insights } from "./insights.tsx";

const TEST_INSIGHTS = [
  {
    id: 1,
    brandId: 1,
    createdAt: new Date(),
    text: "Test insight",
  },
  { id: 2, brandId: 2, createdAt: new Date(), text: "Another test insight" },
];

describe("insights", () => {
  it("renders", () => {
    const { getByText } = render(<Insights insights={TEST_INSIGHTS} />);
    expect(getByText(TEST_INSIGHTS[0].text)).toBeTruthy();
  });

  it("shows empty state when no insights", () => {
    render(<Insights insights={[]} />);
    expect(screen.getByText("We have no insight!")).toBeTruthy();
  });

  it("calls onInsightDeleted after a successful delete", async () => {
    const onInsightDeleted = vi.fn();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { container } = render(
      <Insights insights={TEST_INSIGHTS} onInsightDeleted={onInsightDeleted} />,
    );

    const trashIcons = container.querySelectorAll("svg");
    fireEvent.click(trashIcons[0]);

    await vi.waitFor(() => expect(onInsightDeleted).toHaveBeenCalledOnce());
  });

  it("shows error message when delete fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

    const { container } = render(<Insights insights={TEST_INSIGHTS} />);

    const trashIcons = container.querySelectorAll("svg");
    fireEvent.click(trashIcons[0]);

    await screen.findByText("Failed to delete insight");
  });
});
