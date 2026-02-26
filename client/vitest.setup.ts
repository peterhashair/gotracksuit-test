import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    LayoutGroup: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    motion: new Proxy({} as Record<string, React.FC>, {
      get: (_target, tag: string) =>
        ({ children, animate, initial, exit, variants, layout, transition, ...props }: Record<string, unknown>) =>
          React.createElement(
            tag as keyof JSX.IntrinsicElements,
            props as Record<string, unknown>,
            children as React.ReactNode,
          ),
    }),
  };
});
