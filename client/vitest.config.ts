import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    root: "./src",
    plugins: [react(), deno()],
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
    },
});
