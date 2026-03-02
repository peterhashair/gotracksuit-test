import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Modal } from "./modal.tsx";

describe("Modal", () => {
  it("does not render content when closed", () => {
    render(
      <Modal open={false} onClose={() => undefined}>
        <Modal.Title>My title</Modal.Title>
        <Modal.Content>Closed modal</Modal.Content>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>,
    );
    expect(screen.queryByText("Closed modal")).toBeFalsy();
  });

  it("renders all sub-components when open", () => {
    render(
      <Modal open onClose={() => undefined}>
        <Modal.CloseIcon />
        <Modal.Title>My title</Modal.Title>
        <Modal.Content>Modal body</Modal.Content>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>,
    );
    expect(screen.getByText("My title")).toBeTruthy();
    expect(screen.getByText("Modal body")).toBeTruthy();
    expect(screen.getByText("Footer")).toBeTruthy();
  });
});
