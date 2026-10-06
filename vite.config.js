import { defineConfig } from "vite";
import { renderPortfolio } from "./scripts/render-content.mjs";

export default defineConfig({
  base: "/",
  plugins: [
    {
      name: "portfolio-content",
      transformIndexHtml: {
        order: "pre",
        handler: (html) =>
          html.replace("<!-- portfolio -->", renderPortfolio()),
      },
      handleHotUpdate({ file, server }) {
        if (
          file.endsWith("content.js") ||
          file.endsWith("render-content.mjs")
        ) {
          server.ws.send({ type: "full-reload" });
        }
      },
    },
  ],
  build: { sourcemap: false },
});
